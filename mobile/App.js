import React, {Component, useEffect , useState} from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import Navigator from './src/routes/Navigator'
import {NavigationContainer} from "@react-navigation/native";
import StartStack from "./src/routes/Start/StartStack";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

const Stack=createStackNavigator()


export default function App () {
    return (

    // <Test/>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="StartStack" screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name='StartStack' component={StartStack}/>
                <Stack.Screen name='Navigator' component={Navigator}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}