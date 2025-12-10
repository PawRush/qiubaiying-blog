const { test, expect } = require('@playwright/test');

test.describe('Homepage and Blog Post List', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');

    // Check that the page title is present
    await expect(page).toHaveTitle(/BY Blog/);

    // Check for the main header
    const header = page.locator('.site-heading h1');
    await expect(header).toBeVisible();
  });

  test('should display blog posts on homepage', async ({ page }) => {
    await page.goto('/');

    // Check for blog post previews
    const postPreviews = page.locator('.post-preview');
    const count = await postPreviews.count();
    expect(count).toBeGreaterThan(0);

    // Check that the first post has a title
    const firstPostTitle = postPreviews.first().locator('.post-title');
    await expect(firstPostTitle).toBeVisible();
    await expect(firstPostTitle).not.toBeEmpty();
  });

  test('should display post metadata (author and date)', async ({ page }) => {
    await page.goto('/');

    // Check for post meta information
    const postMeta = page.locator('.post-meta').first();
    await expect(postMeta).toBeVisible();
    await expect(postMeta).toContainText(/Posted by/);
    await expect(postMeta).toContainText(/\d{4}/); // Contains year
  });

  test('should have clickable blog post links', async ({ page }) => {
    await page.goto('/');

    // Get the first post preview link
    const firstPostLink = page.locator('.post-preview a').first();
    await expect(firstPostLink).toBeVisible();

    // Get the href to verify it's a valid link
    const href = await firstPostLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/^\/\d{4}\//); // Should start with a year
  });

  test('should display pagination when available', async ({ page }) => {
    await page.goto('/');

    // Check if pagination exists (may not be visible on page 1 if only one page)
    const pager = page.locator('.pager');
    const pagerExists = await pager.count() > 0;

    if (pagerExists) {
      // If pagination exists, check for proper structure
      await expect(pager).toBeVisible();
    }
  });

  test('should show post content preview', async ({ page }) => {
    await page.goto('/');

    // Check for post content preview
    const contentPreview = page.locator('.post-content-preview').first();
    await expect(contentPreview).toBeVisible();

    // Verify it has some text content
    const text = await contentPreview.textContent();
    expect(text).toBeTruthy();
    expect(text.length).toBeGreaterThan(0);
  });

  test('should have sidebar with featured tags', async ({ page }) => {
    await page.goto('/');

    // Check for sidebar
    const sidebar = page.locator('.sidebar-container');
    await expect(sidebar).toBeVisible();

    // Check for featured tags section
    const tagsSection = page.locator('.sidebar-container .tags');
    if (await tagsSection.count() > 0) {
      await expect(tagsSection.first()).toBeVisible();
    }
  });

  test('should have navigation menu', async ({ page }) => {
    await page.goto('/');

    // Check for navigation
    const nav = page.locator('nav, .navbar');
    await expect(nav).toBeVisible();
  });

  test('should load CSS and images properly', async ({ page }) => {
    await page.goto('/');

    // Check that background image is loaded (header)
    const header = page.locator('header.intro-header');
    await expect(header).toBeVisible();

    // Check that the page has proper styling
    const backgroundColor = await header.evaluate((el) =>
      window.getComputedStyle(el).backgroundImage
    );
    expect(backgroundColor).toBeTruthy();
    expect(backgroundColor).not.toBe('none');
  });
});
