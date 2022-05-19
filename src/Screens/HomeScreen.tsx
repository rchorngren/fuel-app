import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { AuthedScreens, HomeScreens } from "../helpers/types";
import HomeOverviewScreen from "./HomeOverviewScreen";
import RefuelBunkerScreen from "./RefuelBunkerScreen";
import SelectedTankScreen from "./SelectedTankScreen";

interface IHomeScreen extends NativeStackScreenProps<AuthedScreens, 'HomeScreen'> { }

const Stack = createNativeStackNavigator<HomeScreens>();

const HomeScreen: React.FC<IHomeScreen> = (props) => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeOverviewScreen"
        component={HomeOverviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectedTankScreen"
        component={SelectedTankScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RefuelBunkerScreen"
        component={RefuelBunkerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default HomeScreen;