const { test, expect } = require('@playwright/test');
const testData = require('./data/testData.json');

async function login(page) {
    await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/')
    await page.getByLabel('username').click();
    await page.getByLabel('username').fill('admin');
    await page.getByLabel('password').click();
    await page.getByLabel('password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
}

async function navigateToSection(page, sectionName) {
    await page.getByRole('button', { name: sectionName }).click();
}

async function verifyTask(page, columnText, taskText, tags) {
    const column = page.getByText(columnText);
    const task = column.getByText(taskText);
    for (const tag of tags) {
        if (typeof tag === 'object') {
            await expect(task.getByText(tag.text, { exact: tag.exact })).toBeVisible();
        } else {
            await expect(task.getByText(tag)).toBeVisible();
        }
    }
}

test.beforeEach(async ({ page }) => {
    await login(page);
});

test.describe('Task and Tag Verification', () => {
    testData.forEach(({ testCase, sectionName, columnText, taskText, tags }) => {
        test(testCase, async ({ page }) => {
            await navigateToSection(page, sectionName);
            await verifyTask(page, columnText, taskText, tags);
        });
    });
});
