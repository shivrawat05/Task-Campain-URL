import { dbQuery } from '../config/database.js';

export class CampaignModel {
  static async findAll({ search = '', status = '' } = {}) {
    let sql = `
      SELECT 
        c.id,
        c.campaign_id,
        c.name,
        c.destination_url,
        c.status,
        c.created_at,
        c.updated_at,
        COUNT(cl.id) AS total_clicks,
        MAX(cl.clicked_at) AS last_clicked_at
      FROM campaigns c
      LEFT JOIN clicks cl ON c.campaign_id = cl.campaign_id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND c.status = ?';
      params.push(status);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (c.name LIKE ? OR c.campaign_id LIKE ? OR c.destination_url LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' GROUP BY c.id ORDER BY c.created_at DESC';

    return await dbQuery.all(sql, params);
  }

  static async findById(id) {
    const sql = `
      SELECT 
        c.id,
        c.campaign_id,
        c.name,
        c.destination_url,
        c.status,
        c.created_at,
        c.updated_at,
        COUNT(cl.id) AS total_clicks,
        MAX(cl.clicked_at) AS last_clicked_at
      FROM campaigns c
      LEFT JOIN clicks cl ON c.campaign_id = cl.campaign_id
      WHERE c.id = ?
      GROUP BY c.id
    `;
    return await dbQuery.get(sql, [id]);
  }

  static async findByCampaignId(campaignId) {
    const sql = `
      SELECT 
        c.id,
        c.campaign_id,
        c.name,
        c.destination_url,
        c.status,
        c.created_at,
        c.updated_at,
        COUNT(cl.id) AS total_clicks
      FROM campaigns c
      LEFT JOIN clicks cl ON c.campaign_id = cl.campaign_id
      WHERE c.campaign_id = ?
      GROUP BY c.id
    `;
    return await dbQuery.get(sql, [campaignId]);
  }

  static async create({ campaign_id, name, destination_url, status = 'active' }) {
    const sql = `
      INSERT INTO campaigns (campaign_id, name, destination_url, status)
      VALUES (?, ?, ?, ?)
    `;
    const result = await dbQuery.run(sql, [campaign_id, name, destination_url, status]);
    return await this.findById(result.lastID);
  }

  static async update(id, { name, destination_url, status }) {
    const updates = [];
    const params = [];

    if (name !== undefined) {
      updates.push('name = ?');
      params.push(name);
    }
    if (destination_url !== undefined) {
      updates.push('destination_url = ?');
      params.push(destination_url);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    updates.push("updated_at = datetime('now')");
    params.push(id);

    const sql = `UPDATE campaigns SET ${updates.join(', ')} WHERE id = ?`;
    await dbQuery.run(sql, params);
    return await this.findById(id);
  }

  static async updateStatus(id, status) {
    const sql = `UPDATE campaigns SET status = ?, updated_at = datetime('now') WHERE id = ?`;
    await dbQuery.run(sql, [status, id]);
    return await this.findById(id);
  }

  static async delete(id) {
    const campaign = await this.findById(id);
    if (!campaign) return null;

    await dbQuery.run('DELETE FROM clicks WHERE campaign_id = ?', [campaign.campaign_id]);
    await dbQuery.run('DELETE FROM campaigns WHERE id = ?', [id]);
    return campaign;
  }

  static async getOverviewStats() {
    const totalCampaigns = await dbQuery.get('SELECT COUNT(*) as count FROM campaigns');
    const activeCampaigns = await dbQuery.get("SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'");
    const pausedCampaigns = await dbQuery.get("SELECT COUNT(*) as count FROM campaigns WHERE status = 'paused'");
    const totalClicks = await dbQuery.get('SELECT COUNT(*) as count FROM clicks');

    const topCampaign = await dbQuery.get(`
      SELECT c.name, c.campaign_id, COUNT(cl.id) as clicks
      FROM campaigns c
      LEFT JOIN clicks cl ON c.campaign_id = cl.campaign_id
      GROUP BY c.id
      ORDER BY clicks DESC
      LIMIT 1
    `);

    return {
      totalCampaigns: totalCampaigns?.count || 0,
      activeCampaigns: activeCampaigns?.count || 0,
      pausedCampaigns: pausedCampaigns?.count || 0,
      totalClicks: totalClicks?.count || 0,
      topCampaign: topCampaign?.clicks > 0 ? topCampaign : null
    };
  }
}
