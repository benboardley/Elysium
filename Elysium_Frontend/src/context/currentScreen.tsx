import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { Platform } from 'react-native';
import SensitiveInfo from 'react-native-sensitive-info';
import { Screen } from '../utils/types'

const setCurrentScreen = (currentScreen: Screen) => {
  const [cookies, setCookie, removeCookie] = useCookies(['currentScreen']);
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
      //await SensitiveInfo.setItem('currentScreen', currentScreen, {});
  } else {
      setCookie('currentScreen', currentScreen, { path: '/' });
      //console.log(cookies.currentScreen);
  }
}

const removeCurrentScreen = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['currentScreen']);
  removeCookie('currentScreen');
}

const getCurrentScreen = () => {
  const [cookies] = useCookies(['currentScreen']);
  return cookies.currentScreen; // This is passing back correct object
}

/*
export function setCurrentScreen(currentScreen: Screen) {
  const [cookies, setCookie, removeCookie] = useCookies(['currentScreen']);
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
      //await SensitiveInfo.setItem('currentScreen', currentScreen, {});
  } else {
      setCookie('currentScreen', currentScreen, { path: '/' });
      //console.log(cookies.currentScreen);
  }
};

export function removeCurrentScreen() {
  const [cookies, setCookie, removeCookie] = useCookies(['currentScreen']);
  removeCookie('currentScreen');
};

export function getCurrentScreen() {
    const [cookies] = useCookies(['currentScreen']);
    return cookies.currentScreen; // This is passing back correct object
}
*/
export { setCurrentScreen, getCurrentScreen, removeCurrentScreen };