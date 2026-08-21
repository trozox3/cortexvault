import { test, expect } from '@playwright/test';

test.describe('CortexVault E2E Tests', () => {
  test('Landing Page and Login Flow', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');
    
    // Verify title
    await expect(page).toHaveTitle(/CortexVault/);
    
    // Click Sign In
    await page.getByRole('link', { name: 'Sign In' }).click();
    
    // Ensure we are on login page
    await expect(page.getByRole('heading', { name: 'Sign in to CortexVault' })).toBeVisible();
    
    // Submit login form
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    // Check redirection to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Command Center' })).toBeVisible();
  });

  test('Intelligence Chat Query', async ({ page }) => {
    // Navigate straight to chat (assuming no real auth middleware blocks it in mock)
    await page.goto('/chat');
    
    // Verify Chat Page Loaded
    await expect(page.getByRole('heading', { name: 'Intelligence Chat' })).toBeVisible();

    // The initial assistant message should be visible
    await expect(page.getByText('Hello. I am your CortexVault')).toBeVisible();

    // Type a query and submit
    const input = page.getByPlaceholder('Ask a question');
    await input.fill('What is the data retention policy?');
    await page.locator('button[type="submit"]').click();

    // Wait for the mock response
    await page.waitForTimeout(3000);

    // Verify response contains expected text from RAG
    await expect(page.getByText(/There is a conflict regarding data retention/i)).toBeVisible();

    // Verify Evidence View renders citations
    await expect(page.getByText('Evidence View')).toBeVisible();
    await expect(page.getByText('User data must be retained for 7 years').first()).toBeVisible();
  });

  test('Workspace Document Rendering', async ({ page }) => {
    await page.goto('/workspace');
    await expect(page.getByRole('heading', { name: 'Knowledge Workspace' })).toBeVisible();
    
    // Verify mock data documents are listed
    await expect(page.getByText('Information Security Policy v3.2')).toBeVisible();
    await expect(page.getByText('Vendor Master Agreement - TechCorp')).toBeVisible();
  });

  test('Compare Studio Highlighting', async ({ page }) => {
    await page.goto('/compare');
    await expect(page.getByRole('heading', { name: 'Compare Studio' })).toBeVisible();
    
    // Check that conflict is surfaced when these specific docs are selected
    await expect(page.getByText('Conflict Detected')).toBeVisible();
    await expect(page.getByText('User data must be retained for 7 years')).toBeVisible();
  });

  test('Conflict Radar Visualization', async ({ page }) => {
    await page.goto('/conflicts');
    await expect(page.getByRole('heading', { name: 'Conflict Radar' })).toBeVisible();
    
    // Check high severity conflict card
    await expect(page.getByText('Data Retention Discrepancy')).toBeVisible();
    await expect(page.getByText('High Severity')).toBeVisible();
  });
});
