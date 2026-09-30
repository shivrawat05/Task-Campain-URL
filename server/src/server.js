import app from "./app.js";
import { config } from "./config/env.js";
import { initializeDatabase } from "./config/database.js";

async function bootstrap() {
  try {
    await initializeDatabase();

    const server = app.listen(config.port, () => {});

    const shutdown = (signal) => {
      console.log(`\n Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log(" HTTP server closed.");
        process.exit(0);
      });

      setTimeout(() => {
        console.error(" Forcing shutdown due to timeout.");
        process.exit(1);
      }, 5000);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error(" Failed to start application:", error);
    process.exit(1);
  }
}

bootstrap();
