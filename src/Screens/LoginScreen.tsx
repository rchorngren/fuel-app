import React, { useContext, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, Dimensions, Image } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Context } from "../context/Context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LandingScreens } from "../helpers/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
//@ts-ignore
import backgroundImg from "../../assets/images/background.png";
import FuelPump from "../../assets/svg/FuelPump";
import appColors from "../../assets/Styles/appColors";


const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

interface ILoginView extends NativeStackScreenProps<LandingScreens, 'LoginScreen'> { }

const LoginView: React.FC<ILoginView> = (props) => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState('');
  const [displayError, setDisplayError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const context = useContext(Context);
  const auth = getAuth();

  const storeUser = async (user: string) => {
    try {
      await AsyncStorage.setItem('@authed_User', user);
    } catch (error) {
      console.log('There was an error while saving the user: ', error);
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

  const loginUser = (email: string, password: string) => {
    if (email && password != '') {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const userStrigify = JSON.stringify(userCredentials.user);
          storeUser(userStrigify);
          context?.setAuthed(true);
        })
        .catch((error) => {
          errorHandler(error.code);
        })
    }
    else {
      errorHandler('Kontrollera dina uppgifter');
    }

  }

  const toggleRegistration = () => {
    props.navigation.navigate("RegistrationScreen");
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
            style={styles.loginInput}
            placeholder="Anv??ndarnamn"
            keyboardType="email-address"
            value={userName}
            onChangeText={setUserName}
          />

          <TextInput
            style={styles.loginInput}
            placeholder="L??senord"
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
            <Pressable style={styles.loginButton} onPress={() => loginUser(userName, password)}>
              <Text style={styles.buttonText}>Logga in</Text>
            </Pressable>
          )}
        </View>



        <Pressable style={styles.registerNavButton} onPress={() => toggleRegistration()}>
          <Text style={styles.registerText}>Registrera ny anv??ndare</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default LoginView;

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
    backgroundColor: 'rgba(175, 175, 0, 0.3)',
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
  loginInput: {
    height: 31,
    width: 250,
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    backgroundColor: appColors.mistBlue
  },
  loginButton: {
    height: 31,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: appColors.mediumBlue
  },
  registerNavButton: {
    position: 'absolute',
    padding: 10,
    bottom: 25
  },
  buttonText: {
    textTransform: 'uppercase',
    color: appColors.white
  },
  registerText: {
    color: appColors.white
  },
  errorText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'black'
  }
})