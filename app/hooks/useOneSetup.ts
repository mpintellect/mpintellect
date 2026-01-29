// app/hooks/useOneSetup.ts (CLOUDFLARE VERSION)
"use client";

export async function useOneSetup(): Promise<"ok" | "no-credits" | "error"> {
  try {
    const token = localStorage.getItem('cf_token');
    const userData = localStorage.getItem('cf_user');
    
    if (!token || !userData) {
      return "error";
    }

    const user = JSON.parse(userData);
    
    const response = await fetch('/api/user/use-setup', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user.id })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // Update local storage
        const updatedUser = { ...user, setup_count: (user.setup_count || 1) - 1 };
        localStorage.setItem('cf_user', JSON.stringify(updatedUser));
        return "ok";
      } else {
        return data.error === "no-credits" ? "no-credits" : "error";
      }
    }
    
    return "error";
  } catch (error) {
    console.error('Error using setup:', error);
    return "error";
  }
}