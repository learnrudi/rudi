const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('1. Opening framework page...');
  await page.goto('http://localhost:8080/framework.html');

  console.log('2. Scrolling to form...');
  await page.locator('#orgForm').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  console.log('3. Entering organization name...');
  await page.fill('#orgInput', 'Demo Company');

  console.log('4. Clicking Generate Assessment Link...');
  await page.click('#orgForm button[type="submit"]');
  await page.waitForTimeout(500);

  console.log('5. Checking if link is displayed...');
  const linkText = await page.locator('#linkDisplay').textContent();
  console.log('   Assessment Link:', linkText);

  if (linkText.includes('Demo%20Company') || linkText.includes('Demo+Company')) {
    console.log('✓ SUCCESS: Link generated with org name!');
  }

  console.log('6. Testing Copy button...');
  await page.click('#copyLink');
  await page.waitForTimeout(500);

  console.log('7. Clicking Take Assessment...');
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    page.click('#startLink')
  ]).catch(() => [null]);

  if (newPage) {
    await newPage.waitForLoadState();
    console.log('8. Assessment page URL:', newPage.url());
    if (newPage.url().includes('assessment.html')) {
      console.log('✓ SUCCESS: Navigated to assessment page!');
    }
    await newPage.close();
  } else {
    // Same page navigation
    await page.waitForURL('**/assessment.html**', { timeout: 5000 }).catch(() => {});
    console.log('8. Current URL:', page.url());
  }

  console.log('9. Going back to test modal...');
  await page.goto('http://localhost:8080/framework.html');
  await page.locator('#orgForm').scrollIntoViewIfNeeded();
  await page.fill('#orgInput', 'Test Modal Corp');
  await page.click('#orgForm button[type="submit"]');
  await page.waitForTimeout(500);

  console.log('10. Clicking Leave Contact Info button...');
  await page.click('#contactBtn');
  await page.waitForTimeout(500);

  const modalVisible = await page.locator('#contactModal.active').isVisible();
  if (modalVisible) {
    console.log('✓ SUCCESS: Modal opened!');

    const iframeSrc = await page.locator('#contactFrame').getAttribute('src');
    if (iframeSrc && iframeSrc.includes('tally.so') && iframeSrc.includes('Test%20Modal%20Corp')) {
      console.log('✓ SUCCESS: Tally form loaded with org name in modal!');
    }

    console.log('11. Closing modal with X button...');
    await page.click('#closeModal');
    await page.waitForTimeout(300);

    const modalClosed = !(await page.locator('#contactModal.active').isVisible());
    if (modalClosed) {
      console.log('✓ SUCCESS: Modal closed!');
    }
  } else {
    console.log('✗ FAILED: Modal did not open');
  }

  await page.waitForTimeout(1000);
  await browser.close();

  console.log('\n✓ All tests complete!');
})();
