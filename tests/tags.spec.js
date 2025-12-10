const { test, expect } = require('@playwright/test');

test.describe('Tag Filtering System', () => {
  test('should navigate to tags page', async ({ page }) => {
    await page.goto('/');

    // Navigate to tags page
    await page.goto('/tags/');

    // Check that we're on the tags page
    await expect(page).toHaveURL(/\/tags/);
    await expect(page.locator('#tag-heading')).toBeVisible();
  });

  test('should display tag cloud on tags page', async ({ page }) => {
    await page.goto('/tags/');

    // Check for tag cloud
    const tagCloud = page.locator('#tag_cloud');
    await expect(tagCloud).toBeVisible();

    // Check that tags are present
    const tags = page.locator('#tag_cloud a');
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThan(0);
  });

  test('should have clickable tags in tag cloud', async ({ page }) => {
    await page.goto('/tags/');

    // Get first tag
    const firstTag = page.locator('#tag_cloud a').first();
    await expect(firstTag).toBeVisible();

    // Check that it has a proper href (should be a hash link)
    const href = await firstTag.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/^#/);

    // Click the tag
    const tagText = await firstTag.textContent();
    await firstTag.click();

    // Verify we scrolled to or can see the tag section
    const tagSection = page.locator(`[id="${tagText}"]`);
    await expect(tagSection).toBeVisible();
  });

  test('should display posts grouped by tags', async ({ page }) => {
    await page.goto('/tags/');

    // Check for tag lists
    const tagLists = page.locator('.one-tag-list');
    const listCount = await tagLists.count();
    expect(listCount).toBeGreaterThan(0);

    // Check that each tag list has a tag name
    const firstTagList = tagLists.first();
    const tagName = firstTagList.locator('.tag-text');
    await expect(tagName).toBeVisible();
  });

  test('should show posts under each tag', async ({ page }) => {
    await page.goto('/tags/');

    // Check for posts under tags
    const firstTagList = page.locator('.one-tag-list').first();
    const postPreviews = firstTagList.locator('.post-preview');
    const postCount = await postPreviews.count();
    expect(postCount).toBeGreaterThan(0);

    // Check that post has a title
    const postTitle = postPreviews.first().locator('.post-title');
    await expect(postTitle).toBeVisible();
  });

  test('should navigate to post from tags page', async ({ page }) => {
    await page.goto('/tags/');

    // Click on first post in tag list
    const firstPost = page.locator('.one-tag-list .post-preview a').first();
    await expect(firstPost).toBeVisible();

    const postUrl = await firstPost.getAttribute('href');
    await firstPost.click();

    // Verify navigation
    await expect(page).toHaveURL(new RegExp(postUrl));
  });

  test('should display tags on individual blog posts', async ({ page }) => {
    await page.goto('/');

    // Navigate to first blog post
    const firstPostLink = page.locator('.post-preview a').first();
    await firstPostLink.click();

    // Check for tags on post page
    const postTags = page.locator('.post-heading .tags .tag');
    if (await postTags.count() > 0) {
      await expect(postTags.first()).toBeVisible();

      // Click on a tag
      const firstTag = postTags.first();
      const tagHref = await firstTag.getAttribute('href');

      await firstTag.click();

      // Should navigate to tags page with hash
      await expect(page).toHaveURL(/\/tags/);
    }
  });

  test('should have featured tags in sidebar on homepage', async ({ page }) => {
    await page.goto('/');

    // Look for featured tags section
    const featuredTagsSection = page.locator('.sidebar-container').filter({ hasText: 'FEATURED TAGS' });

    if (await featuredTagsSection.count() > 0) {
      await expect(featuredTagsSection).toBeVisible();

      // Check for tags
      const tags = featuredTagsSection.locator('.tags a');
      if (await tags.count() > 0) {
        await expect(tags.first()).toBeVisible();

        // Click on first tag
        await tags.first().click();

        // Should navigate to tags page
        await expect(page).toHaveURL(/\/tags/);
      }
    }
  });

  test('should filter posts by tag correctly', async ({ page }) => {
    await page.goto('/tags/');

    // Get all tag lists
    const tagLists = page.locator('.one-tag-list');
    const tagCount = await tagLists.count();

    expect(tagCount).toBeGreaterThan(0);

    // For each tag, verify it has posts
    for (let i = 0; i < Math.min(3, tagCount); i++) {
      const tagList = tagLists.nth(i);
      const tagName = await tagList.locator('.tag-text').textContent();
      const posts = tagList.locator('.post-preview');

      expect(tagName).toBeTruthy();
      const postCount = await posts.count();
      expect(postCount).toBeGreaterThan(0);
    }
  });

  test('should handle tag links with proper URL structure', async ({ page }) => {
    await page.goto('/tags/');

    // Get tag cloud links
    const tagLinks = page.locator('#tag_cloud a');
    const linkCount = await tagLinks.count();

    expect(linkCount).toBeGreaterThan(0);

    // Check first few tag links
    for (let i = 0; i < Math.min(5, linkCount); i++) {
      const tag = tagLinks.nth(i);
      const href = await tag.getAttribute('href');
      const title = await tag.getAttribute('title');

      expect(href).toMatch(/^#/);
      expect(title).toBeTruthy();
    }
  });
});
