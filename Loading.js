import React from "react";
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Loading() {
    return( 
        <LinearGradient
           colors={['#8e9eab','#eef2f3']}
           style={styles.container}
         >
        <StatusBar barStyle="light-content" backgroundColor={'transparent'} translucent={true}/>
        <Text style={styles.main}>Good Day</Text>
        <Text style={styles.text}>Loading...</Text>
    </LinearGradient>);
   
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-end",
      paddingHorizontal: 30,
      paddingVertical: 100,
      justifyContent: 'center',
      alignItems: 'center'
    },
    main: {
        flex: 3,
        color: 'white',
        marginBottom: 20,
        fontSize: 50,
        textAlign: 'center',
        marginTop:50
    },
    text: {
        flex: 1,
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    }
  });