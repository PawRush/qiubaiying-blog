const { test, expect } = require('@playwright/test');

// Skip Gitalk tests when running against remote URL (GitHub OAuth won't work)
const isRemote = process.env.BASE_URL && !process.env.BASE_URL.includes('localhost') && !process.env.BASE_URL.includes('127.0.0.1');

test.describe('Gitalk Comment System', () => {
  test.skip(isRemote, 'Gitalk tests require GitHub OAuth and only work locally');
  test('should load Gitalk on blog post page', async ({ page }) => {
    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    // Wait for page load
    await page.waitForLoadState('domcontentloaded');

    // Check for Gitalk container
    const gitalkContainer = page.locator('#gitalk-container');
    await expect(gitalkContainer).toBeVisible();
  });

  test('should load Gitalk script', async ({ page }) => {
    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');

    // Check that Gitalk script is loaded
    const gitalkScript = page.locator('script[src*="gitalk"]');
    const scriptCount = await gitalkScript.count();
    expect(scriptCount).toBeGreaterThan(0);
  });

  test('should load Gitalk CSS', async ({ page }) => {
    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    // Wait for page load
    await page.waitForLoadState('domcontentloaded');

    // Check for Gitalk stylesheet
    const gitalkCSS = page.locator('link[href*="gitalk"]');
    const cssCount = await gitalkCSS.count();
    expect(cssCount).toBeGreaterThan(0);
  });

  test('should initialize Gitalk widget', async ({ page }) => {
    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    // Wait for page load and Gitalk initialization
    await page.waitForLoadState('domcontentloaded');

    // Wait a bit for Gitalk to initialize
    await page.waitForTimeout(2000);

    // Check if Gitalk has rendered content
    const gitalkContainer = page.locator('#gitalk-container');
    const containerContent = await gitalkContainer.innerHTML();

    // Gitalk should have added some content to the container
    expect(containerContent.length).toBeGreaterThan(0);
  });

  test('should display Gitalk UI elements', async ({ page }) => {
    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    // Wait for page and Gitalk load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Look for Gitalk UI elements (may vary based on auth state)
    const gitalkContainer = page.locator('#gitalk-container');
    await expect(gitalkContainer).toBeVisible();

    // Check for common Gitalk elements (login button or comment area)
    const gitalkElements = gitalkContainer.locator('.gt-container, .gt-header, .gt-comments, .gt-btn');

    // At least some Gitalk UI should be present
    const elementCount = await gitalkElements.count();

    // If no elements found, check if there's error or loading state
    if (elementCount === 0) {
      const containerText = await gitalkContainer.textContent();
      // Should have some content even if it's an error message or loading state
      expect(containerText.length).toBeGreaterThan(0);
    }
  });

  test('should have Gitalk container in correct position', async ({ page }) => {
    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    await page.waitForLoadState('domcontentloaded');

    // Gitalk should be inside post-container
    const gitalkInPost = page.locator('.post-container #gitalk-container');
    await expect(gitalkInPost).toBeVisible();

    // Should be after the post content and navigation
    const pager = page.locator('.post-container .pager');
    const gitalkContainer = page.locator('#gitalk-container');

    // Both should be visible
    await expect(pager).toBeVisible();
    await expect(gitalkContainer).toBeVisible();

    // Verify relative positions
    const pagerBox = await pager.boundingBox();
    const gitalkBox = await gitalkContainer.boundingBox();

    if (pagerBox && gitalkBox) {
      // Gitalk should be below the pager
      expect(gitalkBox.y).toBeGreaterThan(pagerBox.y);
    }
  });

  test('should not show Gitalk on homepage', async ({ page }) => {
    await page.goto('/');

    // Gitalk should not be on the homepage
    const gitalkContainer = page.locator('#gitalk-container');
    await expect(gitalkContainer).toHaveCount(0);
  });

  test('should not show Gitalk on tags page', async ({ page }) => {
    await page.goto('/tags/');

    // Gitalk should not be on the tags page
    const gitalkContainer = page.locator('#gitalk-container');
    await expect(gitalkContainer).toHaveCount(0);
  });

  test('should load md5.min.js for Gitalk', async ({ page }) => {
    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    await page.waitForLoadState('domcontentloaded');

    // Check for md5.min.js (used by Gitalk for ID generation)
    const md5Script = page.locator('script[src*="md5"]');
    const md5Count = await md5Script.count();
    expect(md5Count).toBeGreaterThan(0);
  });

  test('should handle Gitalk initialization without errors', async ({ page }) => {
    const consoleErrors = [];

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Filter out expected errors (like API rate limits from Gitalk)
    const criticalErrors = consoleErrors.filter(
      error => !error.includes('GitHub API') &&
               !error.includes('rate limit') &&
               !error.includes('403')
    );

    // There shouldn't be critical JavaScript errors
    expect(criticalErrors.length).toBe(0);
  });

  test('should have Gitalk configuration', async ({ page }) => {
    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    await page.waitForLoadState('domcontentloaded');

    // Check that Gitalk is configured (check for inline script with configuration)
    const hasGitalkConfig = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(script =>
        script.textContent.includes('new Gitalk') &&
        script.textContent.includes('clientID')
      );
    });

    expect(hasGitalkConfig).toBeTruthy();
  });
});
