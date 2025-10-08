// app/lib/validateLicense.ts
export async function validateLicenseKey(licenseKey: string) {
  try {
    console.log("🔍 Validating license:", licenseKey);
    
    const response = await fetch('/api/validateAI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ licenseKey }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Validation request failed:", response.status, errorText);
      throw new Error(`Validation failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("📋 Validation response:", data);
    
    return data;
  } catch (error) {
    console.error('❌ License validation error:', error);
    return {
      valid: false,
      error: 'Failed to validate license. Please try again.'
    };
  }
}