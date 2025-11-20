import { NextResponse } from "next/server";
import { fetchLiveMarketFeed } from "../../lib/fetchLiveMarketFeed";

export async function GET() {
  try {
    const data = await fetchLiveMarketFeed();

    if (!data) {
      return NextResponse.json(
        { error: "Failed to load live feed" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API /livemarketfeed error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}