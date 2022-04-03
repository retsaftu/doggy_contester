import React, {useEffect} from "react";
import {createStackNavigator} from "@react-navigation/stack";
import i18n from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ZanderList from "./ZanderList";
import ZanderDetails from "./ZanderDetails";

const Stack=createStackNavigator();

//Компонент который создает tab-ы из страниц которые прописаны ниже
export default function ZanderStack({navigation, route}){
    const getLanguage=async()=>{
        await AsyncStorage.getItem('language')
            .then(language => {
                if (language){
                    i18n.locale = language;
                }else {
                    i18n.locale = 'ru';
                }
            });
    }
    useEffect(()=>{
        getLanguage()
    })

    return(
        <Stack.Navigator>
            <Stack.Screen
                name='Zander List'
                component={ZanderList}
                options={{headerShown: false}}
               />
            <Stack.Screen
                name='Zander Details'
                component={ZanderDetails}
                options={({ route }) => ({ title: route.params.title })}
              />
        </Stack.Navigator>
    )
}
