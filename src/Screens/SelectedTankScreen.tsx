import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import HeaderComponent from "../Components/HeaderComponent";
import { Context } from "../context/Context";
import { HomeScreens } from "../helpers/types";

//@ts-ignore
import { getFirestore, getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";

interface ISelectedTankScreen extends NativeStackScreenProps<HomeScreens, 'SelectedTankScreen'> { }

const SelectedTankScreen: React.FC<ISelectedTankScreen> = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [refuelVesselView, setRefuelVesselView] = useState<boolean>(false);
  const [refuelAmount, setRefuelAmount] = useState<string>('0');
  const [fuelingAmount, setFuelingAmount] = useState<string>('0');

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
    const uid = context?.authedUserUid;
    const newFuelLevel = tank.fuelLevel + parseInt(refuelAmount);
    const docRef = doc(firestore, uid, tank.type, tank.fuel, tank.id);

    await updateDoc(docRef, {
      fuelLevel: newFuelLevel
    });

    updateLocalTanks();

    setShowModal(false);
    setRefuelVesselView(false);
    setRefuelAmount('0');
  }

  const saveFuelingAndNavBack = async () => {
    const uid = context?.authedUserUid;
    const newFuelLevel = tank.fuelLevel - parseInt(fuelingAmount);
    const docRef = doc(firestore, uid, tank.type, tank.fuel, tank.id);

    await updateDoc(docRef, {
      fuelLevel: newFuelLevel
    });

    updateLocalTanks();

    setShowModal(false);
    setRefuelVesselView(false);
    setRefuelAmount('0');
  }

  const vesselPicker = () => {
    const data = availableVessels;

    if (data) {
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

    // setTimeout(() => {
    //   vesselPicker();
    // }, 1000)
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
                <Text style={styles.text}>Bunkra från {tank.name}</Text>
              </View>

              <Text style={styles.text}>Volym {tank.fuelLevel} / {tank.size}</Text>
              <Text style={styles.text}>Bränslemängd:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType='number-pad'
                value={fuelingAmount}
                onChangeText={setFuelingAmount}
              />

              <Text style={styles.text}>Fartyg som tankas:</Text>
              <Picker
                // style={}
                selectedValue={selectedVessel}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedVessel(itemValue)
                }>
                {vesselItems}
              </Picker>


              <View style={styles.buttonView}>
                <Pressable style={styles.actionButton} onPress={() => saveFuelingAndNavBack()}>
                  <Text>Spara</Text>
                </Pressable>

                <Pressable style={styles.actionButton} onPress={() => cancelModal()}>
                  <Text>Avbryt</Text>
                </Pressable>
              </View>

            </View>
          ) : (
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderView}>
                <Text style={styles.text}>Bunkra {tank.name}</Text>
              </View>

              <Text style={styles.text}>Volym {tank.fuelLevel} / {tank.size}</Text>
              <Text style={styles.text}>Mängd bunker:</Text>
              <TextInput
                style={styles.textInput}
                keyboardType='number-pad'
                value={refuelAmount}
                onChangeText={setRefuelAmount}
              />

              <View style={styles.buttonView}>
                <Pressable style={styles.actionButton} onPress={() => saveBunkerAndNavBack()}>
                  <Text>Spara</Text>
                </Pressable>

                <Pressable style={styles.actionButton} onPress={() => cancelModal()}>
                  <Text>Avbryt</Text>
                </Pressable>
              </View>


            </View>
          )}
        </View>

      ) : (null)}

      <View style={styles.contentView}>
        <View style={styles.tankView}>
          <Text style={styles.text}>{tank.name}</Text>
          <Text style={styles.text}>Innehåll: {tank.fuel}</Text>
          <Text style={styles.text}>Volym: {tank.fuelLevel} / {tank.size}</Text>
        </View>
      </View>

      <View style={styles.buttonView}>
        <Pressable style={styles.actionButton} onPress={() => bunkerVessel()}>
          <Text style={styles.text}>Tanka fartyg</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={() => bunkerTank()}>
          <Text style={styles.text}>Fyll på bunker</Text>
        </Pressable>
      </View>

    </View>
  )
}

export default SelectedTankScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentView: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  tankView: {
    width: '70%',
    padding: 25,
    borderRadius: 15,
    marginTop: 50,
    backgroundColor: 'limegreen',
  },
  buttonView: {
    alignItems: 'center',
    marginTop: 50,
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
    backgroundColor: 'white',
    zIndex: 100
  },
  modalContent: {
    marginTop: 20
  },
  modalHeaderView: {
    alignItems: 'center',
    marginBottom: 15
  },
  textInput: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'limegreen'
  },
  actionButton: {
    width: '50%',
    alignItems: 'center',
    padding: 15,
    marginBottom: 25,
    borderRadius: 10,
    backgroundColor: 'limegreen'
  },
  text: {
    fontSize: 24
  }
})