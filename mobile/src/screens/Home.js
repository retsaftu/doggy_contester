import React, {useEffect, useState} from "react";
import {View, StyleSheet, ScrollView, TouchableOpacity, Text} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import userService from "../service/UserService";
//Компонент главной страницы
//Имеет кнопки для перехода к основным страницам которые были записаны в файле Navigator
export default ({navigation}) => {
    const arr=[];
    const [array,setArray]=useState([]);
    const getData=async ()=>{
        await AsyncStorage.getItem('language')
            .then(language => {
                if (language){
                    i18n.locale = language;
                }else {
                    i18n.locale = 'ru';
                }
            });
        let currentUser=await userService.getCurrentUserInfo();
        let permissionList=currentUser.roles[0].permissionList;
        permissionList.map((list)=>{
            if (list.menuId){
                arr.push(list.menuId);
            }
        })
        setArray(arr);
    }

    useEffect( ()=>{
        getData();
    })
    return (
        <ScrollView style={styles.back}>
            {array.includes("pressure_main")
            ?
                <View style={styles.components}>
                    <Text style={styles.headerText}>{i18n.t('Pressure')}</Text>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('PressureTab')}}
                                      style={styles.touch}>
                        <Icon name='desktop-mac' style={styles.icon}/>
                        <Text style={{color:'black'}}>{i18n.t('Records')}</Text>
                    </TouchableOpacity>
                </View>
            :
                null
            }
            {array.includes("flowmeter_main")
                ?
                <View style={styles.components}>
                    <Text style={styles.headerText}>{i18n.t('FlowMeter')}</Text>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('FlowMeterTab')}}
                                      style={styles.touch}>
                        <Icon name='desktop-mac' style={styles.icon}/>
                        <Text style={{color:'black'}}>{i18n.t('Records')}</Text>
                    </TouchableOpacity>
                </View>
                :
                null
            }
            {array.includes("service_main")
                ?
                <View style={styles.components}>
                    <Text style={styles.headerText}>{i18n.t('Service')}</Text>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('Service')}}
                                      style={styles.touch}>
                        <Icon name='file-document-edit-outline' style={styles.icon}/>
                        <Text style={{color:'black'}}>{i18n.t('Records')}</Text>
                    </TouchableOpacity>
                </View>
                :
                null
            }
            {array.includes("kns_room_main")
                ?
                <View style={styles.components}>
                    <Text style={styles.headerText}>{i18n.t('Kns')}</Text>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('KnsStack')}}
                                      style={styles.touch}>
                        <Icon name='desktop-mac' style={styles.icon}/>
                        <Text style={{color:'black'}}>{i18n.t('Records')}</Text>
                    </TouchableOpacity>
                </View>
                :
                null
            }
            {array.includes("passport-list")
                ?
                <View style={styles.components}>
                    <Text style={styles.headerText}>{i18n.t('Passports')}</Text>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate('Passports')}}
                                      style={styles.touch}>
                        <Icon name='file-document-edit-outline' style={styles.icon}/>
                        <Text style={{color:'black'}}>{i18n.t('Information')}</Text>
                    </TouchableOpacity>
                </View>
                :
                null
            }
            <View style={styles.components}>
                <Text style={styles.headerText}>Zander</Text>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate('Zander Stack')}}
                                  style={styles.touch}>
                    <Icon name='file-document-edit-outline' style={styles.icon}/>
                    <Text style={{color:'black'}}>{i18n.t('Records')}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    components:{
        display:'flex',
        // flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'center',
        marginBottom:15,
        paddingBottom:20,
        borderBottomWidth:0.4,
    },
    icon:{
        flexDirection: 'column',
        justifyContent:'center',
        fontSize:20,
        color:'black'
    },
    back:{
        backgroundColor:'white',
        paddingTop:15
    },
    touch:{
        display:'flex',
        justifyContent:'space-around',
        alignItems:'center'
    },
    headerText:{
        marginBottom: 20,
        color:'black'
    }
});