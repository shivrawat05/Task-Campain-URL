import { dbQuery } from '../config/database.js';

export class ClickModel {
  static async recordClick({ campaign_id, ip_address, user_agent, referer }) {
    const sql = `
      INSERT INTO clicks (campaign_id, ip_address, user_agent, referer)
      VALUES (?, ?, ?, ?)
    `;
    const result = await dbQuery.run(sql, [campaign_id, ip_address, user_agent, referer]);
    return result.lastID;
  }

  static async findByCampaignId(campaignId, limit = 50) {
    const sql = `
      SELECT id, campaign_id, ip_address, user_agent, referer, clicked_at
      FROM clicks
      WHERE campaign_id = ?
      ORDER BY clicked_at DESC
      LIMIT ?
    `;
    return await dbQuery.all(sql, [campaignId, limit]);
  }

  static async getClicksTimeline(campaignId) {
    const sql = `
      SELECT 
        DATE(clicked_at) as date,
        COUNT(*) as count
      FROM clicks
      WHERE campaign_id = ?
      GROUP BY DATE(clicked_at)
      ORDER BY date ASC
    `;
    return await dbQuery.all(sql, [campaignId]);
  }
}
