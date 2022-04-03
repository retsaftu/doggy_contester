import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import AuthForm from "./AuthForm";
import StartSettings from "./StartSettings";

const Stack=createStackNavigator();

//Компонент для объединения двух страниц, чтобы между ними была навигация(переходить с одной на другую)
export default function StartStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name='AuthForm'
                component={AuthForm}
                options={{headerShown: false}}
            />
            <Stack.Screen
                name='StartSettings'
                component={StartSettings}
                options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}
