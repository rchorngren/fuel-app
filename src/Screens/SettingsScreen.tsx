import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthedScreens, SettingsScreens } from "../helpers/types";
import SettingsOverviewScreen from "./SettingsOverviewScreen";
import CreateScreen from "./CreateScreen";
import RemoveScreen from "./RemoveScreen";

interface ISettingsScreen extends NativeStackScreenProps<AuthedScreens, 'SettingsScreen'> { }

const Stack = createNativeStackNavigator<SettingsScreens>();

const SettingsScreen: React.FC<ISettingsScreen> = (props) => {

  return (
    <Stack.Navigator initialRouteName="SettingsOverviewScreen">
      <Stack.Screen
        name="SettingsOverviewScreen"
        component={SettingsOverviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateScreen"
        component={CreateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RemoveScreen"
        component={RemoveScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default SettingsScreen;