import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import HeaderComponent from "../Components/HeaderComponent";
import { Context } from "../context/Context";
import { SettingsScreens } from "../helpers/types";

//@ts-ignore
import { getFirestore, getDocs, collection, doc, deleteDoc } from "firebase/firestore";

interface IRemoveScreen extends NativeStackScreenProps<SettingsScreens, 'RemoveScreen'> { }

const RemoveScreen: React.FC<IRemoveScreen> = (props) => {
  const [availableVessels, setAvailableVessels] = useState<any>([]);
  const [vesselList, setVesselList] = useState(<View />);

  const context = useContext(Context);
  const firestore = getFirestore();

  const navigateBack = () => {
    props.navigation.goBack();
  }

  const updateAvailableVessels = (id: string) => {
    const array = availableVessels;
    const filtered = array.filter(function (el: any) {
      return el.id != id;
    })

    setAvailableVessels(filtered);
  }

  const removeItem = async (id: string) => {
    const uid = context?.authedUserUid;
    await deleteDoc(doc(firestore, uid, 'vessel', 'ship', id))
    updateAvailableVessels(id);
  }

  const buildVessels = () => {
    const data = availableVessels;

    if (data !== []) {
      setVesselList(data.map((item: any, index: number) => {
        return (
          <View style={styles.listItemView} key={index}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Pressable onPress={() => removeItem(item.id)}>
              <Text>Radera</Text>
            </Pressable>
          </View>
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
      if (!availableVessels.some(currentVessels => currentVessels.id === data.id)) {
        //@ts-ignore
        setAvailableVessels(vessel => [...vessel, data]);
      }
    })
  }

  useEffect(() => {
    buildVessels();
  }, [availableVessels]);

  useEffect(() => {
    loadVessels()
  }, [])

  return (
    <View style={styles.container}>
      <HeaderComponent functionToTrigger={navigateBack} headerTitle={"Ta bort"} />
      <View style={styles.contentView}>

        <View style={styles.vesselView}>
          <Text style={styles.headlineText}>Fartyg</Text>
          {vesselList}
        </View>

      </View>
    </View>
  )
}

export default RemoveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentView: {
    width: '100%',
    alignItems: 'center',
    marginTop: 25
  },
  vesselView: {
    width: '100%',
    alignItems: 'center'
  },
  listItemView: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
    marginBottom: 10,
    backgroundColor: 'hotpink'
  },
  headlineText: {
    fontSize: 24,
    marginBottom: 10
  },
  itemText: {
    fontSize: 18
  }
})