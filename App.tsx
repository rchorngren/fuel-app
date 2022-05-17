import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import * as firebase from "firebase/app";
import firebaseConfig from './services/firebase';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackScreen } from './src/helpers/types';
import { ContextProvider } from './src/context/Context';
import LandingScreen from './src/Screens/LandingScreen';
import MainScreen from './src/Screens/MainScreen';

firebase.initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator<StackScreen>();

export default function App() {
  return (
    <NavigationContainer>
      <ContextProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="LandingScreen"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainScreen"
            component={MainScreen}
            options={{ headerShown: false }}
          />

        </Stack.Navigator>
      </ContextProvider>
    </NavigationContainer>
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
