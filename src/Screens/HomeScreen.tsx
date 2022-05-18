import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Context } from "../context/Context";
//@ts-ignore
import { getFirestore, doc, getDocs, collection, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";



const HomeScreen = () => {
  const [content, setContent] = useState(<View />)
  const [dieselTanks, setDieselTanks] = useState<any>([]);
  const [petrolTanks, setPetrolTanks] = useState<any>([]);
  const [itemToAdd, setItemToAdd] = useState<any>();

  const context = useContext(Context);

  const firestore = getFirestore();
  const auth = getAuth();

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
    const querySnapshot = await getDocs(collection(firestore, context?.authedUserUid, 'tank', 'bensin'));

    querySnapshot.forEach((doc: any) => {
      let data = doc.data();

      //@ts-ignore
      if (!petrolTanks.some(currentTanks => currentTanks.name === data.name)) {
        //@ts-ignore
        setPetrolTanks(petrolTanks => [...petrolTanks, data]);
      }

    })

  }

  useEffect(() => {
    console.log('petrolTanks: ', petrolTanks.length);
  }, [petrolTanks]);

  useEffect(() => {
    if (context?.authedUserUid !== '') {
      loadContent();
    }
  }, [context?.authedUserUid]);

  useEffect(() => {
    loadUser();
  }, []);


  return (
    <View>
      <Text>Hello from HomeScreen!</Text>

      {content}
    </View>
  )
}

export default HomeScreen;