import os
from playwright.sync_api import Page, expect

def test_final_verification(page: Page):
    """
    This test verifies two key fixes:
    1. Car images are now displayed on the public listing page.
    2. The admin dashboard shows the 'Active Subscriptions' stat card.
    """
    verification_dir = "jules-scratch/verification"
    os.makedirs(verification_dir, exist_ok=True)

    # 1. Verify car images on the homepage
    page.goto("http://localhost:3000")

    # Expect at least one car card to have an `img` tag, ensuring images are rendered.
    first_car_card = page.locator("a[href^='/car/']").first
    expect(first_car_card.locator("img")).to_be_visible(timeout=10000)

    page.screenshot(path=os.path.join(verification_dir, "01_homepage_with_images.png"))

    # 2. Login as Super Admin
    page.goto("http://localhost:3000/auth/signin")
    page.get_by_label("Email").fill("superadmin@example.com")
    page.get_by_label("Password").fill("superadmin_password")
    page.get_by_role("button", name="Sign in with Credentials").click()

    # Wait for navigation to the admin dashboard
    expect(page).to_have_url("http://localhost:3000/admin", timeout=15000)

    # 3. Verify the admin dashboard stats
    # Check that the new "Suscripciones Activas" card is visible.
    active_subs_card = page.get_by_role("heading", name="Suscripciones Activas")
    expect(active_subs_card).to_be_visible()

    # Check that the value is a number (the seed data creates 2 active subscriptions).
    expect(page.locator("p:text-is('2')")).to_be_visible()

    page.screenshot(path=os.path.join(verification_dir, "02_admin_dashboard_with_stats.png"))

    print("Final verification script completed successfully.")