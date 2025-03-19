"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaFootballBall } from "react-icons/fa";
import Header from "./Header";
import BackgroundLogos from "./BackgroundLogos"; // Import reusable background
import Link from "next/link";

export default function HomePage() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

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

  if (!isSDKLoaded) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-200 via-white to-gray-400 text-white flex flex-col"> {/* Removed h-screen and overflow-hidden */}
      {/* Reusable Background Degen Logos */}
      <BackgroundLogos />

      {/* Header */}
      <Header />

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
        {/* Prediction Section */}
        <section className="p-4 text-center relative z-10">
          <motion.h1
            className="text-4xl font-bold mb-8 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            PREMIER LEAGUE 2024/2025
          </motion.h1>
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Image
              src="/epl-logo.png"
              alt="EPL Logo"
              width={60}
              height={60}
              className="rounded-full mx-auto"
            />
          </motion.div>
          <p className="text-lg text-gray-600 mb-8">
            Predict correct scores, earn points and add the remaining
          </p>
          <Link href="/predict">
            <motion.button
              style={{ backgroundColor: "var(--app-color)" }}
              className="px-6 py-3 text-white font-bold rounded-lg shadow-lg hover:bg-opacity-90 transition mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              Start Predicting
            </motion.button>
          </Link>

          <p className="mt-6 text-sm text-gray-600">
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

        {/* How to Play Section */}
        <section className="p-4 text-center relative z-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Play</h2>
          <p className="text-gray-600 mb-6">
            Placeholder: Instructions on how to predict scores and participate in Degen Picks.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">How Points Are Given</h2>
          <p className="text-gray-600">
            Placeholder: Explanation of the points system for correct predictions.
          </p>
        </section>
      </div>
    </div>
  );
}