import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Dimensions, KeyboardAvoidingView } from "react-native";
import HeaderComponent from "../Components/HeaderComponent";
import { SettingsScreens } from "../helpers/types";

//@ts-ignore
import { getFirestore, addDoc, collection, updateDoc } from 'firebase/firestore';
import { Context } from "../context/Context";
import appColors from "../../assets/Styles/appColors";

interface ICreateScreen extends NativeStackScreenProps<SettingsScreens, 'CreateScreen'> { }

const screenHeigt = Dimensions.get('screen').height;

const CreateScreen: React.FC<ICreateScreen> = (props) => {
  const [selectTypeToAdd, setSelectedTypeToAdd] = useState<string>('tank');
  const [typeOfFuel, setTypeOfFuel] = useState<string>('diesel');
  const [tankSize, setTankSize] = useState<string>('');
  const [tankName, setTankName] = useState<string>('');
  const [vesselName, setVesselName] = useState<string>('');

  const firestore = getFirestore();
  const context = useContext(Context);

  const navigateBack = () => {
    props.navigation.goBack();
  }

  const saveToFirebase = async () => {
    const uid = context?.authedUserUid;

    const checkForValue = (valueToCheck: string) => {
      if (valueToCheck === '') {
        console.log('no value given')
      }
    }

    if (selectTypeToAdd === 'tank') {
      if ((tankName || tankSize) === "") {
        console.log('No name or size given, unable to save');
        return;
      }

      const docRef = await addDoc(collection(firestore, uid, selectTypeToAdd, typeOfFuel), {
        type: selectTypeToAdd,
        fuel: typeOfFuel,
        size: parseInt(tankSize),
        name: tankName,
        fuelLevel: 0,
        id: '',
        logId: ''
      });

      const docRefLogs = await addDoc(collection(firestore, uid, 'log', docRef.id), {
        name: tankName,
        logs: [],
        created: new Date(),
        owner: docRef.id
      });

      await updateDoc(docRef, {
        id: docRef.id,
        logId: docRefLogs.id,
      });
    }
    else if (selectTypeToAdd === 'vessel') {
      if (vesselName === '') {
        console.log('No name given, unable to save');
        return;
      }

      const docRef = await addDoc(collection(firestore, uid, selectTypeToAdd, 'ship'), {
        type: selectTypeToAdd,
        name: vesselName,
        id: ''
      });

      await updateDoc(docRef, {
        id: docRef.id
      })

      await addDoc(collection(firestore, uid, 'log', docRef.id), {
        name: vesselName,
        logs: [],
        created: new Date()
      })
    }
    navigateBack();
  }

  return (
    <View style={styles.container}>
      <HeaderComponent functionToTrigger={navigateBack} headerTitle={"Lägg till"} />
      <ScrollView>
        <View style={styles.contentContainer}>
          <View>

            <View style={styles.pickerView}>
              <Text style={[styles.text, styles.textBold]}>Vad vill du lägga till?</Text>
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
                  <Text style={[styles.text, styles.textBold]}>Typ av bränsle i tanken?</Text>
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
                  <Text style={[styles.text, styles.textBold]}>Storlek på tank (anges i liter)</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType='number-pad'
                    value={tankSize}
                    onChangeText={setTankSize}
                  />
                </View>

                <View style={styles.pickerView}>
                  <Text style={[styles.text, styles.textBold]}>Namn på tanken</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType='default'
                    value={tankName}
                    onChangeText={setTankName}
                  />
                </View>
              </View>
            ) : (
              <View>
                <View style={styles.pickerView}>
                  <Text style={[styles.text, styles.textBold]}>Fartygets namn</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType='default'
                    value={vesselName}
                    onChangeText={setVesselName}
                  />
                </View>
              </View>
            )}
          </View>

          <Pressable style={styles.saveButton} onPress={() => saveToFirebase()}>
            <Text style={[styles.text, styles.textBold, styles.saveButtonText]}>Spara</Text>
          </Pressable>

        </View>
      </ScrollView>
    </View>
  )
}

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    flexDirection: 'column',
    backgroundColor: appColors.mediumBlue,
  },
  contentContainer: {
    height: screenHeigt - 200,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerView: {

    marginBottom: 10
  },
  pickerInput: {
    height: 52,
    width: 250,
    marginTop: 10,
    backgroundColor: appColors.mistBlue
  },
  textInput: {
    height: 52,
    width: 250,
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 5,
    marginTop: 10,
    backgroundColor: 'white'
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 15,
    color: appColors.white
  },
  textBold: {
    fontWeight: 'bold',
  },
  saveButton: {
    height: 52,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 25,
    backgroundColor: appColors.lightBlue
  },
  saveButtonText: {
    textTransform: 'uppercase'
  }
})