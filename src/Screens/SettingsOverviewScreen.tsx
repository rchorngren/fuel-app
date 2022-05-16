import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Context } from "../context/Context";
import { SettingsScreens } from "../helpers/types";

interface ISettingsOverviewScreen extends NativeStackScreenProps<SettingsScreens, 'SettingsOverviewScreen'> { }

const SettingsOverviewScreen: React.FC<ISettingsOverviewScreen> = (props) => {

  const context = useContext(Context);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@authed_User');
    } catch (error) {
      console.log('There was an error remove stored user');
    }
    context?.setAuthed(false);
  }


  const navigate = (destination: string) => {
    //@ts-ignore
    props.navigation.navigate(destination);
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>

        <Pressable style={[styles.button]} onPress={() => navigate('CreateScreen')}>
          <Text style={styles.buttonText}>Lägg till...</Text>
        </Pressable>

        <Pressable style={[styles.button]} onPress={() => navigate('RemoveScreen')}>
          <Text style={styles.buttonText}>Ta bort...</Text>
        </Pressable>
      </View>

      <Pressable style={[styles.button, styles.logoutButton]} onPress={() => logout()}>
        <Text style={styles.buttonText}>Logga ut</Text>
      </Pressable>

    </View>
  )
}

export default SettingsOverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    marginTop: 50
  },
  button: {
    height: 50,
    width: 175,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20
  },
  logoutButton: {
    backgroundColor: 'red',
    // marginBottom: 20,
  },
  buttonText: {
    fontSize: 18
  }
})