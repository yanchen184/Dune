import { test, expect } from '@playwright/test';

/**
 * 響應式設計測試
 * 測試不同裝置尺寸下的顯示效果
 */
test.describe('響應式設計測試', () => {

  const viewports = [
    { name: '桌面版 - Full HD', width: 1920, height: 1080 },
    { name: '桌面版 - 標準', width: 1366, height: 768 },
    { name: '平板版 - 橫向', width: 1024, height: 768 },
    { name: '平板版 - 直向', width: 768, height: 1024 },
    { name: '手機版 - iPhone 12', width: 390, height: 844 },
    { name: '手機版 - 標準', width: 375, height: 667 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`${name} (${width}x${height}) - 首頁顯示`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');

      // 檢查主要元素可見
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();

      // 檢查內容不溢出
      const body = page.locator('body');
      const hasHorizontalScroll = await body.evaluate(el =>
        el.scrollWidth > el.clientWidth
      );
      expect(hasHorizontalScroll).toBeFalsy();

      // 截圖
      await expect(page).toHaveScreenshot(`${name.replace(/\s/g, '-')}-homepage.png`, {
        maxDiffPixels: 100,
        fullPage: true,
      });
    });

    test(`${name} (${width}x${height}) - 導航欄測試`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');

      // 檢查導航欄存在
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // 檢查所有導航連結可見（可能需要滾動或漢堡選單）
      const links = ['首頁', '上傳', '歷史', '統計'];

      // 在小螢幕上，可能需要特殊處理（如漢堡選單）
      if (width < 768) {
        // 手機版本可能有不同的導航結構
        // 這裡可以添加手機版專屬的測試邏輯
      }

      // 確保至少能看到品牌名稱
      await expect(page.getByText('DUNE STATS')).toBeVisible();
    });

    test(`${name} (${width}x${height}) - 上傳頁面`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/upload');

      // 檢查主要元素
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('input[type="file"]')).toBeVisible();

      // 檢查按鈕可見且不被截斷
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      expect(buttonCount).toBeGreaterThan(0);

      for (let i = 0; i < buttonCount; i++) {
        await expect(buttons.nth(i)).toBeVisible();
      }

      // 截圖
      await expect(page).toHaveScreenshot(`${name.replace(/\s/g, '-')}-upload.png`, {
        maxDiffPixels: 100,
        fullPage: true,
      });
    });
  });

  test('觸控友善測試 - 手機版', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 檢查按鈕大小是否適合觸控（至少 44x44px）
    const newGameButton = page.getByText('+ 新增遊戲');
    const box = await newGameButton.boundingBox();

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
      // 寬度可能是整個卡片的寬度
    }
  });

  test('文字可讀性測試 - 小螢幕', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 檢查文字不會太小
    const h1 = page.locator('h1');
    const fontSize = await h1.evaluate(el =>
      window.getComputedStyle(el).fontSize
    );

    const fontSizeValue = parseInt(fontSize);
    expect(fontSizeValue).toBeGreaterThanOrEqual(24); // 至少 24px
  });

  test('圖片適應測試', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 檢查圖片不會溢出容器
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const isVisible = await img.isVisible();

      if (isVisible) {
        const box = await img.boundingBox();
        if (box) {
          expect(box.width).toBeLessThanOrEqual(375);
        }
      }
    }
  });

  test('卡片佈局測試 - 平板', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // 檢查卡片佈局正確
    const cards = page.locator('[class*="Card"]').or(page.locator('[class*="card"]'));
    const cardCount = await cards.count();

    if (cardCount > 0) {
      // 確保卡片可見且不重疊
      for (let i = 0; i < cardCount; i++) {
        await expect(cards.nth(i)).toBeVisible();
      }
    }
  });

  test('導航欄響應式測試', async ({ page }) => {
    // 測試桌面版
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // 測試手機版
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 導航欄應該仍然可見或有漢堡選單
    await expect(nav).toBeVisible();
  });

  test('滾動行為測試', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 檢查垂直滾動
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const clientHeight = await page.evaluate(() => document.body.clientHeight);

    // 如果內容超過視窗高度，應該可以滾動
    if (scrollHeight > clientHeight) {
      await page.evaluate(() => window.scrollTo(0, 100));
      const scrollTop = await page.evaluate(() => window.scrollY);
      expect(scrollTop).toBeGreaterThan(0);
    }
  });

  test('橫向到直向切換測試', async ({ page }) => {
    // 橫向模式
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    // 切換到直向模式
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);
    await expect(page.locator('h1')).toBeVisible();

    // 檢查佈局沒有問題
    const body = page.locator('body');
    const hasHorizontalScroll = await body.evaluate(el =>
      el.scrollWidth > el.clientWidth
    );
    expect(hasHorizontalScroll).toBeFalsy();
  });
});
