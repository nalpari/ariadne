export async function GET() {
  return Response.json({ ok: true, service: "ariadne", timestamp: new Date().toISOString() });
}
