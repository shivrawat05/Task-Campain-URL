import { CampaignModel } from '../models/campaign.model.js';
import { ClickModel } from '../models/click.model.js';

export class RedirectController {
  static async handleRedirect(req, res) {
    try {
      const { campaignId } = req.params;

      if (!campaignId) {
        return res.status(400).send(RedirectController.renderErrorPage('Invalid Link', 'No Campaign ID was specified.'));
      }

      const campaign = await CampaignModel.findByCampaignId(campaignId);

      if (!campaign) {
        return res.status(404).send(RedirectController.renderErrorPage(
          'Campaign Not Found',
          `We couldn't locate an active campaign with the identifier "${campaignId}". It may have expired or been removed.`
        ));
      }

      if (campaign.status === 'paused') {
        return res.status(403).send(RedirectController.renderPausedPage(campaign));
      }

      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const referer = req.headers['referer'] || req.headers['referrer'] || 'Direct';

      ClickModel.recordClick({
        campaign_id: campaign.campaign_id,
        ip_address: ip,
        user_agent: userAgent,
        referer: referer
      }).catch(err => console.error('Failed to log click event:', err));

      return res.redirect(302, campaign.destination_url);
    } catch (error) {
      console.error('Redirect controller error:', error);
      return res.status(500).send(RedirectController.renderErrorPage('Server Error', 'Unable to complete redirection at this moment.'));
    }
  }

  static renderPausedPage(campaign) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Campaign Paused - ${campaign.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0f172a;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 24px;
          }
          .card {
            background: rgba(30, 41, 59, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(16px);
            border-radius: 20px;
            padding: 48px;
            max-width: 520px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .icon-badge {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(245, 158, 11, 0.15);
            color: #f59e0b;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin-bottom: 24px;
          }
          h1 { font-size: 26px; font-weight: 700; margin-bottom: 12px; color: #ffffff; }
          p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
          .campaign-tag {
            display: inline-block;
            background: rgba(255, 255, 255, 0.05);
            padding: 8px 16px;
            border-radius: 9999px;
            font-size: 13px;
            font-family: monospace;
            color: #cbd5e1;
            margin-bottom: 28px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 9999px;
            background: rgba(245, 158, 11, 0.2);
            color: #fbbf24;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #f59e0b;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon-badge">⏸</div>
          <div style="margin-bottom: 16px;">
            <span class="status-indicator"><span class="status-dot"></span> Campaign Paused</span>
          </div>
          <h1>${campaign.name}</h1>
          <div class="campaign-tag">ID: ${campaign.campaign_id}</div>
          <p>This marketing campaign is currently paused by the campaign administrator. The link will resume functioning once reactivated.</p>
        </div>
      </body>
      </html>
    `;
  }

  static renderErrorPage(title, message) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - Campaign URL Manager</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #090d16;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 24px;
          }
          .card {
            background: rgba(22, 27, 46, 0.9);
            border: 1px solid rgba(239, 68, 68, 0.2);
            border-radius: 20px;
            padding: 48px;
            max-width: 480px;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          }
          .icon-badge {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(239, 68, 68, 0.15);
            color: #ef4444;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin-bottom: 24px;
          }
          h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
          p { color: #94a3b8; font-size: 15px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon-badge">⚠</div>
          <h1>${title}</h1>
          <p>${message}</p>
        </div>
      </body>
      </html>
    `;
  }
}
