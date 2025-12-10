# Playwright Test Suite for qiubaiying-blog

This directory contains comprehensive end-to-end tests for the Jekyll blog using Playwright.

## Test Coverage

### 1. Homepage Tests (`homepage.spec.js`)
- Homepage loading and rendering
- Blog post list display
- Post metadata (author, date)
- Post content previews
- Pagination functionality
- Sidebar and featured tags
- Navigation menu
- CSS and image loading

### 2. Tag Filtering Tests (`tags.spec.js`)
- Tags page navigation
- Tag cloud display
- Tag filtering functionality
- Posts grouped by tags
- Tag links on blog posts
- Featured tags in sidebar
- Tag URL structure and navigation

### 3. Navigation Tests (`navigation.spec.js`)
- Homepage to blog post navigation
- Post content display
- Previous/Next post navigation
- Navigation menu functionality
- About page navigation
- Return to homepage
- URL structure validation
- Post metadata display

### 4. Comments Tests (`comments.spec.js`)
- Gitalk comment system loading
- Gitalk script and CSS loading
- Gitalk widget initialization
- UI elements display
- Comment container positioning
- Gitalk configuration validation
- Error handling

### 5. Responsive Design Tests (`responsive.spec.js`)
- Desktop layout (1920x1080)
- Tablet layout (768x1024)
- Mobile layout (375x667)
- Responsive navigation
- Typography scaling
- Image responsiveness
- Touch-friendly interfaces
- No horizontal overflow on mobile

## Prerequisites

1. **Jekyll**: Installed and configured
2. **Node.js**: Version 14 or higher
3. **Dependencies**: Run `npm install` to install Playwright

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run tests with UI mode
```bash
npm run test:ui
```

### Run specific test file
```bash
npx playwright test tests/homepage.spec.js
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests on mobile devices
```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Test Configuration

Tests are configured in `playwright.config.js`:
- Base URL: `http://127.0.0.1:4000`
- Browsers: Chromium, Firefox, WebKit
- Mobile: Pixel 5, iPhone 12
- Auto-starts Jekyll server before tests
- Screenshots on failure
- Traces on retry

## Jekyll Server

The test suite automatically starts the Jekyll server before running tests. If you want to start it manually:

```bash
bundle exec jekyll serve --port 4000 --host 127.0.0.1
```

## Test Results

After running tests, view the HTML report:
```bash
npx playwright show-report
```

## CI/CD Integration

Tests are configured for CI environments:
- Retry failed tests 2 times
- Run tests sequentially (workers: 1)
- Generate HTML reports

## Troubleshooting

### Jekyll server not starting
```bash
# Manually build the site first
bundle exec jekyll build

# Then start the server
bundle exec jekyll serve --port 4000
```

### Port already in use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Or use a different port in playwright.config.js
```

### Browser installation
```bash
# Install Playwright browsers
npx playwright install
```

## Test Structure

Each test file follows this pattern:
- Descriptive test suites (`test.describe`)
- Clear test names explaining what is being tested
- Proper assertions using `expect`
- Wait for elements and page states
- Handle dynamic content gracefully

## Writing New Tests

Follow these guidelines:
1. Use descriptive test names
2. Wait for elements to be visible/loaded
3. Use semantic selectors (prefer data-testid, ids, or meaningful classes)
4. Test user workflows, not implementation details
5. Keep tests independent and idempotent

## Coverage Summary

- **Total Tests**: 60+ test cases
- **Coverage Areas**: Homepage, Tags, Navigation, Comments, Responsive Design
- **Browsers**: 5 configurations (Desktop: Chrome/Firefox/Safari, Mobile: Chrome/Safari)
- **Viewports**: Desktop, Tablet, Mobile

## Known Limitations

1. **Gitalk Comments**: Tests verify Gitalk loads but don't test actual commenting (requires GitHub OAuth)
2. **External Links**: Tests don't validate external friend links
3. **Analytics**: Google Analytics and Baidu Analytics scripts are not tested
4. **Service Worker**: PWA functionality is not covered

## Maintenance

Update tests when:
- Blog structure changes
- New features are added
- Navigation changes
- Responsive breakpoints are modified
