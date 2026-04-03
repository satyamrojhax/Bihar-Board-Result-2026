import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rollCode = searchParams.get("roll_code");
  const rollNo = searchParams.get("roll_no");

  if (!rollCode || !rollNo) {
    return NextResponse.json(
      { success: false, error: "Roll Code and Roll Number are required" },
      { status: 400 }
    );
  }

  // Validate inputs
  if (!/^\d+$/.test(rollCode) || !/^\d+$/.test(rollNo)) {
    return NextResponse.json(
      { success: false, error: "Invalid Roll Code or Roll Number" },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `https://resultapi.biharboardonline.org/result?roll_code=${encodeURIComponent(rollCode)}&roll_no=${encodeURIComponent(rollNo)}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "origin": "https://result.biharboardonline.org",
        "priority": "u=1, i",
        "referer": "https://result.biharboardonline.org/",
        "sec-ch-ua": '"Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Mobile Safari/537.36",
        "authority": "resultapi.biharboardonline.org",
        "method": "GET",
        "path": `/result?roll_code=${rollCode}&roll_no=${rollNo}`,
        "scheme": "https"
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch result. Please try again later.`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching result:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to connect to the result server. Please try again later.",
      },
      { status: 500 }
    );
  }
}
