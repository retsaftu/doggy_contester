import React, {Component} from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView} from "react-native";



export default class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }

    async componentDidMount() {

    }

    getData=async ()=>{
    }


    render() {
        return(
            <View style={styles.body}>
                <Text style={{top:50,left:20, color:'black'}}>
                    Страница на стадии разработки
                </Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    body:{
        backgroundColor:'#fff',
        flex:1
    },
})
