import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text, Pressable } from "react-native";
import { LandingScreens } from "../helpers/types";

interface IRegistrationView extends NativeStackScreenProps<LandingScreens, "RegistrationView"> { }

const RegistrationView: React.FC<IRegistrationView> = (props) => {

  const toggleLogin = () => {
    props.navigation.replace("LoginView");
  }

  return (
    <View>
      <Text>Hello from RegistrationView!</Text>
      <Pressable onPress={() => toggleLogin()}>
        <Text>Log me in instead</Text>
      </Pressable>
    </View>
  )
}

export default RegistrationView;