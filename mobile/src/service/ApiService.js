import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import qs from 'qs'
import RNFetchBlob from 'rn-fetch-blob'

class ApiService {
    async getObjectsForMonitoring(type) {
        const item=await AsyncStorage.getItem('url');
        let query = qs.stringify({type});
        const url=`https://${item}/api/main/getObjectsForMonitoring?${query}`;
        let response= await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        let json=response.json();
        return json;
    }
    async getLastObjectValues201(startDate, finishDate, sysnames) {
        const item=await AsyncStorage.getItem('url')
        const query = qs.stringify({startDate, finishDate, sysnames});
        const url=`https://${item}/api/value/getLastObjectValues201?${query}`;
        let response= await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        let json=response.json();
        return json;
    }
    async getFunctionsForMonitoring(type){
        const item=await AsyncStorage.getItem('url')
        let query = qs.stringify({type});
        const url=`https://${item}/api/main/getFunctionsForMonitoring?${query}`;
        let response= await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        // console.log(response)
        let json=response.json();
        return json;
    }
    async getFacilityPassportForMonitoring(id, templateId) {
        const item=await AsyncStorage.getItem('url')
        const query = qs.stringify({
            id, templateId
        });
        const url=`https://${item}/api/main/getFacilityPassportForMonitoring?${query}`;
        let response= await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        // console.log(response)
        let json=response.json();
        return json;
    }
    async getFunctionByTemplateId() {
        const item=await AsyncStorage.getItem('url')
        const url=`https://${item}/api/main/getFunctionByTemplateId`;
        let response= await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        // console.log(response)
        let json=response.json();
        return json;
    }

}
const apiService=new ApiService();
export default apiService;



