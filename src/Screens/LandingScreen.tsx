import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from "react";
import LoginView from './LoginScreen';
import RegistrationView from './RegistrationScreen';
import { Context } from '../context/Context';
import { LandingScreens, StackScreen } from '../helpers/types';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface ILandingScreen extends NativeStackScreenProps<StackScreen, "LandingScreen"> { }

const Stack = createNativeStackNavigator<LandingScreens>();

const LandingScreen: React.FC<ILandingScreen> = (props) => {

  const context = useContext(Context);

  const loadUser = async () => {
    try {
      const value = await AsyncStorage.getItem('@authed_User');
      if (value !== null) {
        context?.setAuthed(true);
      }
    } catch (error) {
      console.log('There was an error loading user');
    }
  }

  useEffect(() => {
    if (context?.authed) {
      props.navigation.replace('MainScreen');
    }
  }, [context?.authed]);

  useEffect(() => {
    loadUser()
  }, []);

  return (
    <Stack.Navigator initialRouteName='LoginView'>
      <Stack.Screen
        name="LoginView"
        component={LoginView}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RegistrationView"
        component={RegistrationView}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  )
}

export default LandingScreen;