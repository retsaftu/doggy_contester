import React, {Component, useEffect, useState} from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import FlowMeterRate from "./FlowMeterRate";
import FlowMeterSpeed from "./FlowMeterSpeed";
import FlowMeterVPlus from "./FlowMeterVPlus";
import FlowMeterVMinus from "./FlowMeterVMinus";
import FlowMeterVSum from "./FlowMeterVSum";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import userService from "../../service/UserService";
import NoData from "../NoData";
import Loading from "../Loading";

const Tab= createMaterialTopTabNavigator();

//Компонент который создает tab-ы из страниц которые прописаны ниже
export default class FlowMeterTab extends Component{
    constructor(props) {
        super(props);
        this.state = {
            arr:[],
            array:["Loading"]
        }
    }
    getData=async ()=>{
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
            if (list.menuId==='flowmeter_main') {
                list.child.map((child) => {
                    // console.log(child)
                    this.state.arr.push(child.id);
                })
            }
        })
        console.log(this.state.arr)
        if (this.state.arr.length>0) {
            this.setState({array: this.state.arr});
        }else{
            this.setState({array: 'No data'});
        }

        console.log(this.state.array)
    }

    async componentDidMount() {
        await this.getData();
    }


    render() {

        if (!this.state.array.includes("No data") && !this.state.array.includes("Loading") && this.state.array.includes("flowmeter_svalue")) {
            return (
                <Tab.Navigator
                    initialRouteName='FlowMeter'
                    screenOptions={({route}) => ({
                        //Для каждой страницы вместо названии в tab будет иконка
                        tabBarIcon: ({focused, color}) => {
                            let iconName;

                            if (route.name === 'FlowMeterRate') {
                                iconName = 'analytics'
                            } else if (route.name === 'FlowMeterSpeed') {
                                iconName = 'speedometer-sharp'
                            } else if (route.name === 'FlowMeterVPlus') {
                                iconName = 'ios-caret-up-sharp'
                            } else if (route.name === 'FlowMeterVMinus') {
                                iconName = 'ios-caret-down-sharp'
                            } else if (route.name === 'FlowMeterVSum') {
                                iconName = 'ios-checkmark-done-sharp'
                            } else if (route.name === 'Loading') {
                                iconName = 'close-sharp'
                            } else if (route.name === 'No data') {
                                iconName = 'close-sharp'
                            }

                            return <Ionicons name={iconName} size={24} color={color}/>;
                        },

                        tabBarStyle: {
                            "backgroundColor": "white"
                        },
                        tabBarShowLabel: false
                    })}
                >
                    <Tab.Screen
                        name='FlowMeterRate'
                        component={FlowMeterRate}
                        options={{
                            tabBarLabel: i18n.t('FlowRate')
                        }}
                    />
                    <Tab.Screen
                        name='FlowMeterSpeed'
                        component={FlowMeterSpeed}
                        options={{tabBarLabel: i18n.t('FlowSpeed')}}
                    />
                    <Tab.Screen
                        name='FlowMeterVPlus'
                        component={FlowMeterVPlus}
                        options={{tabBarLabel: 'V+'}}
                    />
                    <Tab.Screen
                        name='FlowMeterVMinus'
                        component={FlowMeterVMinus}
                        options={{tabBarLabel: 'V-'}}
                    />
                    <Tab.Screen
                        name='FlowMeterVSum'
                        component={FlowMeterVSum}
                        options={{tabBarLabel: i18n.t('VSum')}}
                    />
                </Tab.Navigator>

            )
        }
        else if(this.state.array.includes("Loading")){
            return <Loading/>
        }
        else{
            return (
                <NoData/>
            )
        }
    }
}