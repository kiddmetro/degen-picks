"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BackgroundLogos() {
  const logoPositions = [
    { top: "8%", left: "12%" },
    { top: "22%", left: "78%" },
    { top: "15%", left: "45%" },
    { top: "35%", left: "25%" },
    { top: "28%", left: "90%" },
    { top: "45%", left: "60%" },
    { top: "60%", left: "15%" },
    { top: "52%", left: "82%" },
    { top: "70%", left: "38%" },
    { top: "65%", left: "95%" },
    { top: "80%", left: "20%" },
    { top: "75%", left: "55%" },
    { top: "90%", left: "70%" },
    { top: "85%", left: "10%" },
    { top: "40%", left: "40%" },
  ];

  return (
    <>
      {logoPositions.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute z-0"
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
    </>
  );
}