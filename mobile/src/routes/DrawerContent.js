import React, {useEffect, useState} from "react";
import {View, StyleSheet, Text} from "react-native";
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import { Drawer } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
const pkg = require('../../package.json');
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import userService from "../service/UserService";

//Компонент меню которая появляется слева(если провести по экрану слева направо)
export function DrawerContent(props){
    const [isAuth, setIsAuth]= useState(false);
    const [username, setUsername]= useState('');


    const getData=async ()=>{
        const token=await AsyncStorage.getItem('token');
        const user=await AsyncStorage.getItem('username');
        if(token){
            await setIsAuth(true)
        }
        if(user){
            setUsername(user);
        }
    }

    useEffect(()=>{
        getData();
    })
    const logOut = async ()=>{
        await AsyncStorage.removeItem('token')
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
                        label={'Home'}
                        onPress={()=>{props.navigation.navigate('Home')}}
                    />
                    <DrawerItem
                        icon={({color, size})=>(
                            <Icon name='clipboard-list'
                                color={color}
                                size={size}
                            />
                        )}
                        label={'Contests'}
                        onPress={()=>{props.navigation.navigate('Contests')}}
                    />
                    <DrawerItem
                        icon={({color, size})=>(
                            <MaterialIcons name='leaderboard'
                                color={color}
                                size={size}
                            />
                        )}
                        label={'Leader Board'}
                        onPress={()=>{props.navigation.navigate('Home')}}
                    />
                </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>      
                {
                    isAuth
                    ?
                    <DrawerItem
                        icon={({color, size})=>(
                            <MaterialIcons name='account-circle'
                                color={color}
                                size={size}
                            />
                        )}
                        label={username}
                        onPress={()=>{props.navigation.navigate('Profile')}}
                    />
                    : 
                    null
                } 
                {
                    isAuth
                    ?
                    <DrawerItem
                        icon={({color, size})=>(
                            <Icon name='bell'
                                color={color}
                                size={size}
                            />
                        )}
                        label={'Notifications'}
                        onPress={()=>{props.navigation.navigate('Notifications')}}
                    /> 
                    : 
                    null
                }
                {
                    isAuth
                    ?
                    <DrawerItem
                        icon={({color, size})=>(
                            <Icon name='exit-to-app'
                                color={color}
                                size={size}
                            />
                        )}
                        label={'Sign Out'}
                        onPress={()=>{logOut()}}
                    /> 
                    : 
                    <DrawerItem
                        icon={({color, size})=>(
                            <Icon name='exit-to-app'
                                color={color}
                                size={size}
                            />
                        )}
                        label={'Sign In'}
                        onPress={()=>{logOut()}}
                    />
                }
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
        fontSize:18,
        marginLeft:'7%',
        marginVertical:'3%',
        paddingBottom:'3%',
        textAlignVertical:'center'

        // paddingTop:'4%'
    }
});