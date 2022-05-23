import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Context } from "../context/Context";
//@ts-ignore
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeScreens } from "../helpers/types";
import appColors from "../../assets/Styles/appColors";

interface IHomeOverviewScreen extends NativeStackScreenProps<HomeScreens, 'HomeOverviewScreen'> { }

const HomeOverviewScreen: React.FC<IHomeOverviewScreen> = (props) => {
  const [content, setContent] = useState(<View />)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const context = useContext(Context);
  const isFocused = useIsFocused();
  const firestore = getFirestore();

  const navigateToTank = (tankInfo: any) => {
    context?.setAvailableTanks([]);
    context?.setSelectedTank(tankInfo);

    props.navigation.navigate('SelectedTankScreen');
  }

  const buildContent = () => {
    const data = context?.availableTanks;

    if (data) {
      setContent(data.map((item: any, index: number) => {
        return (
          <Pressable style={styles.tankContainer} onPress={() => navigateToTank(item)} key={index}>
            <Text style={styles.tankNameText}>{item.name}</Text>
            <Text style={styles.tankText}>Innehåll: {item.fuel}</Text>
            <Text style={styles.tankText}>Nivå: {item.fuelLevel} / {item.size}</Text>
          </Pressable>
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
  }

  useEffect(() => {
    if (!isLoading) {
      if (isFocused) {
        if (context?.availableTanks !== []) {
          buildContent();
          loadContent();
        }
      }
    }
  }, [isFocused]);

  useEffect(() => {

    if (context?.availableTanks) {
      buildContent();
    }
  }, [context?.availableTanks]);

  useEffect(() => {
    if (context?.authedUserUid !== '') {
      setIsLoading(false);
      loadContent();
    }
  }, [context?.authedUserUid]);

  useEffect(() => {
    loadUser();
  }, []);


  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headlineText}>Välj bunker</Text>
        {content}
      </View>
    </ScrollView>
  )
}

export default HomeOverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: appColors.mediumBlue
  },
  contentContainer: {
    marginTop: 30,
    alignItems: 'center'
  },
  tankContainer: {
    width: '90%',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 33,
    paddingRight: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: appColors.mistBlue
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
  headlineText: {
    fontFamily: 'Roboto',
    fontSize: 20,
    color: appColors.yellow,
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginBottom: 12
  },
  tankNameText: {
    fontSize: 17,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    marginBottom: 8
  },
  tankText: {
    fontSize: 16
  }
})