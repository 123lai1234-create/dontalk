export const config = { runtime: "edge" };

const BACKEND = "https://ddd-8888uhiuh.replit.app";

export default async function handler(req) {
  const incoming = new URL(req.url);
  const target = BACKEND + incoming.pathname + incoming.search;

  const headers = new Headers(req.headers);
  // Let fetch set the correct Host for the backend; Replit routes by Host.
  headers.delete("host");

  const init = {
    method: req.method,
    headers,
    redirect: "manual",
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  let upstream;
  try {
    upstream = await fetch(target, init);
  } catch (err) {
    return new Response(
      JSON.stringify({ status: "error", message: "Upstream fetch failed" }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }

  const respHeaders = new Headers(upstream.headers);
  // fetch already decoded the body; drop encoding/length so the client
  // doesn't try to re-decode an already-decompressed stream.
  respHeaders.delete("content-encoding");
  respHeaders.delete("content-length");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: respHeaders,
  });
}
