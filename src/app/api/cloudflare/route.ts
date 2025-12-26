import { NextRequest, NextResponse } from 'next/server';

/**
 * Interface for the expected request body
 */
interface ProxyRequestBody {
  endpoint: string;
  email: string;
  key: string;
  method?: string;
  body?: any;
}

/**
 * Next.js API Route - Cloudflare Proxy
 * This runs on the server side (Cloudflare Workers/Pages) to bypass CORS
 * and keep API calls secure.
 */
export async function POST(req: NextRequest) {
  try {
    // Explicitly cast the JSON body to our interface to satisfy TypeScript
    const data = await req.json() as ProxyRequestBody;
    const { endpoint, email, key, method = 'GET', body } = data;

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

    const responseData = await cfResponse.json();
    
    // Return the Cloudflare response directly to the client
    return NextResponse.json(responseData, { status: cfResponse.status });
  } catch (error: any) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { success: false, errors: [{ message: 'Internal Proxy Error: ' + error.message }] },
      { status: 500 }
    );
  }
}