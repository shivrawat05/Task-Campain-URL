import { CampaignService } from '../services/campaign.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class CampaignController {
  static async getAll(req, res, next) {
    try {
      const { search, status } = req.query;
      const campaigns = await CampaignService.getAllCampaigns({ search, status });
      return ApiResponse.success(res, campaigns, 'Campaigns retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getOverviewStats(req, res, next) {
    try {
      const stats = await CampaignService.getDashboardOverview();
      return ApiResponse.success(res, stats, 'Dashboard statistics retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const campaign = await CampaignService.getCampaignById(Number(id));
      return ApiResponse.success(res, campaign, 'Campaign retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const newCampaign = await CampaignService.createCampaign(req.body);
      return ApiResponse.success(res, newCampaign, 'Campaign created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const updatedCampaign = await CampaignService.updateCampaign(Number(id), req.body);
      return ApiResponse.success(res, updatedCampaign, 'Campaign updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedCampaign = await CampaignService.toggleCampaignStatus(Number(id), status);
      return ApiResponse.success(res, updatedCampaign, `Campaign status updated to ${updatedCampaign.status}`);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await CampaignService.deleteCampaign(Number(id));
      return ApiResponse.success(res, result, 'Campaign deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getAnalytics(req, res, next) {
    try {
      const { id } = req.params;
      const analytics = await CampaignService.getCampaignAnalytics(Number(id));
      return ApiResponse.success(res, analytics, 'Campaign analytics retrieved');
    } catch (error) {
      next(error);
    }
  }
}
