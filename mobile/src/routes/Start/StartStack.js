import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import { TextInput } from "react-native";
import AuthForm from "./AuthForm";
import StartSettings from "./StartSettings";
import Registration from "./Registration";
import AuthWithPhone from "./AuthWithPhone";

const Stack=createStackNavigator();

//Компонент для объединения двух страниц, чтобы между ними была навигация(переходить с одной на другую)
export default function StartStack(){
    return(
        // <TextInput style={{backgroundColor:'red'}}/>

        <Stack.Navigator>
            <Stack.Screen
                name='AuthForm'
                component={AuthForm}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name='AuthWithPhone'
                component={AuthWithPhone}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name='Registration'
                component={Registration}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name='StartSettings'
                component={StartSettings}
                options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}
