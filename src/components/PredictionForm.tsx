"use client";

import { useEffect, useCallback, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function PredictionForm() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const [isContextOpen, setIsContextOpen] = useState(false);
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

  const toggleContext = useCallback(() => {
    setIsContextOpen((prev) => !prev);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  if (!isSDKLoaded) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white p-4">
      <header className="flex justify-between items-center">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Image src="/user-pfp.png" alt="User PFP" width={40} height={40} className="rounded-full" />
          <div>
            <p className="text-sm font-semibold">Username</p>
            <p className="text-xs text-gray-400">Points: 100</p>
          </div>
        </motion.div>

        <button onClick={toggleMenu} className="p-2">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {menuOpen && (
        <motion.nav
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          exit={{ x: 100 }}
          className="absolute top-16 right-4 bg-gray-800 p-4 rounded-lg shadow-lg"
        >
          <ul className="space-y-2">
            <li className="hover:text-yellow-400 cursor-pointer">Home</li>
            <li className="hover:text-yellow-400 cursor-pointer">Profile</li>
            <li className="hover:text-yellow-400 cursor-pointer">Earn</li>
          </ul>
        </motion.nav>
      )}

      <main className="mt-10 text-center">
        <motion.h1
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Matchday 25
        </motion.h1>

        <div className="flex justify-center items-center mt-6 gap-4">
          <Image src="/arsenal-logo.png" alt="Arsenal" width={50} height={50} />
          <select className="w-12 text-center bg-white text-black rounded p-1">
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <span>vs</span>
          <select className="w-12 text-center bg-white text-black rounded p-1">
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <Image src="/chelsea-logo.png" alt="Chelsea" width={50} height={50} />
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Select Man of the Match</h2>
          <div className="flex justify-center gap-4">
            <select className="w-40 text-center bg-white text-black rounded p-1">
              {Array.from({ length: 22 }, (_, i) => (
                <option key={i} value={`Arsenal Player ${i + 1}`}>{`Arsenal Player ${i + 1}`}</option>
              ))}
            </select>
            <span>or</span>
            <select className="w-40 text-center bg-white text-black rounded p-1">
              {Array.from({ length: 22 }, (_, i) => (
                <option key={i} value={`Chelsea Player ${i + 1}`}>{`Chelsea Player ${i + 1}`}</option>
              ))}
            </select>
          </div>
        </div>
      </main>
    </div>
  );
}
