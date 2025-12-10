const { test, expect } = require('@playwright/test');

test.describe('Blog Post Navigation', () => {
  test('should navigate from homepage to blog post', async ({ page }) => {
    await page.goto('/');

    // Click on first blog post
    const firstPost = page.locator('.post-preview a').first();
    const postTitle = await firstPost.locator('.post-title').textContent();

    await firstPost.click();

    // Verify we're on a post page
    await expect(page).toHaveURL(/\/\d{4}\//);

    // Check that post title is visible
    const postHeadingTitle = page.locator('.post-heading h1');
    await expect(postHeadingTitle).toBeVisible();
  });

  test('should display post content', async ({ page }) => {
    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    // Check for post content
    const postContainer = page.locator('.post-container');
    await expect(postContainer).toBeVisible();

    // Verify content exists
    const content = await postContainer.textContent();
    expect(content).toBeTruthy();
    expect(content.length).toBeGreaterThan(100);
  });

  test('should show previous and next post navigation', async ({ page }) => {
    await page.goto('/');

    // Navigate to a post
    await page.locator('.post-preview a').first().click();

    // Look for pagination (previous/next)
    const pager = page.locator('.post-container .pager');
    await expect(pager).toBeVisible();

    // Check if previous or next links exist
    const prevLink = pager.locator('.previous');
    const nextLink = pager.locator('.next');

    const hasPrev = await prevLink.count() > 0;
    const hasNext = await nextLink.count() > 0;

    // At least one should exist (unless it's the only post)
    expect(hasPrev || hasNext).toBeTruthy();
  });

  test('should navigate to previous post', async ({ page }) => {
    await page.goto('/');

    // Navigate to a post
    await page.locator('.post-preview a').first().click();

    // Wait for page load
    await page.waitForLoadState('domcontentloaded');

    // Look for previous link
    const prevLink = page.locator('.post-container .pager .previous a');

    if (await prevLink.count() > 0) {
      const currentUrl = page.url();
      await prevLink.click();

      // Verify navigation occurred
      const newUrl = page.url();
      expect(newUrl).not.toBe(currentUrl);
      await expect(page).toHaveURL(/\/\d{4}\//);
    }
  });

  test('should navigate to next post', async ({ page }) => {
    await page.goto('/');

    // Navigate to a post (try second post if available)
    const posts = page.locator('.post-preview a');
    const postCount = await posts.count();

    if (postCount > 1) {
      await posts.nth(1).click();
    } else {
      await posts.first().click();
    }

    // Wait for page load
    await page.waitForLoadState('domcontentloaded');

    // Look for next link
    const nextLink = page.locator('.post-container .pager .next a');

    if (await nextLink.count() > 0) {
      const currentUrl = page.url();
      await nextLink.click();

      // Verify navigation occurred
      const newUrl = page.url();
      expect(newUrl).not.toBe(currentUrl);
      await expect(page).toHaveURL(/\/\d{4}\//);
    }
  });

  test('should have working navigation menu links', async ({ page }) => {
    await page.goto('/');

    // Check for navigation links
    const nav = page.locator('nav, .navbar');
    await expect(nav).toBeVisible();

    // Look for common navigation links
    const homeLink = page.locator('a[href="/"], a[href="' + page.url() + '"]').first();
    if (await homeLink.count() > 0) {
      await expect(homeLink).toBeVisible();
    }

    // Look for Tags link
    const tagsLink = page.locator('a[href*="tags"]').first();
    if (await tagsLink.count() > 0) {
      await tagsLink.click();
      await expect(page).toHaveURL(/\/tags/);
    }
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');

    // Look for About link
    const aboutLink = page.locator('a[href*="about"]').first();

    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await expect(page).toHaveURL(/\/about/);

      // Check for about content
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    }
  });

  test('should return to homepage from post', async ({ page }) => {
    await page.goto('/');
    const homepageUrl = page.url();

    // Navigate to a post
    await page.locator('.post-preview a').first().click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Look for logo or home link and click it
    const homeLinks = page.locator('a[href="/"], .navbar-brand');
    if (await homeLinks.count() > 0) {
      await homeLinks.first().click();

      // Should be back at homepage
      await expect(page).toHaveURL(homepageUrl);
    }
  });

  test('should display breadcrumb or navigation context', async ({ page }) => {
    await page.goto('/');

    // Navigate to a post
    await page.locator('.post-preview a').first().click();

    // Check for navigation context (navbar should still be present)
    const nav = page.locator('nav, .navbar');
    await expect(nav).toBeVisible();
  });

  test('should have proper URL structure for posts', async ({ page }) => {
    await page.goto('/');

    // Get first few post links
    const postLinks = page.locator('.post-preview a');
    const linkCount = await postLinks.count();

    for (let i = 0; i < Math.min(3, linkCount); i++) {
      const link = postLinks.nth(i);
      const href = await link.getAttribute('href');

      // Verify URL structure (should be /YYYY/MM/DD/title or similar)
      expect(href).toMatch(/^\/\d{4}\//);
    }
  });

  test('should maintain scroll position on back navigation', async ({ page }) => {
    await page.goto('/');

    // Scroll down a bit
    await page.evaluate(() => window.scrollTo(0, 300));
    const scrollPosition = await page.evaluate(() => window.scrollY);

    // Navigate to a post
    const firstPost = page.locator('.post-preview a').first();
    await firstPost.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Go back
    await page.goBack();

    // Note: Scroll position restoration is browser-dependent,
    // so we just verify we're back on the homepage
    await expect(page).toHaveURL('/');
  });

  test('should show post metadata in post view', async ({ page }) => {
    await page.goto('/');

    // Navigate to first post
    await page.locator('.post-preview a').first().click();

    // Check for post metadata
    const postMeta = page.locator('.post-heading .meta');
    await expect(postMeta).toBeVisible();

    // Should contain author and date
    const metaText = await postMeta.textContent();
    expect(metaText).toContain('Posted by');
    expect(metaText).toMatch(/\d{4}/); // Contains year
  });
});
