"use client";

import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/HomePage"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <HomePage/>
    </main>
  );
}