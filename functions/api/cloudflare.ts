/**
 * Cloudflare Pages Function - API Proxy
 * This replaces the Next.js API route for Static Exports.
 * It is automatically deployed by Cloudflare when found in the /functions folder.
 */

export async function onRequestPost(context: any) {
  const { request } = context;

  try {
    const data: any = await request.json();
    const { endpoint, email, key, method = 'GET', body } = data;

    if (!endpoint || !email || !key) {
      return new Response(
        JSON.stringify({ success: false, errors: [{ message: 'Missing required parameters' }] }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Proxy the request directly to the Cloudflare API
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
    
    return new Response(JSON.stringify(responseData), {
      status: cfResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, errors: [{ message: 'Functions Proxy Error: ' + error.message }] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle pre-flight OPTIONS requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Email, X-Auth-Key',
    },
  });
}