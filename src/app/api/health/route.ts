export async function GET() {
  return Response.json({
    status: "ok",
    app: process.env.APP_NAME ?? null,
    time: new Date().toISOString(),
  });
}
