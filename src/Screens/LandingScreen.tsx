import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from "react";
import LoginView from '../Components/LoginView';
import RegistrationView from '../Components/RegistrationView';
import { Context } from '../context/Context';
import { LandingScreens, StackScreen } from '../helpers/types';

interface ILandingScreen extends NativeStackScreenProps<StackScreen, "LandingScreen"> { }

const Stack = createNativeStackNavigator<LandingScreens>();

const LandingScreen: React.FC<ILandingScreen> = (props) => {

  const context = useContext(Context);

  useEffect(() => {
    if (context?.authed) {
      props.navigation.replace('MainScreen');
    }
  }, [context?.authed]);

  return (
    <Stack.Navigator>
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