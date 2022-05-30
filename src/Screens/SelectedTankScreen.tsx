import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import HeaderComponent from "../Components/HeaderComponent";
import { Context } from "../context/Context";
import { HomeScreens } from "../helpers/types";

//@ts-ignore
import { getFirestore, getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import appColors from "../../assets/Styles/appColors";
import { app } from "firebase-admin";

interface ISelectedTankScreen extends NativeStackScreenProps<HomeScreens, 'SelectedTankScreen'> { }

const SelectedTankScreen: React.FC<ISelectedTankScreen> = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [refuelVesselView, setRefuelVesselView] = useState<boolean>(false);
  const [refuelAmount, setRefuelAmount] = useState<string>('');
  const [fuelingAmount, setFuelingAmount] = useState<string>('');

  const [selectedVessel, setSelectedVessel] = useState<string>('');
  const [availableVessels, setAvailableVessels] = useState<any>([]);
  const [vesselItems, setVesselItems] = useState<any>(<Picker.Item label="loading..." value="" />)

  const context = useContext(Context);
  const firestore = getFirestore();

  const tank = context?.selectedTank;

  const navBack = () => {
    props.navigation.goBack();
  }

  const bunkerVessel = () => {
    setRefuelVesselView(true);
    setShowModal(true);
  }

  const bunkerTank = () => {
    setRefuelVesselView(false);
    setShowModal(true);
  }

  const cancelModal = () => {
    setShowModal(false);
    setRefuelVesselView(false);
    setRefuelAmount('0');
  }

  const updateLocalTanks = async () => {
    const uid = context?.authedUserUid;
    const petrolSnapshot = await getDocs(collection(firestore, uid, 'tank', 'bensin'));
    const dieselSnapshot = await getDocs(collection(firestore, uid, 'tank', 'diesel'));

    dieselSnapshot.forEach((doc: any) => {
      let data = doc.data();
      //@ts-ignore
      if (!context?.availableTanks.some(currentTanks => currentTanks.id === data.id)) {
        //@ts-ignore
        context?.setAvailableTanks(petrolTanks => [...petrolTanks, data]);
      }
    });

    petrolSnapshot.forEach((doc: any) => {
      let data = doc.data();
      //@ts-ignore
      if (!context?.availableTanks.some(currentTanks => currentTanks.id === data.id)) {
        //@ts-ignore
        context?.setAvailableTanks(petrolTanks => [...petrolTanks, data]);
      }
    });
    props.navigation.goBack();
  }

  const saveBunkerAndNavBack = async () => {
    if (refuelAmount === '') {
      console.log('no fuel level specified, unable to save');
      return;
    }

    const uid = context?.authedUserUid;
    const today = new Date();
    let currentLogs: any = [];
    const newFuelLevel = tank.fuelLevel + parseInt(refuelAmount);
    const docRef = doc(firestore, uid, tank.type, tank.fuel, tank.id);
    const docRefLog = doc(firestore, uid, 'log', tank.id, tank.logId);
    const logsSnapshot = await getDocs(collection(firestore, uid, 'log', tank.id));



    const logEntry = {
      date: today,
      volume: parseInt(refuelAmount),
      purpose: 'bunker',
      vessel: ''
    }

    if (logsSnapshot) {
      logsSnapshot.forEach((doc: any) => {
        let data = doc.data();
        currentLogs = data.logs;
      });

      currentLogs.push(logEntry)
    }

    await updateDoc(docRef, {
      fuelLevel: newFuelLevel
    });

    await updateDoc(docRefLog, {
      logs: currentLogs
    })

    updateLocalTanks();
    setShowModal(false);
    setRefuelVesselView(false);
    setRefuelAmount('0');
  }

  const saveFuelingAndNavBack = async () => {
    if (fuelingAmount === '') {
      console.log('No fueling amount specified, unable to save');
      return;
    }

    const uid = context?.authedUserUid;
    const today = new Date();
    let currentLogs: any = [];
    const newFuelLevel = tank.fuelLevel - parseInt(fuelingAmount);
    const docRef = doc(firestore, uid, tank.type, tank.fuel, tank.id);
    const docRefLog = doc(firestore, uid, 'log', tank.id, tank.logId);
    const logsSnapshot = await getDocs(collection(firestore, uid, 'log', tank.id));

    const logEntry = {
      date: today,
      volume: parseInt(fuelingAmount),
      purpose: 'fueling',
      vessel: selectedVessel
    }

    console.log('logEntry: ', logEntry);

    if (logsSnapshot) {
      logsSnapshot.forEach((doc: any) => {
        let data = doc.data();
        currentLogs = data.logs;
      });
      currentLogs.push(logEntry);
    }

    await updateDoc(docRef, {
      fuelLevel: newFuelLevel
    });

    await updateDoc(docRefLog, {
      logs: currentLogs
    })

    updateLocalTanks();
    setShowModal(false);
    setRefuelVesselView(false);
    setRefuelAmount('0');
  }

  const vesselPicker = () => {
    const data = availableVessels;
    if (data) {
      if (data.length > 0) {
        setSelectedVessel(data[0].name);
      }
      setVesselItems(data.map((item: any, index: number) => {
        return (
          <Picker.Item label={item.name} value={item.name} key={index} />
        )
      }))
    }
  }

  const loadVessels = async () => {
    const uid = context?.authedUserUid;
    const vesselsSnapshot = await getDocs(collection(firestore, uid, 'vessel', 'ship'));

    vesselsSnapshot.forEach((doc: any) => {
      let data = doc.data();
      //@ts-ignore
      if (!availableVessels.some(currentVessel => currentVessel.id === data.id)) {
        //@ts-ignore
        setAvailableVessels(mcBoatFace => [...mcBoatFace, data]);
      }
    })
  }

  useEffect(() => {
    vesselPicker();
  }, [availableVessels]);

  useEffect(() => {
    loadVessels();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderComponent functionToTrigger={navBack} headerTitle={tank.name} />

      {showModal ? (
        <View style={styles.modalView}>
          {refuelVesselView ? (
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderView}>
                <Text style={[styles.text, styles.headLineText]}>Tanka från {tank.name}</Text>
                <Text style={styles.text}>Volym {tank.fuelLevel} / {tank.size}</Text>
              </View>


              <Text style={[styles.text, styles.itemText]}>Bränslemängd:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType='number-pad'
                value={fuelingAmount}
                onChangeText={setFuelingAmount}
              />

              <Text style={[styles.text, styles.itemText]}>Fartyg som tankas:</Text>
              <Picker
                style={styles.vesselPicker}
                selectedValue={selectedVessel}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedVessel(itemValue)
                }>
                {vesselItems}
              </Picker>


              <View style={styles.buttonView}>
                <Pressable style={styles.actionButton} onPress={() => saveFuelingAndNavBack()}>
                  <Text style={[styles.text, styles.buttonText]}>Spara</Text>
                </Pressable>

                <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={() => cancelModal()}>
                  <Text style={[styles.text, styles.buttonText]}>Avbryt</Text>
                </Pressable>
              </View>

            </View>
          ) : (
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderView}>
                <Text style={[styles.text, styles.headLineText]}>Bunkra {tank.name}</Text>
                <Text style={styles.text}>Volym {tank.fuelLevel} / {tank.size}</Text>
              </View>


              <Text style={[styles.text, styles.itemText]}>Mängd bunker:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType='number-pad'
                value={refuelAmount}
                onChangeText={setRefuelAmount}
              />

              <View style={styles.buttonView}>
                <Pressable style={styles.actionButton} onPress={() => saveBunkerAndNavBack()}>
                  <Text style={[styles.text, styles.buttonText]}>Spara!</Text>
                </Pressable>

                <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={() => cancelModal()}>
                  <Text style={[styles.text, styles.buttonText]}>Avbryt</Text>
                </Pressable>
              </View>


            </View>
          )}
        </View>

      ) : (null)}

      <View style={styles.contentView}>
        <View style={styles.tankView}>
          <Text style={[styles.text, styles.nameText]}>{tank.name}</Text>
          <Text style={[styles.text, styles.detailsText]}>Innehåll: {tank.fuel}</Text>
          <Text style={[styles.text, styles.detailsText]}>Volym: {tank.fuelLevel} / {tank.size}</Text>
        </View>
      </View>

      <View style={styles.buttonView}>
        <Pressable style={styles.actionButton} onPress={() => bunkerVessel()}>
          <Text style={[styles.text, styles.buttonText]}>Tanka fartyg</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => bunkerTank()}>
          <Text style={[styles.text, styles.buttonText]}>Fyll på bunker</Text>
        </Pressable>
      </View>

    </View>
  )
}

export default SelectedTankScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: appColors.mediumBlue
  },
  contentView: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  tankView: {
    width: '90%',
    padding: 25,
    borderRadius: 15,
    marginTop: 20,
    backgroundColor: appColors.mistBlue,
  },
  buttonView: {
    alignItems: 'center',
    marginTop: 50
  },
  modalView: {
    position: 'absolute',
    top: 120,
    left: '5%',
    right: '5%',
    width: '90%',
    height: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: appColors.mistBlue,
    zIndex: 100
  },
  modalContent: {
    marginTop: 20
  },
  modalHeaderView: {
    alignItems: 'center',
    marginBottom: 12
  },
  textInput: {
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: appColors.white
  },
  vesselPicker: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: appColors.white
  },
  actionButton: {
    width: '50%',
    alignItems: 'center',
    padding: 15,
    marginBottom: 25,
    borderRadius: 10,
    backgroundColor: appColors.lightBlue
  },
  cancelButton: {
    backgroundColor: appColors.yellow
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 15
  },
  headLineText: {
    fontSize: 24
  },
  itemText: {
    fontSize: 18
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  detailsText: {
    fontSize: 20,
    textTransform: 'capitalize'
  },
  buttonText: {
    textTransform: 'uppercase',
  }
})