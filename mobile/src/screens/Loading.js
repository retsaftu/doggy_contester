import React, {Component} from "react";
import {View, Text, FlatList, StyleSheet, ActivityIndicator} from "react-native";


export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles.body}>
                <Text style={{color:'black'}}>Loading...</Text>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    body:{
        backgroundColor:'#fff',
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})
