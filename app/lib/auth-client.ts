// app/lib/auth-client.ts
export const getAuthHeaders = () => {
  const token = localStorage.getItem('mz_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const saveLogin = (token: string, user: any) => {
  localStorage.setItem('mz_token', token);
  localStorage.setItem('mz_user', JSON.stringify(user));
};