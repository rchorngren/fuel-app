import React, { useContext, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Context } from "../context/Context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LandingScreens } from "../helpers/types";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ILoginView extends NativeStackScreenProps<LandingScreens, "LoginScreen"> { }

const LoginView: React.FC<ILoginView> = (props) => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState('');

  const context = useContext(Context);

  const auth = getAuth();

  const storeUser = async (user: any) => {
    try {
      await AsyncStorage.setItem('@authed_User', user);
    } catch (error) {
      console.log('There was an error while saving the user');
    }
  }

  const loginUser = (email: string, password: string) => {
    if (email && password != '') {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          console.log('Signed in: ', userCredentials.user);
          storeUser(userCredentials.user);
          context?.setAuthed(true);
        })
        .catch((error) => {
          console.log('There was an error while signing in: ', error)
        })
    }
    else {
      console.log('Please make sure your username and password is filled in correctly');
    }

  }

  const toggleRegistration = () => {
    props.navigation.replace("RegistrationScreen");
  }

  return (
    <View style={styles.container}>

      <View style={styles.loginView}>
        <TextInput
          style={styles.loginInput}
          placeholder="Användarnamn"
          keyboardType="email-address"
          value={userName}
          onChangeText={setUserName}
        />

        <TextInput
          style={styles.loginInput}
          placeholder="Lösenord"
          keyboardType="default"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.loginButton} onPress={() => loginUser(userName, password)}>
          <Text>Logga in</Text>
        </Pressable>

      </View>



      <Pressable style={styles.registerNavButton} onPress={() => toggleRegistration()}>
        <Text>Registrera ny användare</Text>
      </Pressable>
    </View>
  )
}

export default LoginView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginView: {
    width: '90%',
    alignItems: 'center'

  },
  loginInput: {
    height: 31,
    width: 250,
    padding: 5,
    marginBottom: 10,
    borderWidth: 1,
  },
  loginButton: {
    height: 31,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'lightgray'
  },
  registerNavButton: {
    position: 'absolute',
    bottom: 35
  }
})