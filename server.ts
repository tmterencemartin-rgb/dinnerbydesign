import path from "path";
import dotenv from "dotenv";
import { createApp } from "./src/api-server";

dotenv.config({ path: ".env.local" });
dotenv.config();

process.on("uncaughtException", (err) => {
  console.error("FATAL UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("FATAL UNHANDLED REJECTION at:", promise, "reason:", reason);
});

async function startServer() {
  const PORT = Number(process.env.PORT || 3000);
  
  // Ensure NODE_ENV is set for the app logic
  if (!process.env.NODE_ENV) {
    const isCompiled = process.argv[1]?.includes('dist') || false;
    process.env.NODE_ENV = isCompiled ? "production" : "development";
  }

  console.log(`[Server] Booting in ${process.env.NODE_ENV} mode...`);
  
  const app = await createApp();
  
  // Only listen if not running as a Vercel function
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }
  
  return app;
}

const appPromise = startServer();

const handler = async (req: any, res: any) => {
  try {
    const app = await appPromise;
    return app(req, res);
  } catch (err) {
    console.error("[Vercel Handler] Global Error:", err);
    res.status(500).json({ error: "Internal Server Error during boot" });
  }
};

// Export for ESM (tsx)
export { createApp };
export default handler;

// For CJS bundling compatibility - ensures the bundle's module.exports is the handler function
if (typeof module !== 'undefined' && module.exports) {
  Object.assign(handler, { createApp, default: handler });
  module.exports = handler;
}
