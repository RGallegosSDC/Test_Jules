import os
from playwright.sync_api import Page, expect

def test_admin_navigation(page: Page):
    """
    Verifies that the new 'Análisis' and 'Tema' links are present
    in the admin navigation panel.
    """
    verification_dir = "jules-scratch/verification"
    os.makedirs(verification_dir, exist_ok=True)

    # Login as Super Admin
    page.goto("http://localhost:3000/auth/signin")
    page.get_by_label("Email").fill("superadmin@example.com")
    page.get_by_label("Password").fill("superadmin_password")
    page.get_by_role("button", name="Sign in with Credentials").click()
    expect(page).to_have_url("http://localhost:3000/admin", timeout=15000)

    # Verify new links are visible
    expect(page.get_by_role("link", name="Análisis")).to_be_visible()
    expect(page.get_by_role("link", name="Tema")).to_be_visible()

    page.screenshot(path=os.path.join(verification_dir, "admin_nav_verification.png"))

    print("Admin navigation verification script completed successfully.")