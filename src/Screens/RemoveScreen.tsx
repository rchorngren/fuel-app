import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text } from "react-native";
import HeaderComponent from "../Components/HeaderComponent";
import { SettingsScreens } from "../helpers/types";

interface IRemoveScreen extends NativeStackScreenProps<SettingsScreens, 'RemoveScreen'> { }

const RemoveScreen: React.FC<IRemoveScreen> = (props) => {

  const navigateBack = () => {
    props.navigation.goBack();
  }

  return (
    <View>
      <HeaderComponent functionToTrigger={navigateBack} headerTitle={"Ta bort"} />
    </View>
  )
}

export default RemoveScreen;