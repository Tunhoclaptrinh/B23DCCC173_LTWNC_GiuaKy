import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('book-clean-code')).toBeVisible();
});

test('catalogue loads without browser errors and has no horizontal overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.reload();
  await expect(page.getByTestId('book-clean-code')).toBeVisible();
  await expect(page.locator('.book-card')).toHaveCount(12);
  await expect(
    page.getByTestId('book-thinking-fast-slow').getByRole('button', { name: 'Mượn' }),
  ).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
});

test('search is case-insensitive, searches authors, combines with filters, and can be reset', async ({
  page,
}) => {
  const search = page.getByRole('textbox', { name: 'Tìm theo tên sách hoặc tác giả' });
  await search.fill('rObErT');
  await expect(page.locator('.book-card')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Clean Code', exact: true })).toBeVisible();
  await page.getByText('Kinh tế', { exact: true }).first().click();
  await expect(
    page.getByRole('heading', { name: 'Chưa tìm thấy cuốn sách phù hợp' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Xóa bộ lọc' }).first().click();
  await expect(search).toHaveValue('');
  await expect(page.locator('.book-card')).toHaveCount(12);
  await page.getByText('Ngoại ngữ', { exact: true }).first().click();
  await expect(page.locator('.book-card')).toHaveCount(3);
});

test('middleware blocks the fourth copy; returning frees a slot and stock stays correct', async ({
  page,
}) => {
  const cleanCode = page.getByTestId('book-clean-code');
  for (let copy = 0; copy < 3; copy += 1)
    await cleanCode.getByRole('button', { name: 'Mượn', exact: true }).click();
  await expect(cleanCode.getByText('Còn 2 bản')).toBeVisible();
  await cleanCode.getByRole('button', { name: 'Mượn', exact: true }).click();
  await expect(page.getByText('Đã đạt giới hạn mượn sách', { exact: true })).toBeVisible();
  await expect(cleanCode.getByText('Còn 2 bản')).toBeVisible();
  await cleanCode.getByRole('button', { name: 'Trả Clean Code' }).click();
  await expect(cleanCode.getByText('Còn 3 bản')).toBeVisible();
  await page
    .getByTestId('book-psychology-money')
    .getByRole('button', { name: 'Mượn', exact: true })
    .click();
  await expect(page.getByTestId('book-psychology-money').getByText('Còn 2 bản')).toBeVisible();
});

test('borrowed route supports returns and statistics count titles and borrowed copies', async ({
  page,
}) => {
  await page
    .getByTestId('book-clean-code')
    .getByRole('button', { name: 'Mượn', exact: true })
    .click();
  await page
    .getByTestId('book-clean-code')
    .getByRole('button', { name: 'Mượn', exact: true })
    .click();
  await page.getByRole('link', { name: 'Thống kê', exact: true }).click();
  await expect(page).toHaveURL('/stats');
  const tech = page.getByRole('row').filter({ hasText: 'CNTT' });
  await expect(tech.getByRole('cell')).toHaveText(['CNTT', '6', '18', '2']);
  await page.getByRole('link', { name: /Đang mượn/ }).click();
  await expect(page).toHaveURL('/borrowed');
  await expect(page.getByText('2/3 cuốn đang mượn', { exact: true })).toBeVisible();
  for (let copy = 0; copy < 2; copy += 1)
    await page.getByRole('button', { name: 'Trả Clean Code' }).click();
  await expect(page.getByRole('heading', { name: 'Một tủ sách đang chờ bạn' })).toBeVisible();
});

test('API failure shows an error and retry loads the catalogue', async ({ page }) => {
  await page.goto('/?apiError=1');
  await expect(page.getByText('Đang tải...', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Chưa thể tải danh sách sách. Vui lòng thử lại.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Thử lại' }).click();
  await expect(page.getByTestId('book-clean-code')).toBeVisible();
});

test('borrowing the last copy disables borrowing and returning enables it again', async ({
  page,
}) => {
  const book = page.getByTestId('book-pragmatic-programmer');
  const borrow = book.getByRole('button', { name: 'Mượn', exact: true });
  await borrow.click();
  await borrow.click();
  await expect(borrow).toBeDisabled();
  await expect(book.getByText('Hết bản', { exact: true })).toBeVisible();
  await book.getByRole('button', { name: 'Trả The Pragmatic Programmer' }).click();
  await expect(borrow).toBeEnabled();
  await expect(book.getByText('Còn 1 bản', { exact: true })).toBeVisible();
});

test('borrowed cards and catalogue fit phone, tablet and desktop widths', async ({ page }) => {
  await page
    .getByTestId('book-clean-code')
    .getByRole('button', { name: 'Mượn', exact: true })
    .click();
  for (const width of [320, 375, 600, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `Horizontal overflow at ${width}px`,
    ).toBe(true);
    const card = page.getByTestId('book-clean-code');
    const box = await card.boundingBox();
    const button = await card.getByRole('button', { name: 'Trả Clean Code' }).boundingBox();
    expect(box).not.toBeNull();
    expect(button).not.toBeNull();
    if (box && button) expect(button.x + button.width).toBeLessThanOrEqual(box.x + box.width);
  }
});

test('dark mode persists and stats can be opened directly', async ({ page }) => {
  await page.getByRole('switch', { name: 'Chuyển giao diện sáng tối' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.goto('/stats');
  await expect(page.getByText('Đầu sách theo thể loại', { exact: true })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
});

test('Vietnamese search accepts unaccented input and surrounding whitespace', async ({ page }) => {
  const search = page.getByRole('textbox', { name: 'Tìm theo tên sách hoặc tác giả' });
  await search.fill('  TAM LY HOC VE TIEN  ');
  await expect(page.locator('.book-card')).toHaveCount(1);
  await expect(page.getByTestId('book-psychology-money')).toBeVisible();
  await search.fill('    ');
  await expect(page.locator('.book-card')).toHaveCount(12);
});

test('keyboard users can skip navigation and the active route is announced', async ({ page }) => {
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Đến nội dung chính' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page.getByRole('link', { name: 'Khám phá', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(page).toHaveTitle('Khám phá · Mini Library');
});

test('a failed lazy route shows recovery UI while the library navigation remains usable', async ({
  page,
}) => {
  await page.route(
    /\/(?:src\/pages\/StatsPage\.tsx|assets\/StatsPage-[^/]+\.js)(?:\?.*)?$/,
    (route) => route.abort(),
  );
  await page.getByRole('link', { name: 'Thống kê', exact: true }).click();
  await expect(page.getByText('Trang chưa thể hiển thị', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tải lại trang', exact: true })).toBeVisible();
  await mkdir('docs/screenshots', { recursive: true });
  await page.screenshot({
    path: 'docs/screenshots/page-error.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('link', { name: 'Khám phá', exact: true }).click();
  await expect(page.getByTestId('book-clean-code')).toBeVisible();
});

test('mobile navigation, help and layout work at narrow widths', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'Mở menu điều hướng' }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer).toBeVisible();
  await drawer.getByRole('link', { name: 'Thống kê', exact: true }).click();
  await expect(page).toHaveURL('/stats');
  await expect(page.getByRole('table')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'Mở menu điều hướng' }).click();
  await page.getByRole('button', { name: /Hướng dẫn mượn sách/ }).click();
  await expect(page.getByText('Một vài điều trước khi đọc')).toBeVisible();
  await page.getByRole('button', { name: 'Mình đã hiểu' }).click();
});

test('capture desktop, dark, borrowed, statistics and mobile interfaces', async ({ page }) => {
  await mkdir('docs/screenshots', { recursive: true });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: 'docs/screenshots/desktop-light.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('switch', { name: 'Chuyển giao diện sáng tối' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.screenshot({
    path: 'docs/screenshots/desktop-dark.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('switch', { name: 'Chuyển giao diện sáng tối' }).click();
  await page
    .getByTestId('book-clean-code')
    .getByRole('button', { name: 'Mượn', exact: true })
    .click();
  await page
    .getByTestId('book-psychology-money')
    .getByRole('button', { name: 'Mượn', exact: true })
    .click();
  // Wait for transient toasts; the shelf itself is the durable feedback.
  await expect(page.locator('.ant-message-notice')).toHaveCount(0, { timeout: 6000 });
  await page.screenshot({
    path: 'docs/screenshots/desktop-borrowed.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.getByRole('link', { name: 'Thống kê', exact: true }).click();
  await expect(page.getByRole('table')).toBeVisible();
  await page.screenshot({
    path: 'docs/screenshots/statistics.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.goto('/');
  await expect(page.getByTestId('book-clean-code')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: 'docs/screenshots/mobile-light.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({
    path: 'docs/screenshots/tablet-light.png',
    fullPage: true,
    animations: 'disabled',
  });
});
