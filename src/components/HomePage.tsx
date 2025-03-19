"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { FaFootballBall } from "react-icons/fa";

export default function HomePage() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Sample EPL player images (replace with actual URLs)
  const playerImages = [
    "/player1.jpg", "/player2.jpg", "/player3.jpg", "/player4.jpg", "/player5.jpg",
    "/player6.jpg", "/player7.jpg", "/player8.jpg", "/player9.jpg", "/player10.jpg"
  ];

  // Image dimensions
  const imageWidth = 150;
  const imageHeight = 225;
  const spacing = 16;
  const totalWidthPerSet = playerImages.length * (imageWidth + spacing);

  // Positions for the 7 degen-logos
  const logoPositions = [
    { top: "10%", left: "15%" },
    { top: "25%", left: "70%" },
    { top: "40%", left: "30%" },
    { top: "55%", left: "85%" },
    { top: "70%", left: "20%" },
    { top: "85%", left: "60%" },
    { top: "15%", left: "45%" },
  ];

  if (!isSDKLoaded) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="relative h-screen bg-gradient-to-b from-gray-200 via-white to-gray-400 text-white flex flex-col overflow-hidden">
      {/* Background Degen Logos */}
      {logoPositions.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ top: pos.top, left: pos.left }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src="/degen-logo.png"
            alt="Degen Logo"
            width={30}
            height={30}
            className="opacity-30"
          />
        </motion.div>
      ))}

      {/* Header */}
      <header className="flex justify-between items-center w-full max-w-3xl mx-auto p-4 relative z-10">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Image src="/user-pfp.png" alt="User PFP" width={40} height={40} className="rounded-full" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Username</p>
            <p className="text-xs text-gray-600">Points: 100</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <Image src="/degen-logo.png" alt="Degen Logo" width={24} height={24} />
          <h1 style={{ color: "var(--app-color)" }} className="text-xl font-bold">Degen Picks</h1>
        </div>

        <button onClick={toggleMenu} className="p-2">
          {menuOpen ? <X size={28} className="text-gray-800" /> : <Menu size={28} className="text-gray-800" />}
        </button>
      </header>

      {/* Background Football Animation */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 opacity-20 z-0"
        initial={{ y: -50 }}
        animate={{ y: "80vh" }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <FaFootballBall size={60} className="text-gray-800" />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {menuOpen && (
          <motion.nav
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            exit={{ x: 100 }}
            className="absolute top-16 right-4 bg-gray-800 p-4 rounded-lg shadow-lg z-20"
          >
            <ul className="space-y-2">
              <li className="hover:text-yellow-400 cursor-pointer text-white">Home</li>
              <li className="hover:text-yellow-400 cursor-pointer text-white">Profile</li>
              <li className="hover:text-yellow-400 cursor-pointer text-white">Earn</li>
            </ul>
          </motion.nav>
        )}

        {/* Prediction Section */}
        <section className="p-4 text-center relative z-10">
          <motion.h1
            className="text-4xl font-bold mb-4 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: "var(--app-color)" }}
          >
            PREMIER LEAGUE 2024/2025
          </motion.h1>
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Image
              src="/epl-logo.jpg" // Adjust path as needed
              alt="EPL Logo"
              width={60}
              height={60}
              className="rounded-full mx-auto"
            />
          </motion.div>
          <p className="text-lg text-gray-600 mb-4">
            Predict correct scores, Earn Points & Rewards in $DEGEN
          </p>
          <motion.button
            style={{ backgroundColor: "var(--app-color)" }}
            className="px-6 py-3 text-white font-bold rounded-lg shadow-lg hover:bg-opacity-90 transition mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            Start Predicting
          </motion.button>

          <p className="mt-4 text-sm text-gray-600">
            Matchday 25 - Predictions Close in 2h 30m
          </p>
        </section>

        {/* Sliding Player Section */}
        <section className="py-8 relative z-10 overflow-hidden">
          <motion.div
            className="flex space-x-4"
            initial={{ x: 0 }}
            animate={isSDKLoaded ? { x: -totalWidthPerSet } : { x: 0 }}
            transition={{ delay: 0.5, duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {/* Original set */}
            {playerImages.map((src, index) => (
              <div key={index} className="flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Image
                    src={src}
                    alt={`Player ${index + 1}`}
                    width={imageWidth}
                    height={imageHeight}
                    className="rounded-lg object-cover"
                  />
                </motion.div>
              </div>
            ))}
            {/* Duplicate set for seamless looping */}
            {playerImages.map((src, index) => (
              <div key={`duplicate-${index}`} className="flex-shrink-0">
                <motion.div>
                  <Image
                    src={src}
                    alt={`Player ${index + 1}`}
                    width={imageWidth}
                    height={imageHeight}
                    className="rounded-lg object-cover"
                  />
                </motion.div>
              </div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
}