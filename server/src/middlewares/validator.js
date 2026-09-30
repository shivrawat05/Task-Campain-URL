import { ApiError } from '../utils/apiError.js';

export function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

export function isValidCampaignId(id) {
  const regex = /^[a-zA-Z0-9_-]{2,50}$/;
  return regex.test(id);
}

export function validateCreateCampaign(req, res, next) {
  const { name, campaign_id, destination_url, status } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    errors.name = 'Campaign name is required and must be between 2 and 100 characters.';
  }

  if (!campaign_id || typeof campaign_id !== 'string') {
    errors.campaign_id = 'Campaign ID is required.';
  } else if (!isValidCampaignId(campaign_id.trim())) {
    errors.campaign_id = 'Campaign ID must be 2-50 characters containing only letters, numbers, hyphens, and underscores.';
  }

  if (!destination_url || typeof destination_url !== 'string') {
    errors.destination_url = 'Destination URL is required.';
  } else if (!isValidUrl(destination_url.trim())) {
    errors.destination_url = 'Destination URL must be a valid HTTP or HTTPS URL (e.g. https://example.com).';
  }

  if (status && !['active', 'paused'].includes(status)) {
    errors.status = 'Status must be either "active" or "paused".';
  }

  if (Object.keys(errors).length > 0) {
    return next(ApiError.unprocessable('Validation failed', errors));
  }

  req.body.name = name.trim();
  req.body.campaign_id = campaign_id.trim();
  req.body.destination_url = destination_url.trim();
  req.body.status = status || 'active';

  next();
}

export function validateUpdateCampaign(req, res, next) {
  const { name, destination_url, status } = req.body;
  const errors = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      errors.name = 'Campaign name must be between 2 and 100 characters.';
    } else {
      req.body.name = name.trim();
    }
  }

  if (destination_url !== undefined) {
    if (typeof destination_url !== 'string' || !isValidUrl(destination_url.trim())) {
      errors.destination_url = 'Destination URL must be a valid HTTP or HTTPS URL.';
    } else {
      req.body.destination_url = destination_url.trim();
    }
  }

  if (status !== undefined) {
    if (!['active', 'paused'].includes(status)) {
      errors.status = 'Status must be either "active" or "paused".';
    }
  }

  if (Object.keys(errors).length > 0) {
    return next(ApiError.unprocessable('Validation failed', errors));
  }

  next();
}
