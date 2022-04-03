import React, {useEffect, useState} from "react";
import {View, StyleSheet, Text} from "react-native";
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import { Drawer } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const pkg = require('../../package.json');

import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import userService from "../service/UserService";

//Компонент меню которая появляется слева(если провести по экрану слева направо)
export function DrawerContent(props){
    const arr=[];
    const [array,setArray]=useState([]);
    const [username,setUsername]=useState('');
    const [isLoaded,setIsLoaded]=useState(false);
    const getData=async ()=>{
        const user=await AsyncStorage.getItem('username');
        await setUsername(user);
        await setIsLoaded(true);
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
        // console.log(array)
    }

    useEffect(()=>{
        getData();
    })
    const logOut = async ()=>{
        await props.navigation.navigate('AuthForm')
    }

    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props}>
                <Drawer.Section style={styles.drawerSection}>
                    <DrawerItem
                        icon={({color, size})=>(
                            <Icon name='home-outline'
                                color={color}
                                size={size}
                            />
                        )}
                        label={i18n.t('Agis')}
                        onPress={()=>{props.navigation.navigate('Home')}}
                    />
                    {array.includes("pressure_main")
                        ?
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon name='filter'
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={i18n.t('Pressure')}
                            onPress={()=>{props.navigation.navigate('PressureTab')}}
                        />
                        :null
                    }
                    {array.includes("flowmeter_main")
                        ?
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon name='approximately-equal-box'
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={i18n.t('FlowMeter')}
                            onPress={()=>{props.navigation.navigate('FlowMeterTab')}}
                        />
                        :null
                    }
                    {array.includes("service_main")
                        ?
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon name='passport-biometric'
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={i18n.t('Service')}
                            onPress={()=>{props.navigation.navigate('Service')}}
                        />
                        :null
                    }
                    {array.includes("kns_room_main")
                        ?
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon name='folder-settings'
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={i18n.t('Kns')}
                            onPress={()=>{props.navigation.navigate('KnsStack')}}
                        />
                        :null
                    }
                    {array.includes("passport-list")
                        ?
                        <DrawerItem
                            icon={({color, size})=>(
                                <Icon name='apps-box'
                                    color={color}
                                    size={size}
                                />
                            )}
                            label={i18n.t('Passports')}
                            onPress={()=>{props.navigation.navigate('Passports')}}
                        />
                        :null
                    }
                    <DrawerItem
                        icon={({color, size})=>(
                            <Icon name='receipt'
                                color={color}
                                size={size}
                            />
                        )}
                        label='Zander'
                        onPress={()=>{props.navigation.navigate('Zander Stack')}}
                    />
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                {
                    isLoaded
                    ?
                    <View style={styles.textWrap}>
                        <Text style={styles.text}>{username}</Text>
                    </View>
                    :
                    null
                }
                <View style={styles.textWrap}>
                    <Text style={styles.text}>Версия {pkg.version}</Text>
                </View>
                <DrawerItem
                    icon={({color, size})=>(
                        <Icon name='database-export'
                            color={color}
                            size={size}
                        />
                    )}
                    label={i18n.t('Settings')}
                    onPress={()=>{props.navigation.navigate('Settings')}}
                />
                <DrawerItem
                    icon={({color, size})=>(
                        <Icon name='exit-to-app'
                            color={color}
                            size={size}
                        />
                    )}
                    label={i18n.t('SignOut')}
                    onPress={()=>{logOut()}}
                />
            </Drawer.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    drawerSection: {
        marginTop: '2%',
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    textWrap:{
        // borderTopWidth:0.5,
        // borderBottomWidth:0.5,
        textAlignVertical:'center'
    },
    text:{
        color:"#505050",
        fontSize:16,
        marginLeft:'7%',
        marginVertical:'3%',
        paddingBottom:'3%',
        textAlignVertical:'center'

        // paddingTop:'4%'
    }
});