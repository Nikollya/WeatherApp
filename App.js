import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, SafeAreaView, Platform, NativeModules, ScrollView, ImageBackground} from 'react-native';
import {useEffect, useState} from "react";

const { StatusBarManager } = NativeModules;
StatusBarManager.HEIGHT = undefined;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBarManager.HEIGHT;

export default function App() {
  const [items,setItem] = useState(undefined);

  const getAPIdata = async () => {
    const URL = "https://api.weatherapi.com/v1/forecast.json?key=8bf404ac299c4fb788c91606241102&q=Lodz&days=5&aqi=no&alerts=no";

    await fetch(URL)
        .then(res => res.json())
        .then(res => {
          setItem(res);
        }).catch((err) => {
          console.log(err);
          alert("Error 404");
        }
        );
  }
  useEffect(() => {
    getAPIdata();
  }, []);
  const image = {uri: 'https://i.pinimg.com/originals/92/3e/15/923e1539f24e56ef7f1b7ee281ef8490.jpg'}
  return (
    <ImageBackground source={image} resizeMode={"cover"} style={{flex: 1,
            justifyContent: 'center'}}>
        <SafeAreaView style={styles.container}>
            <TopView data={items}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <DayTempView data={items}/>
                <DaysTempView data={items}/>
                <View style={styles.HS_flex}>
                    <HumidityView  data={items}/>
                    <SunView data={items}/>
                </View>
            </ScrollView>
            <StatusBar theme="auto"/>
        </SafeAreaView>
    </ImageBackground>
  );
}

const TopView = ((props) => {
  return (
      <View>
        { props.data ?
            <View style={styles.top_view}>
              <Text style={styles.top_title}>My location</Text>
              <Text style={styles.top_subtitle}>Łódź</Text>

              <View style={styles.top_temperature_flex}>
                <Text style={styles.top_temperature}>{Math.round(props.data["current"]["temp_c"])}</Text>
                <Text style={styles.top_temperature_C}>°C</Text>
              </View>

              <Text style={styles.top_precipitation}>{props.data["forecast"]["forecastday"][0]["day"]["condition"]["text"]}</Text>
              <Text style={styles.top_temperature_HL}>H: {Math.round(props.data["forecast"]["forecastday"][0]["day"]["maxtemp_c"])}° L: {Math.round(props.data["forecast"]["forecastday"][0]["day"]["mintemp_c"])}°</Text>
            </View>
            :
            <Text>Loading...</Text>
        }
      </View>

  );
});

const DayTempView = ((props) => {

    return (
        <View style={styles.day_view}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                { props.data ?
                    props.data["forecast"]["forecastday"][0]["hour"].map((obj, index) => (
                        <View key={index}>
                            <Text style={styles.day_text}>{props.data["forecast"]["forecastday"][0]["hour"][index]["time"].slice(11,13)} </Text>
                            <Text style={styles.day_text}>{Math.round(props.data["forecast"]["forecastday"][0]["hour"][index]["temp_c"])}°</Text>
                        </View>
                    ))
                    : null
                }
            </ScrollView>
        </View>
    )

})

const DaysTempView = ((props) => {
    return (
        <View style={styles.days_view}>
            <Text style={styles.days_title}>5 day forecast</Text>
            <Text></Text>
            <ScrollView>
                { props.data ?
                    props.data["forecast"]["forecastday"].map((obj, index) => (
                        <View key={index} style={styles.days_flex}>
                            <View style={styles.days_flex_view}>
                                <Text style={styles.days_text}>{props.data["forecast"]["forecastday"][index]["date"].slice(5,10)}</Text>
                                <Text style={styles.days_text}>Avg: {Math.round(props.data["forecast"]["forecastday"][index]["day"]["avgtemp_c"])}°</Text>
                            </View>
                            <View style={styles.days_flex_view}>
                                <Text style={styles.days_text}>L: {Math.round(props.data["forecast"]["forecastday"][index]["day"]["mintemp_c"])}°</Text>
                            </View>
                            <View style={styles.days_flex_view}>
                                <Text style={styles.days_text}>H: {Math.round(props.data["forecast"]["forecastday"][index]["day"]["maxtemp_c"])}°</Text>
                            </View>
                        </View>
                    ))
                    : null
                }
            </ScrollView>
        </View>
    )
})

const HumidityView = ((props) => {
    return (
        <View style={styles.humidity_view}>
            { props.data ?
                <View>
                    <Text style={styles.humidity_title}>Avg humidity: </Text>
                    <Text style={styles.humidity_text}>{props.data["forecast"]["forecastday"][0]["day"]["avghumidity"]}%</Text>
                </View>
                : null
            }
        </View>
    )

})

const SunView = ((props) => {
    return (
        <View style={styles.sun_view}>
            { props.data ?
                <View>
                    <Text style={styles.sun_title}>Sunrise:</Text>
                    <Text style={styles.sun_text}>{props.data["forecast"]["forecastday"][0]["astro"]["sunrise"]}</Text>
                    <Text style={styles.sun_title}>Sunset:</Text>
                    <Text style={styles.sun_text}>{props.data["forecast"]["forecastday"][0]["astro"]["sunset"]}</Text>
                </View> : null
            }
        </View>
    )
})

const styles= StyleSheet.create({
  container: {

    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  top_view: {
    marginTop: 45,
    alignItems: 'center',
  },
  top_title: {
    height: 45,
    fontSize: 36,
    lineHeight: 36,
  },
  top_subtitle: {
    marginBottom: 10,
    height: 18,
    fontSize: 18,
    lineHeight: 18,
  },
  top_temperature_flex: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  top_temperature: {
    height: 94,
    fontSize: 94,
    lineHeight: 94,
  },
  top_temperature_C: {
    height: 28,
    fontSize: 28,
    lineHeight: 28,
  },
  top_precipitation: {
    height: 20,
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 2,
    marginBottom: 5,
  },
  top_temperature_HL: {
    height: 20,
    fontSize: 20,
    lineHeight: 20,
  },
  day_view: {
      marginTop: 10,
      backgroundColor: 'rgba(43, 69, 112, 0.8)',
      padding: 20,
      borderRadius: 10,
  },
  day_text: {
      color: '#ffffff',
        fontSize: 24,
        marginRight: 20,
    },
  days_view: {
        marginTop: 10,
      backgroundColor: 'rgba(43, 69, 112, 0.8)',
        padding: 20,
        paddingBottom: -25,
        borderRadius: 10,
    },
  days_title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
  days_flex: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
  'days_flex:last_child': {
      marginBottom: -20,
    },
  days_flex_view: {

    },
  days_text: {
        fontSize: 16,
      color: '#ffffff',
        marginBottom: 5,
    },
  humidity_view: {
      flex: 1,
    marginRight: 5,
    marginTop: 10,
      backgroundColor: 'rgba(43, 69, 112, 0.8)',
      padding: 20,
    borderRadius: 10,
    },
  humidity_title: {
    color: '#ffffff',
    fontSize: 24,
    },
  humidity_text: {
    color: '#ffffff',
    fontSize: 54,
  },
  sun_view: {
      flex: 1,
      marginLeft: 5,
    marginTop: 10,
      backgroundColor: 'rgba(43, 69, 112, 0.8)',
      padding: 20,
    borderRadius: 10,
    },
  sun_title: {
      color: '#ffffff',
      fontSize: 24,
  },
  sun_text: {
    color: '#ffffff',
    },
  HS_flex: {


    flexDirection: 'row',

    },
});
