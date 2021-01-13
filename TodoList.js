import React from "react";
import { StyleSheet, Text, View, TextInput, FlatList, AsyncStorageStatic, AsyncStorage} from 'react-native';
import Input from "./TodoInput.js";
import Todo from "./Todo.js";


export default class TodoList extends React.Component {
    state={
        inputValue: "",
        todo: [
        ]
    }
    UNSAFE_componentWillMount(){
        AsyncStorage.getItem('@todo: state').then((state) => {
            if(state !=null){
                this.setState(JSON.parse(state));
            }
        })
    }
    _saveData=() => {
        AsyncStorage.setItem('@todo: state',JSON.stringify(this.state));
    }

    _makeItem =({item, index}) => {
        return(
            <Todo 
            text={item.text} 
            isComplete={item.isComplete}
            changeComplete={() => {
                const newTodo = [...this.state.todo];
                newTodo[index].isComplete = !newTodo[index].isComplete;
                this.setState({todo:newTodo},this._saveData);
            }}
            deleteItem={() => {
                const newTodo = [...this.state.todo];
                newTodo.splice(index,1);
                this.setState({todo:newTodo},this._saveData);
            }}/>
        )
    }

    _changeText = (value) =>{
        this.setState({inputValue: value});
    }

    _addList = () => {
        const prevTodo = this.state.todo;
        const newTodo = {text: this.state.inputValue, isComplete: false};
        this.setState({
                inputValue: "",
                todo: prevTodo.concat(newTodo)
        },this._saveData);
    }

    render(){
        const {todo, inputValue} = this.state;
        return(  
             this.props.swipe?
            <View style={styles.todolist_container}>
                <Text style={styles.main_title}>To Do List</Text>
                <Input value={inputValue} changeText={this._changeText} addList={this._addList}/>
                <FlatList
                    data={todo}
                    renderItem={this._makeItem}
                    keyExtractor={(item,index) => {return `${index}`}}
                    />
            </View>
            :
            <View style={styles.todolist_container}>
                <Text style={styles.main_title}>To Do List</Text>
            </View>
        );  
    }
         
   
}


const styles = StyleSheet.create({
    main_title:{    
        color: 'white',
        fontSize: 40,
        marginBottom: 40
    },
    todolist_container:{
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    list_container:{
        flexDirection: 'row',
        justifyContent:'space-between'
    },
  });