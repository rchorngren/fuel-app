import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { LandingScreens } from "../helpers/types";
import { Context } from "../context/Context";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IRegistrationView extends NativeStackScreenProps<LandingScreens, "RegistrationScreen"> { }

const RegistrationView: React.FC<IRegistrationView> = (props) => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const context = useContext(Context);

  const auth = getAuth();

  const storeUser = async (user: any) => {
    try {
      await AsyncStorage.setItem('@authed_User', user);
    } catch (error) {
      console.log('There was an error while saving the user');
    }
  }

  const createUser = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredentials) => {
            console.log('Signed in: ', userCredentials.user);
            storeUser(userCredentials.user);
            context?.setAuthed(true);
          })
          .catch((error) => {
            console.log('There was an error while signing in: ', error)
          })

      })
      .catch((error) => {
        console.log('There was an error while creating the user: ', error);
      })
  }

  const toggleLogin = () => {
    props.navigation.replace("LoginScreen");
  }

  return (
    <View style={styles.container}>

      <View>
        <TextInput
          style={styles.registrationInput}
          placeholder="Ange din e-postaddress"
          keyboardType="email-address"
          value={userName}
          onChangeText={setUserName}
        />

        <TextInput
          style={styles.registrationInput}
          placeholder="Ange önskat lösenord"
          keyboardType="default"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.registrationButton} onPress={() => createUser(userName, password)}>
          <Text>Registrera</Text>
        </Pressable>
      </View>

      <Pressable style={styles.loginNavButton} onPress={() => toggleLogin()}>
        <Text>Tillbaka till inloggning</Text>
      </Pressable>
    </View>
  )
}

export default RegistrationView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  registrationView: {
    width: '90%',
    alignItems: 'center'
  },
  registrationInput: {
    height: 31,
    width: 250,
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
  },
  registrationButton: {
    height: 31,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'lightgray'
  },
  loginNavButton: {
    position: 'absolute',
    bottom: 35
  }
})