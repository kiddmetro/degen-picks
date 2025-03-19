"use client";

import { IoFootball } from "react-icons/io5";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
      <IoFootball size={50} style={{ color: "var(--app-color)" }} className="animate-spin" />
    </div>
  );
}