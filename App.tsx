import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/Screens/LoginScreen';

import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAzfnZHha_RD20IZQswcwloq1d75n8L8Ig",
  authDomain: "fuel-app-20474.firebaseapp.com",
  projectId: "fuel-app-20474",
  storageBucket: "fuel-app-20474.appspot.com",
  messagingSenderId: "793154998078",
  appId: "1:793154998078:web:e70511d2208196461aa66f"
};

firebase.initializeApp(firebaseConfig);

export default function App() {

  return (
    <View>
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
