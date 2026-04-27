const { defineConfig } = require('cypress');
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

module.exports = defineConfig({
  // Cypress Cloud project identifier (can be injected via CI secret/env)
  projectId: process.env.CYPRESS_PROJECT_ID,

  // Retry configuration - reduces flakiness in CI
  retries: {
    runMode: 2, // Retry failed tests 2 times in CI (cypress run)
    openMode: 0, // No retries in local development (cypress open)
  },

  // Screenshot configuration
  screenshotOnRunFailure: true, // Auto-screenshot on test failure

  // Video configuration
  video: false, // Don't record videos (saves time and space)

  // Timeout configuration
  defaultCommandTimeout: 15000, // Wait up to 15s for commands (e.g., cy.get())
  pageLoadTimeout: 30000, // Wait up to 30s for page loads

  // Viewport configuration
  viewportWidth: 1280, // Default viewport width
  viewportHeight: 800, // Default viewport height

  // Reporter configuration - Uses mochawesome for HTML reports
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports', // Directory where reports are saved
    charts: true, // Include charts in report
    reportPageTitle: 'Cypress Bourse Test Report', // HTML page title
    embeddedScreenshots: true, // Embed screenshots directly in report
    inlineAssets: true, // Embed CSS/JS in HTML (single file)
    saveAllAttempts: false, // Don't save reports for retried tests
    overwrite: false, // Keep all report files (don't overwrite)
    saveJson: true, // Generate JSON report (needed for merging)
  },

  e2e: {
    // Base URL for all cy.visit() calls
    baseUrl: 'https://www.saucedemo.com',

    // Pattern to find test files
    specPattern: 'cypress/e2e/tests/**/*.cy.js',

    // Support file loaded before tests (commands, hooks, etc.)
    supportFile: 'cypress/support/e2e.js',

    // Screenshot and video folders
    screenshotsFolder: 'cypress/reports/screenshots',
    videosFolder: 'cypress/reports/videos',

    // Environment variables accessible via Cypress.env()
    env: {
      username: 'standard_user', // Default username for tests
      password: 'secret_sauce', // Default password for tests
      apiUrl: 'https://reqres.in', // Public API for API tests (requires free API key)
    },

    // Node event listeners - runs in Node.js context (not browser)
    setupNodeEvents(on, config) {
      // Register mochawesome reporter plugin
      require('cypress-mochawesome-reporter/plugin')(on);

      // Hook: Before test run starts
      on('before:run', async (details) => {
        await beforeRunHook(details); // Mochawesome setup
      });

      // Hook: After test run completes
      on('after:run', async (results) => {
        await afterRunHook(); // Mochawesome cleanup
        // Note: Slack notification is handled by scripts/send_slack_message.js in CI
      });

      // Hook: Before browser launches - add Chrome flags for CI stability
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium') {
          // Prevent /dev/shm memory issues in Docker/CI containers
          launchOptions.args.push('--disable-dev-shm-usage');
          // Required for many Linux CI environments (Docker)
          launchOptions.args.push('--no-sandbox');
          // Prevent GPU-related instability in headless runs
          launchOptions.args.push('--disable-gpu');
          // Keep browser session clean and deterministic
          launchOptions.args.push('--disable-extensions');
          // Prevent timer slowdowns in background tabs
          launchOptions.args.push('--disable-background-timer-throttling');
          // Keep renderer active during test execution
          launchOptions.args.push('--disable-renderer-backgrounding');
          // Avoid throttling when window is not visible
          launchOptions.args.push('--disable-backgrounding-occluded-windows');
          // Reduce IPC throttling that can affect automation
          launchOptions.args.push('--disable-ipc-flooding-protection');
          // Disable browser cache to ensure network interception works reliably across specs
          launchOptions.args.push('--disable-application-cache');
          launchOptions.args.push('--disable-cache');
          launchOptions.args.push('--disk-cache-size=1');
          launchOptions.args.push('--media-cache-size=1');
        }
        return launchOptions;
      });

      return config;
    },
  },
});
