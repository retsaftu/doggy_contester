import React, {Component} from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import userService from "../../service/UserService";
import Loading from "../Loading";
import NoData from "../NoData";
import apiService from "../../service/ApiService";
import io from "socket.io-client";
import * as _ from 'lodash';
import RNFetchBlob from 'rn-fetch-blob'


export default class KnsDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            arr:[],
            array:["Loading"],
            refreshing:false,
            functionsList:[],

        }
        this._isMounted = false;
        this.passportId=this.props.route.params.id;
        this.templateId=this.props.route.params.templateId
    }

    async componentDidMount() {
        await AsyncStorage.getItem('language')
            .then(language => {
                if (language){
                    i18n.locale = language;
                }else {
                    i18n.locale = 'ru';
                }
            });
        this._isMounted = true;
        await this.getData();
        // let functionsList = await this.getDictionaryPassports();
        // this.setState({functionsList: functionsList});
        // this.generateMainList();
    }

    getData=async ()=>{
        //Получаем нужное доменное имя и делаем fetch запрос сохраняя его в массив data
        const item=await AsyncStorage.getItem('url')
        const url=`https://${item}/api/main/getObjectsForMonitoring?type=kns`;
        let currentUser=await userService.getCurrentUserInfo();
        let permissionList=currentUser.roles[0].permissionList;
        permissionList.map((list) => {
            if (list.menuId === 'kns_room_main') {
                list.child.map((child) => {
                    // console.log(child)
                    this.state.arr.push(child.id);
                })
            }
        })
        const response = await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        const json = await response.json();

        if (this._isMounted) {
            if (this.state.arr.length>0) {
                this.setState({data: json.data, refreshing: false, array: this.state.arr});
            }else{
                this.setState({array: 'No data'});
            }
        }
    }

    // async getDictionaryPassports() {  //just get functions for monit at this page
    //     return (await apiService.getFunctionByTemplateId()).data;
    // }
    //
    // async generateMainList() {
    //     if (!this.passportId && !this.templateId) return;
    //     let facility = (await apiService.getFacilityPassportForMonitoring(this.passportId, this.templateId)).data;
    //     this.itemList = facility && facility.itemList ? facility.itemList : null;
    //     this.myModels = facility && facility.itemList && facility.itemList.length && facility.itemList[0]  ? facility.itemList[0] : null;
    //     this.boilerTempaleteId = facility && facility.boilerTempaleteId ? facility.boilerTempaleteId : null;
    //     if (this.myModels && (this.myModels.map || this.myModels.schemamap)) {  // get name of Schema(or painting for monitoring)mistake
    //         let schema = this.myModels.map && typeof this.myModels.map == 'string' ? this.myModels.map : this.myModels.schemamap && typeof this.myModels.schemamap == 'string' ? this.myModels.schemamap : null;
    //         // window["widget"] = new PerfectWidgets.Widget("root", window[schema]);
    //         // this.widget = window["widget"];
    //     }
    //     if (this.itemList && this.itemList.length > 0) { //if itemList is created
    //         this.setNames();
    //         this.itemList = await this.getValue(this.itemList);                 //let's find lastvalues and illustrate it on monit table (alerts)
    //         if (this.type != 'boiler') {this.getDateForChart(null); this.isChartHidden = true}   //and draw chart with items (lines with number values 'current usually'
    //         //and plotbands with boolean 'start usually')
    //     }
    // }
    //
    // setNames() {
    //     if (this.type != 'boiler') return;
    //     this.itemList.forEach(el =>{
    //         if (el.detail && el.detail.length) {
    //             let name = el.detail.find(x=> x.fieldname.includes('name')) ? el.detail.find(x=> x.fieldname.includes('name')).fieldname : null;
    //             if (name && this.widget.getByName(name)) {
    //                 this.widget.getByName(name).setText(el.passportName)
    //             }
    //         }
    //     })
    // }

    handleRefresh=async ()=>{
        this.setState({
            refreshing:true
        },()=>{
            this.getData()
        })
    }


    render() {
        if (this.state.array.includes("kns-room-monitoring")) {
            return (
                <View style={styles.body}>
                    <View style={styles.listWrapper}>
                        <Text style={styles.firstHeader}>№</Text>
                        <Text style={styles.secondHeader}>{i18n.t('Title')}</Text>
                        <Text style={styles.thirdHeader}>{i18n.t('Title')}</Text>
                    </View>
                    <View style={styles.listWrapper}>
                        <Text style={styles.firstRow}>№</Text>
                        <Text style={styles.secondRow}>{this.props.route.params.id}</Text>
                        <Text style={styles.secondRow}>{this.props.route.params.templateId}</Text>
                    </View>

                </View>
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

const styles=StyleSheet.create({
    body:{
        backgroundColor:'#fff',
        flex:1
    },
    listWrapper:{
        flexDirection:'row',
        flexWrap:'wrap',
        borderBottomWidth:1,
        width:'100%',
        position:'relative',
        height:45,
        alignItems:'center'
    },
    firstRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'33%',
        textAlign:'center',
        height: '100%',
        lineHeight:40
    },
    secondRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'33%',
        textAlign:'center'
    },
    thirdRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'33%',
        textAlign:'center'
    },
    firstHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'33%',
        textAlign:'center',
        lineHeight:40,
        height: '100%',

    },
    secondHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'33%',
        textAlign:'center'
    },
    thirdHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'33%',
        textAlign:'center'
    }
})
