import re
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This script verifies the subscription-based feature protection.
    It checks the UI for a non-subscribed user, simulates a subscription
    activation, and then checks the UI again.
    """

    # 1. Log in as a client admin (they are not subscribed by default)
    print("Logging in as a non-subscribed client...")
    page.goto("http://localhost:3000/auth/signin")
    page.get_by_label("Correo Electrónico").fill("admin@automundo.com")
    page.get_by_label("Contraseña").fill("client1_password")
    page.get_by_role("button", name="Iniciar Sesión").click()
    expect(page.get_by_role("heading", name="Mis Autos")).to_be_visible(timeout=10000)
    print("Login successful.")

    # 2. Verify the "non-subscribed" state
    print("\nVerifying non-subscribed state...")
    # Check that the activation banner is visible
    expect(page.get_by_role("heading", name="Cuenta Inactiva")).to_be_visible()
    # Check that the "Add Car" button is disabled
    add_car_button = page.get_by_role("button", name="+ Añadir Auto Nuevo")
    expect(add_car_button).to_be_disabled()
    print("Non-subscribed state verified correctly.")

    # 3. Take a screenshot of the non-subscribed dashboard
    screenshot_path = "jules-scratch/verification/verification.png"
    page.screenshot(path=screenshot_path)
    print(f"Screenshot of non-subscribed dashboard saved to {screenshot_path}")

    # 4. Simulate subscription activation by calling our test-only API route
    print("\nSimulating subscription activation...")
    page.request.post("http://localhost:3000/api/test/activate-subscription")

    # 5. Verify the "subscribed" state
    print("\nVerifying subscribed state...")
    # Reload the page to see the changes
    page.reload()
    expect(page.get_by_role("heading", name="Mis Autos")).to_be_visible(timeout=10000)

    # Check that the activation banner is GONE
    expect(page.get_by_role("heading", name="Cuenta Inactiva")).not_to_be_visible()
    # Check that the "Add Car" button is now ENABLED
    add_car_button_after = page.get_by_role("link", name="+ Añadir Auto Nuevo")
    expect(add_car_button_after).to_be_enabled()
    print("Subscribed state verified correctly.")
    print("\nVerification successful!")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # It's a client-side action, so we need to import it in the browser context
        page.add_init_script(path='car-portal/src/app/actions/stripeActions.ts')
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()