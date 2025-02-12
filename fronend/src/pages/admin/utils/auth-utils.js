// utils/auth-utils.js
export const checkAuthError = (error, navigate) => {
    const isAuthError = 
      error?.response?.status === 401 || 
      error?.response?.status === 403 ||
      error?.message?.toLowerCase().includes('unauthorized') ||
      error?.message?.toLowerCase().includes('invalid token');
  
    if (isAuthError) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('user');
      
      const returnPath = window.location.pathname;
      navigate('/admin/login', { 
        state: { from: { pathname: returnPath } },
        replace: true 
      });
      return true;
    }
    return false;
  };
  
  export const validateToken = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };