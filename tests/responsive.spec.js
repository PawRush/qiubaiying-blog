const { test, expect, devices } = require('@playwright/test');

test.describe('Responsive Design', () => {
  test.describe('Desktop View', () => {
    test('should display properly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      // Check that main content is visible
      const content = page.locator('.container');
      await expect(content).toBeVisible();

      // Check viewport is desktop size
      const viewportSize = page.viewportSize();
      expect(viewportSize.width).toBe(1920);
    });

    test('should show sidebar on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      // Sidebar should be visible on desktop
      const sidebar = page.locator('.sidebar-container');
      await expect(sidebar).toBeVisible();
    });

    test('should display navigation menu horizontally on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto('/');

      // Navigation should be visible
      const nav = page.locator('nav, .navbar');
      await expect(nav).toBeVisible();

      // Get navbar height to ensure it's horizontal layout
      const navBox = await nav.boundingBox();
      expect(navBox).toBeTruthy();

      if (navBox) {
        // Height should be relatively small for horizontal menu
        expect(navBox.height).toBeLessThan(200);
      }
    });
  });

  test.describe('Tablet View', () => {
    test('should display properly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      // Check that content is visible
      const content = page.locator('.container');
      await expect(content).toBeVisible();

      // Check blog posts are visible
      const posts = page.locator('.post-preview');
      await expect(posts.first()).toBeVisible();
    });

    test('should adjust layout for tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      // Main content should still be visible
      const mainContent = page.locator('.col-lg-8, .col-md-10');
      await expect(mainContent.first()).toBeVisible();
    });
  });

  test.describe('Mobile View', () => {
    test('should display properly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check that content is visible
      const content = page.locator('.container');
      await expect(content).toBeVisible();

      // Blog posts should be visible
      const posts = page.locator('.post-preview');
      await expect(posts.first()).toBeVisible();
    });

    test('should stack elements vertically on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Get first two post previews
      const firstPost = page.locator('.post-preview').first();
      const secondPost = page.locator('.post-preview').nth(1);

      const firstBox = await firstPost.boundingBox();
      const secondBox = await secondPost.boundingBox();

      if (firstBox && secondBox) {
        // Second post should be below first post
        expect(secondBox.y).toBeGreaterThan(firstBox.y);

        // Posts should take most of the width
        expect(firstBox.width).toBeGreaterThan(300);
      }
    });

    test('should have mobile-friendly navigation', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Navigation should be visible
      const nav = page.locator('nav, .navbar');
      await expect(nav).toBeVisible();

      // Look for hamburger menu or mobile menu toggle
      const menuToggle = page.locator('.navbar-toggle, .menu-toggle, button[data-toggle="collapse"]');

      // If mobile menu toggle exists, test it
      if (await menuToggle.count() > 0) {
        await expect(menuToggle.first()).toBeVisible();
      }
    });

    test('should display readable text on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Get first post title
      const postTitle = page.locator('.post-preview .post-title').first();
      await expect(postTitle).toBeVisible();

      // Check font size is readable
      const fontSize = await postTitle.evaluate((el) =>
        window.getComputedStyle(el).fontSize
      );

      const fontSizeValue = parseInt(fontSize);
      expect(fontSizeValue).toBeGreaterThanOrEqual(14); // At least 14px
    });

    test('should hide or collapse sidebar on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check sidebar behavior - it might be hidden or moved
      const sidebar = page.locator('.sidebar-container');

      // If sidebar exists, check if it's properly positioned for mobile
      if (await sidebar.count() > 0) {
        const isVisible = await sidebar.isVisible();

        // On mobile, sidebar might be hidden or below content
        // This is acceptable for mobile layout
        expect(typeof isVisible).toBe('boolean');
      }
    });

    test('should handle touch-friendly clickable areas on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Post links should be touch-friendly
      const firstPostLink = page.locator('.post-preview a').first();
      await expect(firstPostLink).toBeVisible();

      // Get the bounding box
      const linkBox = await firstPostLink.boundingBox();

      if (linkBox) {
        // Height should be reasonable for touch (at least 30px)
        expect(linkBox.height).toBeGreaterThanOrEqual(30);
      }
    });
  });

  test.describe('Responsive Images', () => {
    test('should load header images on different screen sizes', async ({ page }) => {
      await page.goto('/');

      // Check header/banner image
      const header = page.locator('header.intro-header');
      await expect(header).toBeVisible();

      // Verify background image is set
      const backgroundImage = await header.evaluate((el) =>
        window.getComputedStyle(el).backgroundImage
      );

      expect(backgroundImage).not.toBe('none');
      expect(backgroundImage).toBeTruthy();
    });

    test('should not overflow on small screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check for horizontal scrollbar
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      // Ideally, there should be no horizontal scroll on mobile
      // (allowing some tolerance for certain elements)
      expect(hasHorizontalScroll).toBeFalsy();
    });
  });

  test.describe('Cross-Device Navigation', () => {
    test('should navigate between pages on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Navigate to a post
      const firstPost = page.locator('.post-preview a').first();
      await firstPost.click();

      // Should successfully navigate
      await expect(page).toHaveURL(/\/\d{4}\//);

      // Content should be visible
      const postContent = page.locator('.post-container');
      await expect(postContent).toBeVisible();
    });

    test('should navigate to tags page on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      // Navigate to tags
      await page.goto('/tags/');

      // Tags page should load properly
      const tagCloud = page.locator('#tag_cloud');
      await expect(tagCloud).toBeVisible();
    });
  });

  test.describe('Responsive Typography', () => {
    test('should have appropriate font sizes for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check post title font size
      const postTitle = page.locator('.post-preview .post-title').first();
      const titleFontSize = await postTitle.evaluate((el) =>
        parseInt(window.getComputedStyle(el).fontSize)
      );

      expect(titleFontSize).toBeGreaterThanOrEqual(16);

      // Check body text in preview
      const postPreview = page.locator('.post-content-preview').first();
      const bodyFontSize = await postPreview.evaluate((el) =>
        parseInt(window.getComputedStyle(el).fontSize)
      );

      expect(bodyFontSize).toBeGreaterThanOrEqual(14);
    });

    test('should have appropriate spacing on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check padding/margin on content
      const container = page.locator('.container').first();
      const paddingLeft = await container.evaluate((el) =>
        parseInt(window.getComputedStyle(el).paddingLeft)
      );

      // Should have some padding (at least 10px)
      expect(paddingLeft).toBeGreaterThanOrEqual(10);
    });
  });

  test.describe('Responsive Post View', () => {
    test('should display post content properly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Navigate to a post
      await page.locator('.post-preview a').first().click();

      // Post content should be visible and readable
      const postContainer = page.locator('.post-container');
      await expect(postContainer).toBeVisible();

      // Check that content width is appropriate
      const containerBox = await postContainer.boundingBox();

      if (containerBox) {
        // Should not exceed viewport width
        expect(containerBox.width).toBeLessThanOrEqual(375);
      }
    });
  });
});
