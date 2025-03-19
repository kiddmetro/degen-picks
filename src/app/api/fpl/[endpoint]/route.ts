import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_FPL_API_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: "FPL API URL not configured" }, { status: 500 });
  }

  // Extract endpoint and query params from the URL
  const { searchParams, pathname } = new URL(req.url);
  const endpoint = pathname.split("/api/fpl/")[1] + (searchParams.toString() ? `?${searchParams}` : "");

  const url = `${baseUrl}/${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "DegenPicks/1.0",
      },
    });
    if (!response.ok) {
      throw new Error(`FPL API responded with status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Failed to fetch from FPL API (${url}):`, error);
    return NextResponse.json({ error: "Failed to fetch FPL data" }, { status: 500 });
  }
}