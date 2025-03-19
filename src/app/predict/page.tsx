"use client";

import { useEffect, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "../../components/Header";
import BackgroundLogos from "../../components/BackgroundLogos";

// Static mapping of team names to stadiums (approximate, based on 2025 EPL teams)
const teamToStadium: { [key: string]: string } = {
  "Arsenal": "Emirates Stadium",
  "Aston Villa": "Villa Park",
  "Bournemouth": "Vitality Stadium",
  "Brentford": "Gtech Community Stadium",
  "Brighton": "Amex Stadium",
  "Chelsea": "Stamford Bridge",
  "Crystal Palace": "Selhurst Park",
  "Everton": "Goodison Park",
  "Fulham": "Craven Cottage",
  "Ipswich Town": "Portman Road",
  "Leicester City": "King Power Stadium",
  "Liverpool": "Anfield",
  "Manchester City": "Etihad Stadium",
  "Manchester United": "Old Trafford",
  "Newcastle United": "St. James' Park",
  "Nottingham Forest": "City Ground",
  "Southampton": "St. Mary's Stadium",
  "Tottenham Hotspur": "Tottenham Hotspur Stadium",
  "West Ham United": "London Stadium",
  "Wolverhampton": "Molineux Stadium",
};

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [context, setContext] = useState<FrameContext | undefined>(undefined);
  const [matches, setMatches] = useState<any[]>([]);
  const [matchweeks, setMatchweeks] = useState<{ event: number; from: string; to: string }[]>([]);
  const [selectedMatchweek, setSelectedMatchweek] = useState<number | null>(null);
  const [teams, setTeams] = useState<{ [key: number]: string }>({});
  const [currentMatchweek, setCurrentMatchweek] = useState<number | null>(null);

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Set up Farcaster SDK context
        const frameContext = await sdk.context;
        setContext(frameContext);
        sdk.actions.ready();

        // Fetch team names from FPL
        const bootstrapRes = await fetch("/api/fpl/bootstrap-static");
        const bootstrapData = await bootstrapRes.json();
        console.log("FPL Bootstrap Response:", bootstrapData);
        if (!bootstrapData.teams) throw new Error("Invalid FPL bootstrap-static data");
        const teamMap = bootstrapData.teams.reduce((acc: any, team: any) => {
          acc[team.id] = team.name;
          return acc;
        }, {});
        setTeams(teamMap);

        // Fetch all FPL fixtures
        const fixturesRes = await fetch("/api/fpl/fixtures");
        const fixturesData = await fixturesRes.json();
        console.log("FPL Fixtures Response:", fixturesData);
        if (!Array.isArray(fixturesData) || fixturesData.length === 0) {
          console.warn("No EPL fixtures available");
          setMatches([]);
          setMatchweeks([]);
          return;
        }

        // Group fixtures by matchweek
        const groupedFixtures: { [key: number]: any[] } = {};
        fixturesData.forEach((fixture: any) => {
          const event = fixture.event || 0;
          if (!groupedFixtures[event]) groupedFixtures[event] = [];
          groupedFixtures[event].push(fixture);
        });

        // Filter and sort matchweeks (future/current only)
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        const matchweekList = Object.keys(groupedFixtures)
          .filter((event) => Number(event) > 0)
          .map((event) => {
            const fixtures = groupedFixtures[Number(event)];
            const dates = fixtures.map((f: any) => new Date(f.kickoff_time));
            const timestamps = dates.map((d) => d.getTime());
            const from = new Date(Math.min(...timestamps)).toISOString().split("T")[0];
            const to = new Date(Math.max(...timestamps)).toISOString().split("T")[0];
            return { event: Number(event), from, to };
          })
          .filter((mw) => new Date(mw.to) >= today)
          .sort((a, b) => a.event - b.event);

        setMatchweeks(matchweekList);

        // Determine current matchweek (editable if today is before or during its range)
        const current = matchweekList.find((mw) => todayStr <= mw.to) || matchweekList[0];
        if (current) setCurrentMatchweek(current.event);

        // Set initial matchweek
        if (matchweekList.length > 0) {
          const firstMatchweek = matchweekList[0];
          setSelectedMatchweek(firstMatchweek.event);
          setMatches(
            groupedFixtures[firstMatchweek.event].map((fixture: any) => ({
              id: fixture.id,
              team1: teamMap[fixture.team_h],
              team2: teamMap[fixture.team_a],
              homeScore: "",
              awayScore: "",
              liveHomeScore: fixture.finished ? fixture.team_h_score : 0,
              liveAwayScore: fixture.finished ? fixture.team_a_score : 0,
              kickoffTime: fixture.kickoff_time, // UTC from FPL
              venue: teamToStadium[teamMap[fixture.team_h]] || "Unknown Stadium",
              logo1: `/England - Premier League/${teamMap[fixture.team_h]}.png`,
              logo2: `/England - Premier League/${teamMap[fixture.team_a]}.png`,
            }))
          );
        }
      } catch (error) {
        console.error("Error loading FPL data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isLoading) return;
    loadInitialData();
  }, [isLoading]);

  // Handle matchweek change
  const handleMatchweekChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const matchweekNumber = Number(e.target.value);
    setSelectedMatchweek(matchweekNumber);

    try {
      const response = await fetch(`/api/fpl/fixtures?event=${matchweekNumber}`);
      const data = await response.json();
      console.log(`Matchweek ${matchweekNumber} Response:`, data);

      if (Array.isArray(data) && data.length > 0) {
        setMatches(
          data.map((fixture: any) => ({
            id: fixture.id,
            team1: teams[fixture.team_h],
            team2: teams[fixture.team_a],
            homeScore: "",
            awayScore: "",
            liveHomeScore: fixture.finished ? fixture.team_h_score : 0,
            liveAwayScore: fixture.finished ? fixture.team_a_score : 0,
            kickoffTime: fixture.kickoff_time, // UTC from FPL
            venue: teamToStadium[teams[fixture.team_h]] || "Unknown Stadium",
            logo1: `/England - Premier League/${teams[fixture.team_h]}.png`,
            logo2: `/England - Premier League/${teams[fixture.team_a]}.png`,
          }))
        );
      } else {
        console.warn(`No fixtures for Matchweek ${matchweekNumber}`);
        setMatches([]);
      }
    } catch (error) {
      console.error(`Error fetching Matchweek ${matchweekNumber}:`, error);
      setMatches([]);
    }
  };

  // Update prediction scores
  const handlePredictionChange = (index: number, field: "homeScore" | "awayScore", value: string) => {
    setMatches((prevMatches) =>
      prevMatches.map((match, i) =>
        i === index ? { ...match, [field]: value } : match
      )
    );
  };

  // Calculate points for a match prediction (only if both scores are set)
  const calculatePoints = (match: any) => {
    if (match.homeScore === "" || match.awayScore === "") return 0; // No points if either is unset
    const homeScore = Number(match.homeScore);
    const awayScore = Number(match.awayScore);
    if (homeScore === match.liveHomeScore && awayScore === match.liveAwayScore) return 3;
    const predictedWinner = homeScore > awayScore ? "home" : homeScore < awayScore ? "away" : "draw";
    const liveWinner = match.liveHomeScore > match.liveAwayScore ? "home" : match.liveHomeScore < match.liveAwayScore ? "away" : "draw";
    return predictedWinner === liveWinner ? 1 : 0;
  };

  // Share prediction on Twitter
  const sharePrediction = (match: any) => {
    const homeScore = match.homeScore === "" ? "X" : match.homeScore;
    const awayScore = match.awayScore === "" ? "X" : match.awayScore;
    const text = `I predicted ${match.team1} ${homeScore} - ${awayScore} ${match.team2} for Matchday ${selectedMatchweek}! #DegenPicks`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return <div className="text-center mt-10 text-gray-800">Loading EPL fixtures...</div>;
  }

  const isEditable = selectedMatchweek === currentMatchweek;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-200 via-white to-gray-400 flex flex-col">
      <BackgroundLogos />
      <Header />
      <main className="p-4 text-center relative z-10">
        {matchweeks.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-2">
            <label htmlFor="matchweek" className="text-gray-800 font-semibold">
              Select Matchweek:
            </label>
            <select
              id="matchweek"
              value={selectedMatchweek || ""}
              onChange={handleMatchweekChange}
              className="w-full sm:w-auto max-w-[90%] bg-gray-100 text-black rounded p-2 border border-gray-300 text-sm truncate"
            >
              {matchweeks.map((mw) => (
                <option key={mw.event} value={mw.event}>
                  Matchday {mw.event} ({mw.from} to {mw.to})
                </option>
              ))}
            </select>
          </div>
        )}

        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Matchday {selectedMatchweek || "N/A"}
        </motion.h1>

        {matches.length > 0 ? (
          <div className="space-y-6">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                className="bg-white rounded-2xl shadow-lg p-4 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-sm text-gray-600 mb-2">
                  <div>{new Date(match.kickoffTime).toUTCString()}</div>
                  <div>{match.venue}</div>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-1 min-w-0">
                    <Image src={match.logo1} alt={match.team1} width={24} height={24} />
                    <span className="text-gray-800 text-sm font-semibold truncate">{match.team1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="w-12 text-center bg-gray-100 text-black rounded p-1 border border-gray-300 disabled:bg-gray-200 disabled:text-gray-500"
                      value={match.homeScore}
                      onChange={(e) => handlePredictionChange(index, "homeScore", e.target.value)}
                      disabled={!isEditable}
                    >
                      <option value="">-</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                    <span className="text-gray-800">-</span>
                    <select
                      className="w-12 text-center bg-gray-100 text-black rounded p-1 border border-gray-300 disabled:bg-gray-200 disabled:text-gray-500"
                      value={match.awayScore}
                      onChange={(e) => handlePredictionChange(index, "awayScore", e.target.value)}
                      disabled={!isEditable}
                    >
                      <option value="">-</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <span className="text-gray-800 text-sm font-semibold truncate">{match.team2}</span>
                    <Image src={match.logo2} alt={match.team2} width={24} height={24} />
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  Live: {match.liveHomeScore} - {match.liveAwayScore}
                </div>

                <div className="mt-2">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${
                          match.liveHomeScore > match.liveAwayScore
                            ? 75
                            : match.liveHomeScore < match.liveAwayScore
                            ? 25
                            : 50
                        }%`,
                        backgroundColor: "var(--app-color)",
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Points Earned: {calculatePoints(match)}</p>
                </div>

                <button
                  onClick={() => sharePrediction(match)}
                  className="mt-3 px-4 py-1 bg-[var(--app-color)] text-white rounded-full text-sm hover:bg-opacity-90 transition"
                >
                  Share Prediction
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-gray-600">No EPL fixtures available at this time.</p>
        )}
      </main>
    </div>
  );
}