import React, { useContext } from "react";
import { View, Text, Pressable } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from "../context/Context";

const SettingsScreen = () => {

  const context = useContext(Context);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@authed_User');
    } catch (error) {
      console.log('There was an error remove stored user');
    }
    context?.setAuthed(false);
  }

  return (
    <View>
      <Text>Hello from SettingsScreen!</Text>
      <Pressable onPress={() => logout()}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  )
}

export default SettingsScreen;