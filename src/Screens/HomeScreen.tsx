import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Context } from "../context/Context";
//@ts-ignore
import { getFirestore, getDocs, collection } from "firebase/firestore";



const HomeScreen = () => {
  const [content, setContent] = useState(<View />)
  // const [tanks, setTanks] = useState<any>([]);

  const context = useContext(Context);

  const firestore = getFirestore();

  const buildContent = () => {
    const data = context?.availableTanks;

    if (data) {
      setContent(data.map((item: any, index: number) => {
        return (
          <View style={styles.tankContainer} key={index}>
            <Text style={styles.tankText}>{item.name}</Text>
            <Text style={styles.tankText}>Innehåll: {item.fuel}</Text>
            <Text style={styles.tankText}>Nivå: {item.fuelLevel} / {item.size}</Text>
            <View style={styles.buttonView}>
              <Pressable style={[styles.bunkerButton, styles.fuelButton]}><Text>+</Text></Pressable>
              <Pressable style={[styles.bunkerButton, styles.refillButton]}><Text>Fyll på</Text></Pressable>
            </View>
          </View>
        )
      }))
    }
  }

  const loadUser = async () => {
    try {
      const user = await AsyncStorage.getItem('@authed_User');
      const parsedUser = JSON.parse(user!);
      context?.setAuthedUserUid(parsedUser.uid);
    } catch (error) {
      console.log('There was an error while loading the user: ', error);
    }
  }

  const loadContent = async () => {
    const uid = context?.authedUserUid;
    const petrolSnapshot = await getDocs(collection(firestore, uid, 'tank', 'bensin'));
    const dieselSnapshot = await getDocs(collection(firestore, uid, 'tank', 'diesel'));

    dieselSnapshot.forEach((doc: any) => {
      let data = doc.data();

      //@ts-ignore
      if (!context?.availableTanks.some(currentTanks => currentTanks.name === data.name)) {
        //@ts-ignore
        context?.setAvailableTanks(petrolTanks => [...petrolTanks, data]);
      }

    });

    petrolSnapshot.forEach((doc: any) => {
      let data = doc.data();

      //@ts-ignore
      if (!context?.availableTanks.some(currentTanks => currentTanks.name === data.name)) {
        //@ts-ignore
        context?.setAvailableTanks(petrolTanks => [...petrolTanks, data]);
      }

    });
  }

  useEffect(() => {
    if (context?.availableTanks !== []) {
      buildContent();
    }
  }, [context?.availableTanks]);

  useEffect(() => {
    if (context?.authedUserUid !== '') {
      loadContent();
    }
  }, [context?.authedUserUid]);

  useEffect(() => {
    loadUser();
  }, []);


  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {content}
      </View>


    </ScrollView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    marginTop: 75,
    alignItems: 'center'
  },
  tankContainer: {
    width: '70%',
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10
  },
  bunkerButton: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  fuelButton: {
    backgroundColor: 'green'
  },
  refillButton: {
    backgroundColor: 'yellow'
  },
  tankText: {
    fontSize: 16
  }
})