import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { useContext, useEffect } from "react";
import { AuthedScreens, StackScreen } from "../helpers/types";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./SettingsScreen";
import { Context } from "../context/Context";

interface IMainScreen extends NativeStackScreenProps<StackScreen, "MainScreen"> { }

const MainScreen: React.FC<IMainScreen> = (props) => {
  const TabsNavigation = createMaterialTopTabNavigator<AuthedScreens>();
  const context = useContext(Context);

  useEffect(() => {
    if (context?.authed === false) {
      props.navigation.replace('LandingScreen');
    }
  }, [context?.authed])

  return (
    <TabsNavigation.Navigator
      initialRouteName='HomeScreen'
      tabBarPosition='bottom'>
      <TabsNavigation.Screen
        name='LogScreen'
        component={HomeScreen}
        options={{
          // tabBarIcon: () => { return (<HomeSvg />)},
          // tabBarActiveTintColor: 'hotpink'
          // tabBarInactiveTintColor: 'gray'
          tabBarLabel: "Loggar",
          // tabBarLabelStyle: styles.tabBarLabel,
        }} />
      <TabsNavigation.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{
          // tabBarIcon: () => { return (<HomeSvg />)},
          // tabBarActiveTintColor: 'hotpink'
          // tabBarInactiveTintColor: 'gray'
          tabBarLabel: "Hem",
          // tabBarLabelStyle: styles.tabBarLabel,
        }} />

      <TabsNavigation.Screen
        name='SettingsScreen'
        component={SettingsScreen}
        // children={() => <SettingsScreen logoutFunction={logout} />}
        options={{
          // tabBarIcon: () => { return (<HomeSvg />)},
          // tabBarActiveTintColor: 'hotpink'
          // tabBarInactiveTintColor: 'gray'
          tabBarLabel: "Inställningar",
          // tabBarLabelStyle: styles.tabBarLabel,
        }} />

    </TabsNavigation.Navigator>
  )
}

export default MainScreen;