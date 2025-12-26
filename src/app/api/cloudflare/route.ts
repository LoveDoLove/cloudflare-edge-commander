import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js API Route - Cloudflare Proxy
 * This runs on the server side (Cloudflare Workers/Pages) to bypass CORS
 * and keep API calls secure.
 */
export async function POST(req: NextRequest) {
  try {
    const { endpoint, email, key, method = 'GET', body } = await req.json();

    if (!endpoint || !email || !key) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'Missing required proxy parameters' }] },
        { status: 400 }
      );
    }

    const cfResponse = await fetch(`https://api.cloudflare.com/client/v4/${endpoint}`, {
      method,
      headers: {
        'X-Auth-Email': email,
        'X-Auth-Key': key,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await cfResponse.json();
    
    // Return the Cloudflare response directly to the client
    return NextResponse.json(data, { status: cfResponse.status });
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { success: false, errors: [{ message: 'Internal Proxy Error: ' + error.message }] },
      { status: 500 }
    );
  }
}