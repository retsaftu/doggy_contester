import React from "react";
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    body:{
        backgroundColor:'#fff',
        flex:1
    },
    header:{
        fontWeight:'bold',
        fontSize:17,
        textAlign:'center',
        marginTop:'3%',
        color:'black'
    },
    input:{
        borderColor: "gray",
        width: "95%",
        borderWidth: 1,
        borderRadius: 5,
        padding: '1.5%',
        marginHorizontal:'2%',
        marginTop: '1.4%',
        color:'black',
    },
    box:{
        flex:1,
        marginVertical:'2%',
        marginHorizontal: '2.5%'
    },
    text:{
        color:'gray',
        marginBottom:'2%',
        // color:'black'
    },
    buttonWrap:{
        alignItems: 'center',
        marginVertical: '4%'
    },
    buttonText:{
        color:'white',
        fontSize: 17,
        color:'black'
    },
    changeButton:{
        paddingVertical: '3.5%',
        paddingHorizontal: '20%',
        borderRadius: 4,
        backgroundColor: '#1E90FF',
    },
    submitButton:{
        paddingVertical: '3.5%',
        paddingHorizontal: '20%',
        borderRadius: 4,
        backgroundColor: '#32CD32',
    }
})
