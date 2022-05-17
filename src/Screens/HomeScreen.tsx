import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect } from "react";
import { View, Text } from "react-native";
import { Context } from "../context/Context";


const HomeScreen = () => {
  const context = useContext(Context);

  const loadUser = async () => {
    try {
      const user = await AsyncStorage.getItem('@authed_User');
      const parsedUser = JSON.parse(user!);
      context?.setAuthedUserUid(parsedUser.uid);
    } catch (error) {
      console.log('There was an error while loading the user: ', error);
    }
  }


  useEffect(() => {
    loadUser();
  }, []);


  return (
    <View>
      <Text>Hello from HomeScreen!</Text>
    </View>
  )
}

export default HomeScreen;