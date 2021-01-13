import React from "react";
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from "prop-types";
import {Ionicons} from "@expo/vector-icons";




export default function Weather ({temp, location, weather, swipe}) {
        console.log(weather);
        return( 
            swipe?(
                <View style={styles.weather_basic}>
                    <Ionicons name={weather} size={90} color="white" />
                    <Text style={styles.text}>{temp}°</Text>
                </View>
            ):(
                <View style={styles.weather_basic}>
                    <Ionicons name={weather} size={90} color="white" />
                    <Text style={styles.text}>{temp}°</Text>
                    <Text style={styles.text}>{location}</Text>
                </View>
            )
            

        );   
}

Weather.propTypes = {
    temp: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    weather: PropTypes.oneOf([
        'ios-thunderstorm-outline',
        'rainy-outline',
        "rainy-outline",
        'snow',
        'sunny-outline',
        'cloudy-outline'
    ]).isRequired
}


const styles = StyleSheet.create({
    weather_basic: {
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        color: 'white',
        fontSize: 30
    },
  });