import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const LoginScreen = () => {
  const [userName, setUserName] = useState('robert@horngren.net');
  const [password, setPassword] = useState('1234Aa');

  const auth = getAuth();

  const loginUser = (userName: string, password: string) => {
    signInWithEmailAndPassword(auth, userName, password)
      .then((userCredentials) => {
        console.log('Signed in: ', userCredentials.user);
      })
      .catch((error) => {
        console.log('There was an error while signing in: ', error)
      })
  }

  return (
    <View>
      <Text>Hello from LoginScreen</Text>
      <Pressable onPress={() => loginUser(userName, password)}>
        <Text>Login!</Text>
      </Pressable>
    </View>
  )
}

export default LoginScreen;