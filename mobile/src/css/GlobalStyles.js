import React from "react";
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    container:{
        justifyContent:'center',
        flex:1,
        padding:36,
        backgroundColor:'#fff',
    },
    input:{
        borderBottomWidth: 0.3,
        shadowColor: '#000',
        shadowOffset:{
            width:0,
            height:1
        },
        textAlign:'center',
        marginVertical:'4%'
    },
    button:{
        marginHorizontal:'30%',
        backgroundColor: 'white',
        alignItems: "center",
        padding: 10,
        color: 'black',
        borderColor: '#DDDDDD',
        borderWidth:1,
        borderStyle:'solid',
    },
    image:{
        width:130,
        height:130
    },
    imagePosition:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '40%'
    }
})