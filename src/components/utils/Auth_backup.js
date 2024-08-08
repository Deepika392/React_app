import axios from 'axios';
import { setAccessToken, setRefreshToken, getRefreshToken, removeTokens } from './TokenStorage';


export const refreshToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/refresh-token`, {
      refreshToken: getRefreshToken(),
    });

    const { accessToken, refreshToken } = response.data;

    setAccessToken(accessToken);
    setRefreshToken(refreshToken); // Optional: if you receive a new refresh token

    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    removeTokens();
    // Redirect to login or handle the error appropriately
  }
};
