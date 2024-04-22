// api.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SensitiveInfo from 'react-native-sensitive-info'; // Make sure to install this library
import Cookies from 'universal-cookie';

type PlatformType = 'web' | 'ios' | 'android' | 'fallback';

interface ApiResponse<T> {
  data: T;
}

const getAuthToken = async (): Promise<string | null | undefined> => {
    const platform = getPlatform();
  
    if (platform === 'web') {
      // Logic for web platform
      const cookies = new Cookies();
      const cookie = await cookies.get('authToken');
      console.log('cookie', cookie)
      return cookie ? cookie : null;
    } else {
      // Logic for mobile platforms
      try {
        if (platform === 'ios' || platform === 'android') {
          const authToken = await SensitiveInfo.getItem('authToken', {});
          return authToken || null;
        }
      } catch (error) {
        console.error('Error retrieving authToken:', error);
        return undefined;
      }
    }
  };

const setAuthToken = async (token: string): Promise<void> => {
  const platform = getPlatform();

  if (platform === 'web') {
    // Logic for web platform
    // No token storage for web in this example
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 3); 
    const cookies = new Cookies();
    cookies.set('Token', token, { expires: expirationDate })//  path: '/', secure: true });
  } else {
    // Logic for mobile platforms
    try {
      if (platform === 'ios' || platform === 'android') {
        await SensitiveInfo.setItem('authToken', token, {});
      }
    } catch (error) {
      console.error('Error storing authToken:', error);
    }
  }
};

const getPlatform = (): PlatformType => {
  if (Platform.OS === 'web') {
    return 'web';
  } else if (Platform.OS === 'ios') {
    return 'ios';
  } else if (Platform.OS === 'android') {
    return 'android';
  } else {
    return 'fallback';
  }
};

const makeAuthenticatedRequest = async (url: string, method: string = 'get', data?: any): Promise<any> => {
   /* const authToken = await getAuthToken();
    console.log('auth', authToken)
    if (!authToken) {
      // Handle the case where the token is not available
      console.error('Authentication token not available');
      return null;
    }
  
    const headers: AxiosRequestConfig['headers'] = {
      Authorization: `Token ${authToken}`,
      'Content-Type': 'application/json',
    };*/
  
    try {
      //axios.defaults.withCredentials = true;
      //let response = axios.get(url)
        const response = await axios({
          url,
          method,
          data,
          withCredentials: true,  // Enable sending cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // Handle the response here
        console.log('API Response:', response.data);
  
        return response.data;
    } catch (error) {
      console.error('Error making authenticated request:', error);
      return null;
    }
  };

export { getAuthToken, setAuthToken, makeAuthenticatedRequest };

