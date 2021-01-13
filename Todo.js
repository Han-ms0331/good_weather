import React from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from "@expo/vector-icons";


export default function Todo ({text ,isComplete, changeComplete, deleteItem}) {
    return(
        <View style={styles.list_container}>
                <TouchableOpacity
                    onPress={changeComplete}>
                    <Feather name="check-square" size={20}/>
                </TouchableOpacity>
                    <Text style={isComplete?
                        {
                            fontSize: 20,
                            marginBottom: 10,
                            marginLeft: 10,
                            marginRight: 10,
                            color: 'gray'}
                        : {
                            fontSize: 20,
                            marginBottom: 10,
                            marginLeft: 10,
                            marginRight: 10,
                            color:'white'}}>
                        {text}
                    </Text>
                <TouchableOpacity
                    onPress={deleteItem}>
                    <Feather name="trash" size={20}/>
                </TouchableOpacity>
            </View>
    );
}



const styles = StyleSheet.create({
    list_container:{
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
  });