import React, { useContext, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Context } from "../context/Context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LandingScreens } from "../helpers/types";

interface ILoginView extends NativeStackScreenProps<LandingScreens, "LoginView"> { }

const LoginView: React.FC<ILoginView> = (props) => {
  const [userName, setUserName] = useState('robert@horngren.net');
  const [password, setPassword] = useState('1234Aa');

  const context = useContext(Context);

  const auth = getAuth();

  const loginUser = (userName: string, password: string) => {
    signInWithEmailAndPassword(auth, userName, password)
      .then((userCredentials) => {
        console.log('Signed in: ', userCredentials.user);
        context?.setAuthed(true);
      })
      .catch((error) => {
        console.log('There was an error while signing in: ', error)
      })
  }

  const toggleRegistration = () => {
    props.navigation.replace("RegistrationView");
  }

  return (
    <View>
      <Text>Hello from LoginScreen</Text>
      <Pressable onPress={() => loginUser(userName, password)}>
        <Text>Login!</Text>
      </Pressable>

      <Pressable onPress={() => toggleRegistration()}>
        <Text>I wanna register!</Text>
      </Pressable>
    </View>
  )
}

export default LoginView;