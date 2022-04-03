import React, {useEffect} from "react";
import {createDrawerNavigator} from "@react-navigation/drawer";
import Home from "../screens/Home";
import PressureTab from "../screens/Pressure/PressureTab";
import FlowMeterTab from "../screens/FlowMeter/FlowMeterTab";
import Kns from "../screens/KNS/Kns";
import Service from "../screens/Service";
import {DrawerContent} from "./DrawerContent";
import Settings from "../screens/Settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import ZanderStack from "../screens/Zander/ZanderStack";
import KnsStack from "../screens/KNS/KnsStack";

const Drawer = createDrawerNavigator();

//Компонент для объединения всех основных страниц, чтобы между ними была навигация(переходить с одной на другую)
export default () => {
    const getLanguage=async ()=>{
        await AsyncStorage.getItem('language')
            .then(language => {
                if (language){
                    i18n.locale = language;
                }else {
                    i18n.locale = 'ru';
                }
            });
    }
    useEffect( ()=>{
        getLanguage()
    })
    return(
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>}>
            <Drawer.Screen
                name='Home'
                component={Home}
                options={{title:i18n.t('Home')}}/>
            <Drawer.Screen
                name='Settings'
                component={Settings}
                options={{title:i18n.t('Settings')}}/>
        </Drawer.Navigator>

    )
}