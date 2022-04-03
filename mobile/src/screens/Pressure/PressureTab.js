import React, {Component, useEffect} from "react";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import Pressure from "./Pressure";
import PressureKJ from "./PressureKJ";
import PressureKJZ from "./PressureKJZ";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import userService from "../../service/UserService";
import Loading from "../Loading";
import NoData from "../NoData";

const Tab= createMaterialTopTabNavigator();

//Компонент который создает tab-ы из страниц которые прописаны ниже
export default class PressureTab extends Component{
    constructor(props) {
        super(props);
        this.state = {
            arr:[],
            array:["Loading"]
        }
    }
    getData=async ()=>{
        try {
            await AsyncStorage.getItem('language')
                .then(language => {
                    if (language) {
                        i18n.locale = language;
                    } else {
                        i18n.locale = 'ru';
                    }
                });
            let currentUser=await userService.getCurrentUserInfo();
            let permissionList=currentUser.roles[0].permissionList;
            permissionList.map((list) => {
                if (list.menuId === 'pressure_main') {
                    list.child.map((child) => {
                        // console.log(child)
                        this.state.arr.push(child.id);
                    })
                }
            })

            if (this.state.arr.length>0) {
                this.setState({array: this.state.arr});
            }else{
                this.setState({array: 'No data'});
            }

        }catch (e){
            console.log(e)
        }
    }

    async componentDidMount() {
        await this.getData();
    }
    render() {
        if (!this.state.array.includes("No data") && !this.state.array.includes("Loading")) {
            return (
                <Tab.Navigator
                    initialRouteName='Pressure'
                    screenOptions={{
                        "tabBarLabelStyle": {
                            "fontSize": 12
                        },
                        "tabBarStyle": {
                            "backgroundColor": "white"
                        }
                    }}
                >
                    {this.state.array.includes("pressure_value")
                        ?
                        <Tab.Screen
                            name='Pressure'
                            component={Pressure}
                            options={{
                                tabBarLabel: i18n.t('All')
                            }}
                        />
                        :
                        null
                    }
                    {this.state.array.includes("pressure_value_ry")
                        ?
                        <Tab.Screen
                            name='PressureKJ'
                            component={PressureKJ}
                            options={{tabBarLabel: i18n.t('PressureKJ')}}
                        />
                        :
                        null
                    }
                    {this.state.array.includes("pressure_value_ryg")
                        ?
                        <Tab.Screen
                            name='PressureKJZ'
                            component={PressureKJZ}
                            options={{tabBarLabel: i18n.t('PressureKJZ')}}
                        />
                        :
                        null
                    }
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