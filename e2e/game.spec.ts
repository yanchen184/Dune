import { test, expect } from '@playwright/test';

/**
 * Dune 遊戲統計系統完整 E2E 測試
 */
test.describe('Dune 遊戲統計系統', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('首頁載入測試', async ({ page }) => {
    // 檢查頁面標題
    await expect(page.locator('h1')).toContainText('Dashboard');

    // 檢查導航欄存在
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('DUNE STATS')).toBeVisible();

    // 檢查導航連結
    await expect(page.getByRole('link', { name: '首頁' })).toBeVisible();
    await expect(page.getByRole('link', { name: '上傳' })).toBeVisible();
    await expect(page.getByRole('link', { name: '歷史' })).toBeVisible();
    await expect(page.getByRole('link', { name: '統計' })).toBeVisible();

    // 檢查總遊戲數卡片
    await expect(page.getByText('總遊戲數')).toBeVisible();

    // 檢查最近遊戲區域
    await expect(page.getByText('最近遊戲')).toBeVisible();

    // 檢查新增遊戲按鈕
    await expect(page.getByText('+ 新增遊戲')).toBeVisible();
  });

  test('導航功能測試', async ({ page }) => {
    // 測試導航到上傳頁面
    await page.getByRole('link', { name: '上傳' }).click();
    await expect(page.locator('h1')).toContainText('上傳遊戲結果');
    await expect(page.getByText('選擇圖片')).toBeVisible();

    // 測試導航到歷史頁面
    await page.getByRole('link', { name: '歷史' }).click();
    await expect(page.locator('h1')).toContainText('遊戲歷史');

    // 測試導航到統計頁面
    await page.getByRole('link', { name: '統計' }).click();
    await expect(page.locator('h1')).toContainText('統計數據');

    // 測試導航回首頁
    await page.getByRole('link', { name: '首頁' }).click();
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('上傳頁面元素測試', async ({ page }) => {
    await page.goto('/upload');

    // 檢查標題
    await expect(page.locator('h1')).toContainText('上傳遊戲結果');

    // 檢查檔案輸入欄位
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    await expect(fileInput).toHaveAttribute('accept', 'image/*');

    // 檢查上傳按鈕（初始應該被禁用）
    const uploadButton = page.getByRole('button', { name: '上傳並識別' });
    await expect(uploadButton).toBeVisible();
    await expect(uploadButton).toBeDisabled();

    // 檢查取消按鈕
    await expect(page.getByRole('button', { name: '取消' })).toBeVisible();
  });

  test('歷史頁面顯示測試', async ({ page }) => {
    await page.goto('/history');

    // 檢查標題
    await expect(page.locator('h1')).toContainText('遊戲歷史');

    // 檢查是否顯示空狀態或遊戲列表
    const emptyState = page.getByText('尚無遊戲記錄');
    const gameList = page.locator('[class*="grid"]');

    // 至少其中一個應該可見
    const emptyVisible = await emptyState.isVisible();
    const listVisible = await gameList.isVisible();
    expect(emptyVisible || listVisible).toBeTruthy();
  });

  test('統計頁面顯示測試', async ({ page }) => {
    await page.goto('/stats');

    // 檢查標題
    await expect(page.locator('h1')).toContainText('統計數據');

    // 檢查是否顯示需要更多遊戲的訊息或統計數據
    const needMoreGames = page.getByText('至少需要 3 場遊戲才能顯示統計數據');
    const statsContent = page.getByText('玩家勝率');

    // 至少其中一個應該可見
    const needMoreVisible = await needMoreGames.isVisible();
    const statsVisible = await statsContent.isVisible();
    expect(needMoreVisible || statsVisible).toBeTruthy();
  });

  test('視覺回歸測試 - 首頁', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000); // 等待動畫完成

    await expect(page).toHaveScreenshot('homepage-initial.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('視覺回歸測試 - 上傳頁面', async ({ page }) => {
    await page.goto('/upload');
    await page.waitForTimeout(1000); // 等待動畫完成

    await expect(page).toHaveScreenshot('upload-page.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('視覺回歸測試 - 歷史頁面', async ({ page }) => {
    await page.goto('/history');
    await page.waitForTimeout(1000); // 等待動畫完成

    await expect(page).toHaveScreenshot('history-page.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('視覺回歸測試 - 統計頁面', async ({ page }) => {
    await page.goto('/stats');
    await page.waitForTimeout(1000); // 等待動畫完成

    await expect(page).toHaveScreenshot('stats-page.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('動畫效果測試', async ({ page }) => {
    await page.goto('/');

    // 檢查頁面淡入動畫（檢查 opacity 變化）
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible();

    // 點擊導航連結測試頁面切換動畫
    await page.getByRole('link', { name: '上傳' }).click();
    await page.waitForTimeout(500);
    await expect(page.locator('h1')).toContainText('上傳遊戲結果');
  });

  test('主題顏色檢查', async ({ page }) => {
    await page.goto('/');

    // 檢查背景漸層色
    const body = page.locator('body');
    const bgColor = await body.evaluate(el =>
      window.getComputedStyle(el).background
    );

    // 確認背景包含漸層色
    expect(bgColor).toContain('linear-gradient');
  });

  test('Console 日誌檢查', async ({ page }) => {
    const consoleMessages: string[] = [];

    page.on('console', msg => {
      consoleMessages.push(msg.text());
    });

    await page.goto('/');
    await page.waitForTimeout(1000);

    // 檢查版本號是否輸出到 console
    const versionLog = consoleMessages.find(msg => msg.includes('Dune Stats Version'));
    expect(versionLog).toBeTruthy();

    // 檢查日期是否輸出
    const dateLog = consoleMessages.find(msg => msg.includes('Build Date'));
    expect(dateLog).toBeTruthy();
  });

  test('錯誤處理測試 - 無效路徑', async ({ page }) => {
    // 訪問不存在的路徑，應該不會崩潰
    await page.goto('/invalid-path');

    // 應該顯示某些內容（可能是首頁或 404 頁面）
    await expect(page.locator('body')).toBeVisible();
  });

  test('無障礙性測試 - 鍵盤導航', async ({ page }) => {
    await page.goto('/');

    // 使用 Tab 鍵導航
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // 檢查是否能聚焦到導航連結
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });
});
