const axios = require('axios');
const fs = require('fs');
const path = require('path');

const reportPath = path.resolve(__dirname, '../cypress/reports/merged/merged-report.json');
const runNumber = process.env.GITHUB_RUN_NUMBER;
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

// GitHub Pages URL
const repoName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : 'cypressBourse';
const repoOwner = process.env.GITHUB_REPOSITORY_OWNER || '';
const reportUrl = `https://${repoOwner}.github.io/${repoName}/index_${runNumber}.html`;

// Get test metadata
const runBy = process.env.GITHUB_ACTOR || 'Unknown';
const branch = process.env.GITHUB_REF_NAME || 'Unknown';

if (!slackWebhookUrl || slackWebhookUrl.includes('YOUR')) {
  console.log('SLACK_WEBHOOK_URL not configured, skipping Slack notification.');
  process.exit(0);
}

if (fs.existsSync(reportPath)) {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  const totalTests = report.stats.tests || 0;
  const passTests = report.stats.passes || 0;
  const failTests = report.stats.failures || 0;
  const skipTests = report.stats.skipped || 0;
  const passPercent = report.stats.passPercent ? Math.floor(report.stats.passPercent) + '%' : '0%';
  const duration = ((report.stats.duration || 0) / 1000 / 60).toFixed(2) + ' min';
  const messageColor = failTests > 0 ? ':x:' : ':white_check_mark:';

  const message = {
    text:
      `*Cypress Test Results: ${messageColor}*\n` +
      `*Total Tests:* ${totalTests} | *Passed:* ${passTests} | *Failed:* ${failTests} | *Skipped:* ${skipTests} | ` +
      `*Pass Percentage:* ${passPercent} | *Duration:* ${duration} | ` +
      `*Run By:* ${runBy} | *Branch:* ${branch} | ` +
      `<${reportUrl}|View Report>`,
    mrkdwn: true,
  };

  const body = {
    username: 'webhookbot',
    text: message.text,
    icon_emoji: ':information_source:',
  };

  axios
    .post(slackWebhookUrl, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      console.log('Message sent to Slack successfully.');
    })
    .catch((error) => {
      console.error('Error sending message to Slack:', error.message);
    });
} else {
  console.error('Mochawesome report not found at:', reportPath);
}
