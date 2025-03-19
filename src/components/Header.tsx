"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    console.log("Toggling menu, current state:", menuOpen);
    setMenuOpen((prev) => !prev);
  };

  // Navigation items for hamburger menu (Added Predict)
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Predict", href: "/predict" }, // Added Predict
    { name: "Profile", href: "/profile" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Rewards", href: "/rewards" },
  ];

  return (
    <header className="flex justify-between items-center w-full max-w-3xl mx-auto p-4 relative z-50">
      <div className="flex items-center gap-2">
        <Image src="/degen-logo.png" alt="Degen Logo" width={24} height={24} />
        <h1 style={{ color: "var(--app-color)" }} className="text-xl font-bold">
          Degen Picks
        </h1>
      </div>

      <button
        onClick={toggleMenu}
        className="p-2 z-60"
        style={{ position: "relative" }}
      >
        {menuOpen ? <X size={28} className="text-gray-800" /> : <Menu size={28} className="text-gray-800" />}
      </button>

      {menuOpen && (
        <motion.nav
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          exit={{ x: 100 }}
          className="absolute top-16 right-4 bg-gray-300 p-4 rounded-lg shadow-lg z-60 w-48"
          style={{ pointerEvents: "auto" }}
        >
          <ul className="space-y-0">
            {navItems.map((item, index) => (
              <li
                key={item.name}
                className={`py-2 px-4 text-gray-800 font-medium ${
                  item.href === pathname ? "bg-[var(--app-color)] text-white" : "hover:bg-gray-200"
                } ${index !== navItems.length - 1 ? "border-b border-white" : ""}`}
              >
                <Link href={item.href} onClick={toggleMenu} className="block w-full h-full">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </header>
  );
}