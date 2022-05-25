import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import appColors from "../../assets/Styles/appColors";
import { Context } from "../context/Context";

//@ts-ignore
import { getFirestore, getDocs, collection, updateDoc, doc } from "firebase/firestore";

const screenWidth = Dimensions.get('screen').width;


const LogScreen = () => {
  const [selectedTankId, setSelectedTankId] = useState<string>('');
  const [tankPickerItems, setTankPickerItems] = useState<any>();

  const [logsToDisplay, setLogsToDisplay] = useState(<View />);

  const context = useContext(Context);
  const firestore = getFirestore();

  const tankPicker = () => {
    const data = context?.availableTanks;
    if (data.length > 0) {
      setSelectedTankId(data[0].id);
      setTankPickerItems(data.map((item: any, index: number) => {
        return (
          <Picker.Item label={item.name} value={item.id} key={index} />
        )
      }))
    }
  }

  const fetchAndDisplayLogs = async () => {
    const uid = context?.authedUserUid;
    const logId = selectedTankId;
    const logsSnapshot = await getDocs(collection(firestore, uid, 'log', logId));

    logsSnapshot.forEach((doc: any) => {
      let data = doc.data();

      if (data.logs.length > 0) {
        setLogsToDisplay(data.logs.reverse().map((item: any, index: number) => {
          const date = new Date(item.date.seconds * 1000);
          const dateString = date.toLocaleString('sv-SE');

          if (item.purpose === 'fueling') {
            item.purpose = 'Tankning'
          } else {
            item.purpose = 'Bunkering'
          }

          if (index % 2) {
            return (
              <View style={styles.logEntryEven} key={index}>
                <Text style={[styles.logText, styles.logTextEven]}>Datum: {dateString}</Text>
                <Text style={[styles.logText, styles.logTextEven]}>Aktivitet: {item.purpose}</Text>
                <Text style={[styles.logText, styles.logTextEven]}>Volym: {item.volume} liter</Text>
                {item.vessel ? (
                  <Text style={[styles.logText, styles.logTextEven]}>Fordon: {item.vessel}</Text>
                ) : (null)}
              </View>
            )
          }

          else {
            return (
              <View style={styles.logEntryOdd} key={index}>
                <Text style={[styles.logText, styles.logTextOdd]}>Datum: {dateString}</Text>
                <Text style={[styles.logText, styles.logTextOdd]}>Aktivitet: {item.purpose}</Text>
                <Text style={[styles.logText, styles.logTextOdd]}>Volym: {item.volume} liter</Text>
                {item.vessel ? (
                  <Text style={[styles.logText, styles.logTextOdd]}>Fordon: {item.vessel}</Text>
                ) : (null)}
              </View>
            )
          }

        }))
      } else {
        setLogsToDisplay(
          <View style={styles.logEntry}>
            <Text>Inga loggar att visa</Text>
          </View>
        )
      }
    })
  }

  useEffect(() => {
    if (selectedTankId !== '') {
      fetchAndDisplayLogs();
    }
  }, [selectedTankId]);

  useEffect(() => {
    if (context?.availableTanks.length > 0) {
      console.log('tanks available changed!');
      tankPicker();
    }
  }, [context?.availableTanks]);

  return (
    <View style={styles.container}>
      <View style={styles.contentView}>

        <View style={styles.pickerView}>
          <Picker
            style={styles.tankPicker}
            selectedValue={selectedTankId}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedTankId(itemValue)
            }>
            {tankPickerItems}
          </Picker>
        </View>

        <View style={styles.logViewFancyTop} />
        <ScrollView style={styles.logView}>
          {logsToDisplay}
        </ScrollView>
        <View style={styles.logViewFancyBottom} />

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
    backgroundColor: appColors.mistBlue
  },
  logViewFancyTop: {
    height: 10,
    width: screenWidth - 50 * 0.9,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: appColors.mistBlue
  },
  logViewFancyBottom: {
    height: 10,
    width: screenWidth - 50 * 0.9,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: appColors.mistBlue
  },
  tankPicker: {
    backgroundColor: appColors.white
  },
  logEntry: {
    marginBottom: 2,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
  },
  logEntryEven: {
    marginBottom: 2,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: appColors.darkBlue
  },
  logEntryOdd: {
    marginBottom: 2,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: appColors.lightBlue
  },
  generalText: {
    fontFamily: 'Roboto',
    fontSize: 15,
    color: appColors.white
  },
  logText: {
    fontFamily: 'Roboto',
    fontSize: 18,
    marginBottom: 5
  },
  logTextEven: {
    color: appColors.white
  },
  logTextOdd: {
    color: appColors.darkBlue
  }
});