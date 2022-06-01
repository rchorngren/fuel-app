import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, Image, Dimensions } from "react-native";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { LandingScreens } from "../helpers/types";
import { Context } from "../context/Context";
import AsyncStorage from '@react-native-async-storage/async-storage';
//@ts-ignore
import backgroundImg from "../../assets/images/background.png";
import FuelPump from "../../assets/svg/FuelPump";
import appColors from "../../assets/Styles/appColors";

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

interface IRegistrationView extends NativeStackScreenProps<LandingScreens, "RegistrationScreen"> { }

const RegistrationView: React.FC<IRegistrationView> = (props) => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const context = useContext(Context);
  const auth = getAuth();

  const storeUser = async (user: string) => {
    try {
      await AsyncStorage.setItem('@authed_User', user);
    } catch (error) {
      console.log('There was an error while saving the user');
    }
  }

  const errorHandler = (errorMsg: string) => {
    setErrorMessage(errorMsg);
    setDisplayError(true);
    setTimeout(() => {
      setDisplayError(false);
      setErrorMessage('');
    }, 4000);
  }

  const createUser = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredentials) => {
            console.log('Signed in: ', userCredentials.user);
            const userStrigify = JSON.stringify(userCredentials.user);
            storeUser(userStrigify);
            context?.setAuthed(true);
          })
          .catch((error) => {
            errorHandler(error.code);
          })

      })
      .catch((error) => {
        errorHandler(error.code);
      })
  }

  const toggleLogin = () => {
    props.navigation.navigate("LoginScreen");
  }

  return (
    <View style={styles.container}>
      <Image style={styles.background} source={backgroundImg} />

      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <FuelPump />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.loginView}>
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

          {displayError ? (
            <View style={styles.errorView}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : (
            <Pressable style={styles.registrationButton} onPress={() => createUser(userName, password)}>
              <Text style={styles.buttonText}>Registrera</Text>
            </Pressable>
          )}
        </View>

        <Pressable style={styles.loginNavButton} onPress={() => toggleLogin()}>
          <Text style={styles.loginText}>Tillbaka till inloggning</Text>
        </Pressable>
      </View>
    </View >
  )
}

export default RegistrationView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    height: screenHeight,
    width: screenWidth,
    position: 'absolute',
    zIndex: 1,
  },
  logoContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 150,
    width: '100%',
    zIndex: 10,
  },
  logo: {
    backgroundColor: 'rgba(0, 175, 175, 0.3)',
    width: 220,
    padding: 50,
    borderRadius: 120
  },
  contentContainer: {
    height: screenHeight,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 10
  },
  loginView: {
    width: '90%',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 50,
    borderRadius: 10,
    marginBottom: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  errorView: {
    height: 31,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: appColors.yellow
  },
  registrationInput: {
    height: 31,
    width: 250,
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    backgroundColor: '#F2F2F2'
  },
  registrationButton: {
    height: 31,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: appColors.mediumBlue
  },
  loginNavButton: {
    position: 'absolute',
    padding: 10,
    bottom: 25
  },
  buttonText: {
    textTransform: 'uppercase',
    color: appColors.white
  },
  loginText: {
    color: appColors.white
  },
  errorText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'black'
  }
})