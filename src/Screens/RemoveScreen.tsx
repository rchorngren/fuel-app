import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import HeaderComponent from "../Components/HeaderComponent";
import { Context } from "../context/Context";
import { SettingsScreens } from "../helpers/types";

//@ts-ignore
import { getFirestore, getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import appColors from "../../assets/Styles/appColors";

interface IRemoveScreen extends NativeStackScreenProps<SettingsScreens, 'RemoveScreen'> { }

const RemoveScreen: React.FC<IRemoveScreen> = (props) => {
  const [availableVessels, setAvailableVessels] = useState<any>([]);
  const [vesselList, setVesselList] = useState(<View />);

  const [availableTanks, setAvailableTanks] = useState<any>([]);
  const [tankList, setTankList] = useState(<View />);

  const context = useContext(Context);
  const firestore = getFirestore();

  const navigateBack = () => {
    props.navigation.goBack();
  }

  const updateAvailableVessels = (id: string) => {
    const array = availableVessels;
    const filtered = array.filter(function (el: any) {
      return el.id != id;
    });
    setAvailableVessels(filtered);
  }

  const updateAvailableTanks = (id: string) => {
    const array = availableTanks;
    const filtered = array.filter(function (el: any) {
      return el.id != id;
    });
    setAvailableTanks(filtered);
  }

  const removeItem = async (id: string, type: string, fuel?: string) => {
    const uid = context?.authedUserUid;
    if (type === 'vessel') {
      await deleteDoc(doc(firestore, uid, 'vessel', 'ship', id))
      updateAvailableVessels(id);
    }
    else if (type === 'tank') {
      await deleteDoc(doc(firestore, uid, 'tank', fuel, id))
      updateAvailableTanks(id);
    }

  }

  const buildVessels = () => {
    const data = availableVessels;

    if (data !== []) {
      setVesselList(data.map((item: any, index: number) => {
        return (
          <View style={styles.listItemView} key={index}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Pressable onPress={() => removeItem(item.id, item.type)}>
              <Text style={[styles.baseText, styles.deleteText]}>Radera</Text>
            </Pressable>
          </View>
        )
      }))
    }
  }

  const buildTanks = () => {
    const data = availableTanks;

    if (data !== []) {
      setTankList(data.map((item: any, index: number) => {
        return (
          <View style={styles.listItemView} key={index}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Pressable onPress={() => removeItem(item.id, item.type, item.fuel)}>
              <Text style={[styles.baseText, styles.deleteText]}>Radera</Text>
            </Pressable>
          </View>
        )
      }))
    }
  }

  const loadVessels = async () => {
    const uid = context?.authedUserUid;
    const vesselsSnapshot = await getDocs(collection(firestore, uid, 'vessel', 'ship'));
    const dieselTanksSnapshot = await getDocs(collection(firestore, uid, 'tank', 'diesel'));
    const petrolTanksSnapshot = await getDocs(collection(firestore, uid, 'tank', 'bensin'));

    vesselsSnapshot.forEach((doc: any) => {
      let data = doc.data();
      //@ts-ignore
      if (!availableVessels.some(currentVessels => currentVessels.id === data.id)) {
        //@ts-ignore
        setAvailableVessels(vessel => [...vessel, data]);
      }
    })

    dieselTanksSnapshot.forEach((doc: any) => {
      let data = doc.data();
      //@ts-ignore
      if (!availableTanks.some(currentTank => currentTank.id === data.id)) {
        //@ts-ignore
        setAvailableTanks(tank => [...tank, data]);
      }
    })

    petrolTanksSnapshot.forEach((doc: any) => {
      let data = doc.data();
      //@ts-ignore
      if (!availableTanks.some(currentTank => currentTank.id === data.id)) {
        //@ts-ignore
        setAvailableTanks(tank => [...tank, data]);
      }
    })
  }


  useEffect(() => {
    buildVessels();
  }, [availableVessels]);

  useEffect(() => {
    buildTanks();
  }, [availableTanks]);

  useEffect(() => {
    loadVessels()
  }, [])

  return (
    <View style={styles.container}>
      <HeaderComponent functionToTrigger={navigateBack} headerTitle={"Ta bort"} />
      <View style={styles.contentView}>

        <View style={styles.itemView}>
          <Text style={[styles.headlineText, styles.baseText]}>Fartyg</Text>
          {vesselList}
        </View>

        <View style={styles.itemView}>
          <Text style={[styles.headlineText, styles.baseText]}>Tankar</Text>
          {tankList}
        </View>

      </View>
    </View>
  )
}

export default RemoveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: appColors.mediumBlue
  },
  contentView: {
    width: '100%',
    alignItems: 'center',
  },
  itemView: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20
  },
  listItemView: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: appColors.lightBlue
  },
  baseText: {
    fontFamily: 'Roboto',
    color: appColors.white
  },
  headlineText: {
    fontSize: 24,
    marginBottom: 10
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  deleteText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red'
  }
})