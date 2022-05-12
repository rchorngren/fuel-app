import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { StackScreen } from "../helpers/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from "../context/Context";


interface IMainScreen extends NativeStackScreenProps<StackScreen, "MainScreen"> { }

const MainScreen: React.FC<IMainScreen> = (props) => {

  const context = useContext(Context);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@authed_User');
    } catch (error) {
      console.log('There was an error remove stored user');
    }
    context?.setAuthed(false);
  }

  useEffect(() => {
    if (context?.authed === false) {
      props.navigation.replace("LandingScreen");
    }
  }, [context?.authed]);

  return (
    <View>
      <Text>Hello from MainScreen!</Text>
      <Pressable onPress={() => logout()}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  )
}

export default MainScreen;