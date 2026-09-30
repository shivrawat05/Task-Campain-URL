import { CampaignModel } from '../models/campaign.model.js';
import { ClickModel } from '../models/click.model.js';
import { ApiError } from '../utils/apiError.js';
import { config } from '../config/env.js';

export class CampaignService {
  static formatCampaign(campaign) {
    if (!campaign) return null;
    return {
      ...campaign,
      tracking_url: `${config.baseUrl}/r/${campaign.campaign_id}`
    };
  }

  static async getAllCampaigns(filters) {
    const campaigns = await CampaignModel.findAll(filters);
    return campaigns.map(this.formatCampaign);
  }

  static async getCampaignById(id) {
    const campaign = await CampaignModel.findById(id);
    if (!campaign) {
      throw ApiError.notFound(`Campaign with ID ${id} not found.`);
    }
    return this.formatCampaign(campaign);
  }

  static async createCampaign(payload) {
    const existing = await CampaignModel.findByCampaignId(payload.campaign_id);
    if (existing) {
      throw ApiError.conflict(`Campaign ID "${payload.campaign_id}" already exists. Please choose a unique ID.`);
    }

    const created = await CampaignModel.create(payload);
    return this.formatCampaign(created);
  }

  static async updateCampaign(id, payload) {
    const existing = await CampaignModel.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Campaign with ID ${id} not found.`);
    }

    const updated = await CampaignModel.update(id, payload);
    return this.formatCampaign(updated);
  }

  static async toggleCampaignStatus(id, newStatus) {
    const existing = await CampaignModel.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Campaign with ID ${id} not found.`);
    }

    const targetStatus = newStatus || (existing.status === 'active' ? 'paused' : 'active');
    const updated = await CampaignModel.updateStatus(id, targetStatus);
    return this.formatCampaign(updated);
  }

  static async deleteCampaign(id) {
    const existing = await CampaignModel.findById(id);
    if (!existing) {
      throw ApiError.notFound(`Campaign with ID ${id} not found.`);
    }

    await CampaignModel.delete(id);
    return { id, campaign_id: existing.campaign_id, name: existing.name };
  }

  static async getDashboardOverview() {
    return await CampaignModel.getOverviewStats();
  }

  static async getCampaignAnalytics(id) {
    const campaign = await CampaignModel.findById(id);
    if (!campaign) {
      throw ApiError.notFound(`Campaign with ID ${id} not found.`);
    }

    const clicks = await ClickModel.findByCampaignId(campaign.campaign_id, 100);
    const timeline = await ClickModel.getClicksTimeline(campaign.campaign_id);

    return {
      campaign: this.formatCampaign(campaign),
      recent_clicks: clicks,
      timeline
    };
  }
}
