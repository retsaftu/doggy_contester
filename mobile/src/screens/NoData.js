import React, {Component} from "react";
import {View, Text, FlatList, StyleSheet} from "react-native";


export default class NoData extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles.body}>
                <Text>Данных нет</Text>
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