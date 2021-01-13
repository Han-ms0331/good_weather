import React from "react";
import { StyleSheet, Text, View, TextInput, FlatList} from 'react-native';

export default function Input ({value, changeText, addList}) {
    return(
        <TextInput
                    value={value}
                    style={styles.input}
                    placeholder={"오늘은 무엇을 해야하나요?"}
                    placeholderTextColor={'#cdd0cb'}
                    maxLength={30}
                    onChangeText={changeText}
                    onEndEditing={addList}
                    returnKeyType={'done'}
                    color={'white'}
                    fontSize={20}
                    
                />
    );
}


const styles = StyleSheet.create({
    input:{
        borderBottomWidth: 2,
        borderColor:'white',
        marginBottom: 20
    }
  });