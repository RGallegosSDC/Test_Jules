import re
from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This script verifies the new professional image upload workflow.
    It uploads a file, creates a new car, and verifies the image
    is displayed on the car's detail page.
    """

    # 1. Log in as a client admin
    print("Logging in as client...")
    page.goto("http://localhost:3000/auth/signin")
    page.get_by_label("Correo Electrónico").fill("admin@automundo.com")
    page.get_by_label("Contraseña").fill("client1_password")
    page.get_by_role("button", name="Iniciar Sesión").click()
    expect(page.get_by_role("heading", name="Mis Autos")).to_be_visible(timeout=10000)
    print("Login successful.")

    # 2. Go to the "Add Car" page
    print("Navigating to Add Car page...")
    page.get_by_role("link", name="+ Añadir Auto Nuevo").click()
    expect(page.get_by_role("heading", name="Añadir Nuevo Auto")).to_be_visible(timeout=10000)

    # 3. Upload a test image
    print("Uploading test image...")
    file_input = page.locator('input[type="file"]')
    test_filename = 'test_car_professional.jpg'
    file_input.set_input_files(f'jules-scratch/verification/{test_filename}')

    # Verify the preview image from the mocked API response appears
    expected_src = f"https://placehold.co/600x400?text=Uploaded:{test_filename}"
    preview_image = page.get_by_alt_text("Preview 0")
    expect(preview_image).to_be_visible(timeout=15000) # Increased timeout for upload
    expect(preview_image).to_have_attribute("src", expected_src)
    print("Image preview verified.")

    # 4. Fill out the rest of the form
    print("Filling out car details...")
    car_make = "Subaru"
    car_model = "Outback"
    page.get_by_label("Marca").fill(car_make)
    page.get_by_label("Modelo").fill(car_model)
    page.get_by_label("Año").fill("2024")
    page.get_by_label("Precio ($)").fill("35000")
    page.get_by_label("Descripción").fill("Un auto de aventura, perfecto para cualquier terreno.")

    # 5. Submit the form
    print("Submitting new car form...")
    page.get_by_role("button", name="Guardar Auto").click()

    # 6. Verify redirection and find the new car on the dashboard
    print("Verifying car on dashboard...")
    expect(page.get_by_role("heading", name="Mis Autos")).to_be_visible(timeout=10000)

    # Force a reload to ensure we have the latest data after revalidation
    print("Reloading page to get fresh data...")
    page.reload()
    expect(page.get_by_role("heading", name="Mis Autos")).to_be_visible(timeout=10000)

    # Use .first() to select the most recent entry
    new_car_row = page.locator("tbody").get_by_role("row", name=re.compile(f"{car_make} {car_model}", re.IGNORECASE)).first
    expect(new_car_row).to_be_visible()

    # 7. Navigate to the new car's edit page
    print("Navigating to edit page...")
    new_car_row.get_by_role("link", name="Editar").click()
    expect(page.get_by_role("heading", name="Editar Auto")).to_be_visible(timeout=10000)

    # 8. Verify the uploaded image is displayed on the edit page
    print("Verifying image on edit page...")
    preview_image_on_edit = page.get_by_alt_text("Preview 0")
    expect(preview_image_on_edit).to_be_visible()
    expect(preview_image_on_edit).to_have_attribute("src", expected_src)
    print("Image successfully displayed on edit page.")

    # 9. Take the final screenshot of the edit page
    screenshot_path = "jules-scratch/verification/verification.png"
    page.screenshot(path=screenshot_path)
    print(f"Screenshot of edit page saved to {screenshot_path}")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()