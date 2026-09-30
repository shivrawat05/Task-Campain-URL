import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { config } from "./env.js";

const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sqlite = config.nodeEnv === "development" ? sqlite3.verbose() : sqlite3;

const db = new sqlite.Database(config.dbPath, (err) => {
  if (err) {
    console.error("Failed to connect to SQLite database:", err.message);
  } else {
    console.log(` Connected to SQLite database at ${config.dbPath}`);
  }
});

export const dbQuery = {
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },

  exec: (sql) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },
};

export async function initializeDatabase() {
  try {
    await dbQuery.run("PRAGMA foreign_keys = ON;");

    await dbQuery.exec(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        destination_url TEXT NOT NULL,
        status TEXT CHECK(status IN ('active', 'paused')) NOT NULL DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_campaigns_campaign_id ON campaigns(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

      CREATE TABLE IF NOT EXISTS clicks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        campaign_id TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        referer TEXT,
        clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES campaigns (campaign_id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_clicks_campaign_id ON clicks(campaign_id);
      CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);
    `);

    const countResult = await dbQuery.get(
      "SELECT COUNT(*) as count FROM campaigns",
    );
    if (countResult && countResult.count === 0) {
      console.log(" Seeding initial sample campaigns...");
      const sampleCampaigns = [
        {
          campaign_id: "summer-sale-2026",
          name: "Summer Mega Sale 2026",
          destination_url: "https://example.com/summer-sale",
          status: "active",
        },
        {
          campaign_id: "black-friday-early",
          name: "Early Black Friday Deals",
          destination_url: "https://example.com/black-friday",
          status: "paused",
        },
        {
          campaign_id: "newsletter-welcome",
          name: "Weekly Newsletter Subscriber Welcome",
          destination_url: "https://example.com/welcome-gift",
          status: "active",
        },
        {
          campaign_id: "product-launch-v2",
          name: "Product V2 Launch Showcase",
          destination_url: "https://example.com/product-launch",
          status: "active",
        },
      ];

      for (const c of sampleCampaigns) {
        await dbQuery.run(
          `INSERT INTO campaigns (campaign_id, name, destination_url, status) VALUES (?, ?, ?, ?)`,
          [c.campaign_id, c.name, c.destination_url, c.status],
        );
      }

      const sampleClicks = [
        {
          campaign_id: "summer-sale-2026",
          ip: "127.0.0.1",
          ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          ref: "https://twitter.com",
        },
        {
          campaign_id: "summer-sale-2026",
          ip: "192.168.1.10",
          ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
          ref: "https://instagram.com",
        },
        {
          campaign_id: "summer-sale-2026",
          ip: "10.0.0.4",
          ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          ref: "Direct",
        },
        {
          campaign_id: "newsletter-welcome",
          ip: "127.0.0.1",
          ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          ref: "https://mail.google.com",
        },
        {
          campaign_id: "product-launch-v2",
          ip: "172.16.0.2",
          ua: "Mozilla/5.0 (X11; Linux x86_64)",
          ref: "https://linkedin.com",
        },
      ];

      for (const clk of sampleClicks) {
        await dbQuery.run(
          `INSERT INTO clicks (campaign_id, ip_address, user_agent, referer) VALUES (?, ?, ?, ?)`,
          [clk.campaign_id, clk.ip, clk.ua, clk.ref],
        );
      }
      console.log("Seed data inserted successfully");
    }
  } catch (error) {
    console.error(" Database initialization error:", error);
    throw error;
  }
}

export default db;
