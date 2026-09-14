import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD78h1cqOVM1d_yvFMpSq-LNOiIekNTxDc',
  authDomain: 'cp4-auth.firebaseapp.com',
  projectId: 'cp4-auth',
  storageBucket: 'cp4-auth.firebasestorage.app',
  messagingSenderId: '586728627249',
  appId: '1:586728627249:web:75eb49c6e6a0f5512d0910',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

export { app, auth };
