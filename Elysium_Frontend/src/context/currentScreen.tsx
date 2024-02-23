import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { Platform } from 'react-native';
import SensitiveInfo from 'react-native-sensitive-info';
import { Screen } from '../utils/types'

export function setCurrentScreen(currentScreen: Screen) {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        //await SensitiveInfo.setItem('currentScreen', currentScreen, {});
    } else {
        const [cookies, setCookie, removeCookie] = useCookies(['currentScreen']);
        setCookie('currentScreen', currentScreen, { path: '/' });
    }
};

export function getCurrentScreen() {
    const [cookies] = useCookies(['currentScreen']);
    return cookies.currentScreen;
}

/*
export const useCurrentScreen = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen | null>(null); // Initialize state for currentScreen
    useEffect(() => {
      // Define an async function to fetch the current screen
      const fetchCurrentScreen = async () => {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          // Fetch current screen from sensitive info for mobile platforms
          // const screen = await SensitiveInfo.getItem('currentScreen', {});
        } else {
          // For web, fetch current screen from cookies
          const [cookies, setCookie, removeCookie] = useCookies(['currentScreen']);
          setCookie('currentScreen', currentScreen, { path: '/' });
          setCurrentScreen(cookies.currentScreen); // Update state with fetched screen
        }
      };
  
      fetchCurrentScreen(); // Call the async function to fetch the current screen
    }, []); // This effect runs only once on component mount
  
    return currentScreen; // Return the current screen state
  };

*/

//'MainScreen', { screen: 'Dashboard' }
/*
export const setCurrentScreen = async (currentScreen: Screen) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentScreen']);
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
        //await SensitiveInfo.setItem('currentScreen', currentScreen, {});
    } else {
        setCookie('currentScreen', currentScreen, { path: '/' });
    }
}
*/

