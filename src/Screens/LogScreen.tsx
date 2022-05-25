import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import appColors from "../../assets/Styles/appColors";
import { Context } from "../context/Context";

//@ts-ignore
import { getFirestore, getDocs, collection, updateDoc, doc } from "firebase/firestore";

const screenWidth = Dimensions.get('screen').width;


const LogScreen = () => {
  const [selectedTank, setSelectedTank] = useState<any>('');
  const [tankPickerItems, setTankPickerItems] = useState<any>();

  const context = useContext(Context);
  const firestore = getFirestore();

  const tankPicker = () => {
    const data = context?.availableTanks;
    if (data.length > 0) {
      setSelectedTank(data[0].id);
      setTankPickerItems(data.map((item: any, index: number) => {
        return (
          <Picker.Item label={item.name} value={item.id} key={index} />
        )
      }))
    }
  }

  useEffect(() => {
    if (selectedTank !== '') {
      console.log('selectedTank: ', selectedTank)
    }
  }, [selectedTank]);

  useEffect(() => {
    tankPicker();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.contentView}>

        <View style={styles.pickerView}>

          <Picker
            style={styles.tankPicker}
            selectedValue={selectedTank}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedTank(itemValue)
            }>
            {tankPickerItems}
          </Picker>


        </View>

        <ScrollView style={styles.logView}>
          <Text style={styles.logText}>Logs goes here</Text>
        </ScrollView>

      </View>
    </View>
  )
}

export default LogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: appColors.mediumBlue
  },
  contentView: {
    alignItems: 'center',
    justifyContent: 'space-evenly'

  },
  pickerView: {
    width: '90%',
    marginTop: 30,
    marginBottom: 30,
  },
  logView: {
    height: '80%',
    width: screenWidth - 50 * 0.9,
    padding: 25,
    borderRadius: 10,
    backgroundColor: appColors.mistBlue
  },
  tankPicker: {
    backgroundColor: appColors.white
  },
  generalText: {
    fontFamily: 'Roboto',
    fontSize: 15,
    color: appColors.white
  },
  logText: {
    color: 'black'
  }
});