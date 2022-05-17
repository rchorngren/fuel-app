import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import HeaderComponent from "../Components/HeaderComponent";
import { SettingsScreens } from "../helpers/types";

//@ts-ignore
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { Context } from "../context/Context";

interface ICreateScreen extends NativeStackScreenProps<SettingsScreens, 'CreateScreen'> { }

const CreateScreen: React.FC<ICreateScreen> = (props) => {
  const [selectTypeToAdd, setSelectedTypeToAdd] = useState<string>('tank');
  // const [selectDetailToAdd, setSelectDetailsToAdd] = useState(<View />);
  const [typeOfFuel, setTypeOfFuel] = useState<string>('diesel');
  const [tankSize, setTankSize] = useState<string>('0');
  const [tankName, setTankName] = useState<string>('');
  const [vesselName, setVesselName] = useState<string>('');
  const [uid, setUid] = useState<string>('');

  const firestore = getFirestore();
  const context = useContext(Context);

  const navigateBack = () => {
    props.navigation.goBack();
  }

  const saveToFirebase = async () => {
    if (selectTypeToAdd === 'tank') {
      // const document = context?.authedUserUid + '-' + tankName
      await setDoc(doc(firestore, context?.authedUserUid, selectTypeToAdd, typeOfFuel, tankName), {
        // owner: context?.authedUserUid,
        type: selectTypeToAdd,
        fuel: typeOfFuel,
        size: tankSize,
        name: tankName
      });
    }
    else if (selectTypeToAdd === 'vessel') {
      await setDoc(doc(firestore, selectTypeToAdd, vesselName), {
        ownder: 'uidgoeshere',
        type: selectTypeToAdd,
        name: vesselName
      })
    }

  }

  return (
    <View style={styles.container}>
      <HeaderComponent functionToTrigger={navigateBack} headerTitle={"Lägg till"} />

      <View style={styles.contentContainer}>

        <View style={styles.pickerView}>
          <Text>Vad vill du lägga till?</Text>
          <Picker
            style={styles.pickerInput}
            selectedValue={selectTypeToAdd}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedTypeToAdd(itemValue)
            }>
            <Picker.Item label="Tank" value="tank" />
            <Picker.Item label="Fartyg" value="vessel" />
          </Picker>
        </View>

        {selectTypeToAdd === 'tank' ? (
          <View>
            <View style={styles.pickerView}>
              <Text>Typ av bränsle i tanken?</Text>
              <Picker
                style={styles.pickerInput}
                selectedValue={typeOfFuel}
                onValueChange={(fuelType, itemIndex) =>
                  setTypeOfFuel(fuelType)
                }>
                <Picker.Item label="Diesel" value="diesel" />
                <Picker.Item label="Bensin" value="bensin" />
              </Picker>
            </View>

            <View style={styles.pickerView}>
              <Text>Storlek på tank (anges i liter)</Text>
              <TextInput
                style={styles.textInput}
                keyboardType='number-pad'
                value={tankSize}
                onChangeText={setTankSize}
              />
            </View>

            <View style={styles.pickerView}>
              <Text>Namn på tanken</Text>
              <TextInput
                style={styles.textInput}
                keyboardType='default'
                value={tankName}
                onChangeText={setTankName}
              />
            </View>

            <Pressable style={styles.saveButton} onPress={() => saveToFirebase()}>
              <Text>Spara</Text>
            </Pressable>
          </View>
        ) : (
          null
        )}

      </View>

    </View>
  )
}

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 25
  },
  pickerView: {
    marginBottom: 10
  },
  pickerInput: {
    height: 30,
    width: 250,
  },
  textInput: {
    height: 30,
    width: 250,
    borderRadius: 2,
    borderWidth: 1,
    paddingLeft: 5,
    backgroundColor: 'white'
  },
  saveButton: {

  }
})