import React, {useEffect} from "react";
import {createDrawerNavigator} from "@react-navigation/drawer";
import Home from "../screens/Home";
import Contests from "../screens/Contests";
import LeaderBoard from "../screens/LeaderBoard";
import Profile from "../screens/Profile";
import Notifications from "../screens/Notifications";

import {DrawerContent} from "./DrawerContent";
import CreateContest from "../screens/CreateContest";


const Drawer = createDrawerNavigator();

//Компонент для объединения всех основных страниц, чтобы между ними была навигация(переходить с одной на другую)
export default () => {
    return(
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/>}>
            <Drawer.Screen
                name='Home'
                component={Home}
                options={{title:'Home'}}/>
            <Drawer.Screen
                name='Contests'
                component={Contests}
                options={{title:'Contests'}}/>
            <Drawer.Screen
                name='LeaderBoard'
                component={LeaderBoard}
                options={{title:'Leader Board'}}/>
            <Drawer.Screen
                name='Profile'
                component={Profile}
                options={{title:'Profile'}}/>
            <Drawer.Screen
                name='Notifications'
                component={Notifications}
                options={{title:'Notifications'}}/>
            <Drawer.Screen
                name='CreateContest'
                component={CreateContest}
                options={{title:'Create contest'}}/>
        </Drawer.Navigator>

    )
}