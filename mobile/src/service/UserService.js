import React, {Component}  from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import RNFetchBlob from 'rn-fetch-blob'


class UserService {
    getUser=async ()=>{
        let user=await AsyncStorage.getItem('currentUser');
        return JSON.parse(user !== null ? user:'{}').user;
    }

    getCurrentUserInfo=async ()=>{
        const item=await AsyncStorage.getItem('url')
        const username=await AsyncStorage.getItem('username')
        let user=await this.getUser();
        let id=user.uid;
        // console.log(id)
        let url=`https://${item}/identity/getUserInfo?`+id.toString();
        const response= await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        const json=await response.json();
        let resultUser;
        json.data.map((user)=>{
            if (user.username===username){
                // console.log(user.username)
                resultUser=user;
            }
        })
        // console.log('user',resultUser.roles[0].permissionList);
        return resultUser;
    }
}
const userService=new UserService();
export default userService;



