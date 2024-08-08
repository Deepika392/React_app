export const setAccessToken = (token) => {

    localStorage.setItem('authToken', token);
  };
  
  export const getAccessToken = () => {
    return localStorage.getItem('authToken');
  };
  
  export const setRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
  };
  
  export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
  };
  
  export const removeTokens = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  };
  