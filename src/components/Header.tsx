"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

export default function Header({ menuOpen, toggleMenu }: HeaderProps) {
  return (
    <header className="flex justify-between items-center w-full bg-gray-600 relative z-10">
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
  );
}