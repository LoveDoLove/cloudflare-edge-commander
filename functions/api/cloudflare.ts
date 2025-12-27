import { NextRequest, NextResponse } from 'next/server';

// Mandatory for Cloudflare Pages/Workers to ensure the route is handled by the Edge runtime
export const runtime = 'edge';

interface ProxyRequestBody {
  endpoint: string;
  email: string;
  key: string;
  method?: string;
  body?: any;
}

/**
 * Handle OPTIONS requests (CORS/Pre-flight)
 * Even on same-origin, some browsers/proxies trigger this, 
 * and missing it can result in a 405 on certain Cloudflare configurations.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Email, X-Auth-Key',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as ProxyRequestBody;
    const { endpoint, email, key, method = 'GET', body } = data;

    if (!endpoint || !email || !key) {
      return NextResponse.json(
        { success: false, errors: [{ message: 'Missing required parameters' }] },
        { status: 400 }
      );
    }

    // Proxy the request to Cloudflare API
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
    
    return NextResponse.json(responseData, { 
      status: cfResponse.status,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, errors: [{ message: 'Edge Proxy Error: ' + error.message }] },
      { status: 500 }
    );
  }
}