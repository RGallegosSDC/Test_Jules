import re
import time
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This script performs an end-to-end verification of the final features:
    - Client Editing
    - Admin Dashboard Chart
    """

    # --- 1. Log in as Superadmin ---
    print("Logging in as Superadmin...")
    page.goto("http://localhost:3000/auth/signin")
    page.get_by_label("Correo Electrónico").fill("superadmin@example.com")
    page.get_by_label("Contraseña").fill("superadmin_password")
    page.get_by_role("button", name="Iniciar Sesión").click()
    page.wait_for_url("http://localhost:3000/dashboard")
    print("Login successful.")

    # --- 2. Verify Client Editing (Isolated Test) ---
    print("\nVerifying Client Editing...")
    # Go directly to a known client's edit page to isolate the test
    # We need a client ID first. Let's find "AutoMundo" from the list page.
    page.goto("http://localhost:3000/admin/clients")
    expect(page.get_by_role("heading", name="Gestionar Clientes")).to_be_visible(timeout=10000)

    automundo_row = page.get_by_role("row", name=re.compile("AutoMundo", re.IGNORECASE)).first
    edit_link = automundo_row.get_by_role("link", name="Editar")
    client_id = (edit_link.get_attribute("href") or "").split('/')[-2]

    print(f"Found client ID for AutoMundo: {client_id}")
    page.goto(f"http://localhost:3000/admin/clients/{client_id}/edit")

    # Verify the edit form is loaded
    expect(page.get_by_role("heading", name="Editar Cliente")).to_be_visible(timeout=10000)

    # Change the client's name
    new_name = f"AutoMundo Plus {int(time.time())}"
    name_input = page.get_by_label("Nombre del Cliente")
    # Just check that the input is not empty, as its value might have been changed by a previous run
    expect(name_input).not_to_be_empty()
    name_input.fill(new_name)

    # Submit the form
    page.get_by_role("button", name="Guardar Cambios").click()

    # Verify redirection to the client list and check for the new name
    expect(page.get_by_role("heading", name="Gestionar Clientes")).to_be_visible(timeout=10000)
    expect(page.get_by_text(new_name)).to_be_visible()
    print("Client Editing verification successful.")

    # --- 3. Verify Admin Dashboard Chart ---
    print("\nVerifying Admin Dashboard Chart...")
    page.goto("http://localhost:3000/admin")
    expect(page.get_by_role("heading", name="Dashboard del Administrador")).to_be_visible(timeout=10000)

    # Check if the chart container has a canvas element, indicating the chart has rendered
    chart_canvas = page.locator(".recharts-surface")
    expect(chart_canvas).to_be_visible(timeout=10000)
    expect(chart_canvas).to_have_attribute("width")
    expect(chart_canvas).to_have_attribute("height")
    print("Admin Dashboard Chart is visible.")

    # --- 4. Final Screenshot ---
    print("\nTaking final screenshot of the admin dashboard...")
    page.screenshot(path="jules-scratch/verification/verification.png")
    print("Screenshot taken.")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()