# Cypress Bourse - Test Automation Project

Cypress test automation framework

## Quick Start

```bash
npm install
npm run cy:open                   # Open Cypress GUI
npm run cy:run                    # Run all tests headless (Chrome - default)
npm run cy:run:electron           # Run all tests in Electron
npm run cy:run:firefox            # Run all tests in Firefox
npm run cy:run:chrome             # Run all tests in Chrome
npm run clean:reports             # Clean reports
```

## Run A Single Test (Spec)

```bash
npm run cy:run:spec -- "cypress/e2e/tests/0_inventory/inventory.cy.js"
npm run cy:run:spec:electron -- "cypress/e2e/tests/0_inventory/inventory.cy.js"
npm run cy:run:spec:firefox -- "cypress/e2e/tests/0_inventory/inventory.cy.js"
npm run cy:run:spec:chrome -- "cypress/e2e/tests/0_inventory/inventory.cy.js"
```

## Project Structure

```
cypressBourse/
├── .github/workflows/
│   └── cypress.yml                # GitHub Actions CI/CD pipeline
├── .husky/
│   └── pre-commit                 # Git pre-commit hook (runs Prettier)
├── cypress/
│   ├── e2e/tests/
│   │   ├── 0_inventory/           # UI tests (login + cart)
│   │   ├── 1_network/             # Network interception tests
│   │   └── 2_api/                 # API tests
│   ├── pages/                     # Page Objects (selectors only)
│   │   ├── loginPage.js
│   │   └── inventoryPage.js
│   └── support/
│       ├── commands/              # Custom Commands (business logic)
│       │   ├── apiCommands.js
│       │   ├── generalCommands.js
│       │   ├── inventoryCommands.js
│       │   └── loginCommands.js
│       └── e2e.js                 # Support entry file
├── scripts/
│   └── send_slack_message.js      # Slack notification script (used in CI)
├── cypress.config.js              # Cypress configuration
├── cypress.env.json               # Local secrets (gitignored)
└── package.json
```

## Architecture: Why This Pattern?

**Page Objects = Selectors Only** | **Custom Commands = Business Logic**

### Old Way (Bloated Page Objects)

```javascript
class LoginPage {
  fillUsername(username) {
    cy.get('#username').type(username); // Logic in POM
  }
}
```

### Our Way (Separation of Concerns)

```javascript
// Page Object - Returns selectors
class LoginPage {
  getUsernameInput() {
    return '[data-test="username"]'; // Just selector
  }
}

// Custom Command - Contains business logic
Cypress.Commands.add('login', (username, password) => {
  cy.get(loginPage.getUsernameInput()).type(username);
  cy.get(loginPage.getPasswordInput()).type(password);
  cy.get(loginPage.getLoginButton()).click();
});
```

**Why?**

- **Single Responsibility:** Page Objects → Selectors, Commands → Logic
- **Reusability:** Commands work across all test files
- **Maintainability:** Selector changes? Update POM. Workflow changes? Update command.
- **Chainable:** `cy.login().verifyInventoryPageLoaded().addToCart()`

## Test Coverage

### Task 3 - API Test (`cypress/e2e/tests/2_api/api-test.cy.js`)

- GET request to ReqRes `/api/users?page=2` endpoint
- Validate status code 200
- Validate response contains `data` array with at least one user
- Validate first user has `id` and `email` properties

**Note:** ReqRes API requires a free API key. Register at [app.reqres.in/api-keys](https://app.reqres.in/api-keys) and add to `cypress.env.json`:

```json
{ "reqresApiKey": "your-real-key-here" }
```

## Configuration

### GitHub Pages (CI Reports)

1. **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** gh-pages, Folder: / (root)

Reports: `https://<username>.github.io/<repo>/index_<run_number>.html`

### Slack Notifications

Set GitHub secrets:

- `CYPRESS_RECORD_KEY` - Cypress Cloud record key
- `CYPRESS_PROJECT_ID` - Cypress Cloud project ID used for recorded runs
- `SLACK_WEBHOOK_URL` - Slack incoming webhook URL

The Slack message includes:

- Test status (PASSED / FAILED)
- Total tests, passed, failed, skipped
- Pass percentage and duration
- Run by (GitHub actor) and branch
- Direct link to GitHub Pages report

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/cypress.yml`):

1. **`cypress-tests` job** - Runs in 3 parallel containers using Cypress Cloud parallelization
2. **`merge-reports` job** - Merges JSON reports, generates HTML, deploys to GitHub Pages, sends Slack notification

Triggered on:

- Push to `main` branch
- Pull request to `main` branch
- Manual trigger via `workflow_dispatch`

## Features

- Page Object Model (selectors only)
- Custom Commands (business logic)
- Parallel execution (3 containers)
- Mochawesome reports → GitHub Pages
- Slack notifications with report links
- Prettier + Husky pre-commit hooks
- Screenshot on failure
- Chrome CI optimizations (`--no-sandbox`, `--disable-dev-shm-usage`, etc.)
- Automatic retries (2x) in CI
- Multi-browser support (Chrome, Firefox, Electron)

---

## Scaling & Strategy Questions

### 1. How would you scale this framework to support 300+ tests?

**Modular Organization:**

- Group tests by feature/module (e.g., `auth/`, `checkout/`, `profile/`)
- Implement test tagging with `@smoke`, `@regression`, `@critical` via grep plugin
- Use dynamic spec file selection in CI (run only changed modules)

**Parallel Execution:**

- Increase matrix containers from 3 to 10+
- Split specs intelligently using Cypress Dashboard's load balancing
- Use `--record` and `--parallel` flags for optimal distribution

**Performance:**

- Shared setup via API commands (`cy.apiLogin()` instead of UI login)
- Fixtures for test data instead of repeated API calls
- Custom base URL per environment to avoid hardcoding

**Maintenance:**

- Shared helper functions in `support/utils/`
- Centralized test data in `fixtures/`
- Regular cleanup of obsolete tests and dead code

### 2. How would you reduce and monitor flakiness in CI?

**Reduce Flakiness:**

- Use `data-test` attributes for stable selectors (no XPath or text-based)
- Replace `cy.wait(5000)` with smart waits: `cy.get().should('be.visible')`
- Add retry logic: `retries: { runMode: 2, openMode: 0 }` in config
- Increase timeouts for CI: `defaultCommandTimeout: 15000`
- Use `cy.intercept()` to stub flaky external APIs

**Monitor Flakiness:**

- Enable Cypress Dashboard to track test flakiness trends
- Save failed test screenshots/videos as CI artifacts
- Use GitHub Actions matrix to identify environment-specific failures
- Track flaky tests in a dedicated file and prioritize fixes

**CI Hardening:**

- Use Docker containers for consistent environments
- Add Chrome flags: `--disable-dev-shm-usage`, `--no-sandbox`
- Run tests on clean state (clear cookies/localStorage in `beforeEach`)

### 3. What test strategy would you run on every Pull Request?

**Pull Request (Fast Feedback ~5-10 min):**

- **Smoke tests only** (`@smoke` tag): Login, critical user flows
- **Changed module tests:** If PR touches `checkout/`, run only checkout tests
- **Parallel:** 3 containers max
- **Browser:** Chrome only
- **Fail fast:** Stop on first failure
- **Skip:** Visual regression, performance tests, full regression

**Benefits:**

- PR runs give **instant feedback** without blocking developers
- Cost-effective CI usage (don't run 300 tests on every commit)
