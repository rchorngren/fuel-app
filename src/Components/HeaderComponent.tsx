import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SettingsScreens } from "../helpers/types";

const HeaderComponent = ({ functionToTrigger, headerTitle }: any) => {


  return (
    <View style={styles.container}>

      <Pressable style={styles.backNavButton} onPress={() => functionToTrigger()}>
        <Text>!</Text>
      </Pressable>

      <View>
        <Text style={styles.headerText}>{headerTitle}</Text>
      </View>
    </View>
  )
}

export default HeaderComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 75,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    backgroundColor: 'gray'
  },
  backNavButton: {
    position: 'absolute',
    left: 25,
    padding: 10
  },
  headerText: {
    fontSize: 24
  }
});