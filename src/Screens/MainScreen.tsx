import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text } from "react-native";
import { StackScreen } from "../helpers/types";

interface IMainScreen extends NativeStackScreenProps<StackScreen, "MainScreen"> { }

const MainScreen: React.FC<IMainScreen> = (props) => {

  return (
    <View>
      <Text>Hello from MainScreen!</Text>
    </View>
  )
}

export default MainScreen;