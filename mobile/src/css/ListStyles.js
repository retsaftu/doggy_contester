import React from "react";
import {StyleSheet} from "react-native";

export default StyleSheet.create({
    body:{
        backgroundColor:'#fff',
        flex:1
    },
    listWrapper:{
        flexDirection:'row',
        flexWrap:'wrap',
        borderBottomWidth:1,
        width:'100%',
        position:'relative',
        // height:'5%',
        alignItems:'center',
    },
    firstRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        height:'100%',
        textAlign:'center',
        lineHeight:45,
        color:'black'
    },
    secondRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'65%',
        textAlign:'center',
        flexShrink: 1,
        color:'black'
    },
    thirdRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'24%',
        textAlign:'center',
        color:'black'
    },
    firstHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        height:'100%',
        textAlign:'center',
        lineHeight:45,
        color:'black'
    },
    secondHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        // lineHeight:40,
        maxWidth:'65%',
        textAlign:'center',
        color:'black'
    },
    thirdHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'24%',
        textAlign:'center',
        color:'black'
    }
})

