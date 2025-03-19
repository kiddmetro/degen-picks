export async function fetchFixtures() {
    // Replace with real API call
    const response = await fetch("https://fantasy.premierleague.com/api/fixtures/");
    const data = await response.json();
    return data.slice(0, 5); // Example: Take first 5 fixtures
  }