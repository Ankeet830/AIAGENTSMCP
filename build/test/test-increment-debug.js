import { chromium } from "playwright";
async function testBroccoliIncrement() {
    console.log("Starting test: Add Brocolli with quantity 2");
    let browser;
    try {
        browser = await chromium.launch({ headless: false }); // Show browser
        const page = await browser.newPage();
        await page.goto("https://rahulshettyacademy.com/seleniumPractise/");
        await page.waitForLoadState('networkidle');
        console.log("Page loaded. Looking for broccoli...");
        // Find broccoli product using getByRole
        const broccoliHeading = page.getByRole('heading', { name: 'Brocolli - 1 Kg' });
        // Navigate up to the product div using xpath from the heading
        const broccoliContainer = broccoliHeading.locator('xpath=ancestor::div[1]');
        // Check quantity before - look specifically for .quantity class
        const quantityBefore = await broccoliContainer.locator('.quantity').first().inputValue();
        console.log("Brocolli quantity before:", quantityBefore);
        // Click ADD TO CART
        await broccoliContainer.locator('button').first().click();
        console.log("Clicked ADD TO CART for Brocolli");
        // Increment quantity
        const incrementBtn = broccoliContainer.locator('a').filter({ hasText: '+' }).first();
        await incrementBtn.click();
        console.log("Clicked increment button");
        await page.waitForTimeout(1000);
        // Check quantity after
        const quantityAfter = await broccoliContainer.locator('.quantity').inputValue();
        console.log("Brocolli quantity after increment:", quantityAfter);
        // Check a different product's quantity to verify it wasn't affected
        const carrotHeading = page.getByRole('heading', { name: 'Carrot - 1 Kg' });
        const carrotContainer = carrotHeading.locator('xpath=ancestor::div[1]');
        const carrotQuantity = await carrotContainer.locator('.quantity').first().inputValue();
        console.log("Carrot quantity (should be 1):", carrotQuantity);
        if (quantityAfter !== "1" && carrotQuantity === "1") {
            console.log("✅ TEST PASSED: Only Brocolli quantity was incremented");
        }
        else {
            console.log("❌ TEST FAILED: Increment affected other products or didn't work");
        }
        await page.waitForTimeout(5000);
    }
    catch (error) {
        console.error("❌ Test failed:", error);
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
}
testBroccoliIncrement().catch(console.error);
