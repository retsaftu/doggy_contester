import React, {Component} from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import userService from "../../service/UserService";
import Loading from "../Loading";
import NoData from "../NoData";
import apiService from "../../service/ApiService";
import io from "socket.io-client";
import * as _ from 'lodash';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import RNFetchBlob from 'rn-fetch-blob'


export default class Kns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            arr:[],
            array:["Loading"],
            refreshing:false,
            mainList:new Map()
        }
        this._isMounted = false;
        this.type='kns';
        this.functionsList=[];
        this.sysNames=[];
        this.templates=[];
        this.objectValues=[];
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
        // await this.getData();
        // await this.getDictionaryPassports();
        // await this.generateMainList();
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

    Monitoring(value) { //at getting new value from soccket
        if (!value || (value && value.length === 0)) return;
        value.forEach(el => {
            let Nofval = 0;
            this.functionsList.forEach(e => {
                if (typeof el[e.fieldname] == 'boolean') {
                    Nofval++;
                }
            })
            // console.log(Nofval)

            if ( Nofval > 0 && this.state.mainList && typeof this.state.mainList.get === 'function' && this.state.mainList.get(el.objectId)) {
                // this.functionsList(x=>)
                // console.log("data exists");
                this.state.mainList.get(el.objectId).alerts = this.formValue(this.state.mainList.get(el.objectId), el);
            } else {
                this.state.mainList.forEach((val, key) => {
                    if ( Nofval > 0 &&  val && val.value && typeof val.value.get === 'function' && val.value.get(el.objectId)) {
                        val.value.get(el.objectId).alerts = this.formValue(val.value.get(el.objectId), el);
                    }

                });
            }

            this.showArray();
        });
    }

    showArray() {  // convert map to array and chunk array
        let showArray = [];
        showArray = Array.from(this.state.mainList);
        // console.log(showArray)
        showArray.forEach(el => {
            if (el && el.length && el[1] && el[1].value) {
                el[1].value = Array.from(el[1].value);
            }
        });
        for (let i = 0; i < showArray.length; i++) {
            showArray[i].index = i + 1;
        }
        return showArray;
    }

    async generateMainList() {
        try {
            let mainList = new Map();
            let startDate = new Date();
            startDate.setMinutes(startDate.getMinutes()-15);
            // startDate.setHours(startDate.getHours() - 1);
            let items = (await apiService.getObjectsForMonitoring(this.type));
            let templates = items.templates.map(x => x.sysName);
            this.templates = templates;
            this.objectValues = (await apiService.getLastObjectValues201(startDate, new Date(), this.sysNames)).data;
            // console.log(this.objectValues)
            if (items.data && items.data.length > 0) {
                items.data.forEach(el => {
                    let item = this.getValue(el, templates);
                    if (item && item._id) {
                        mainList.set(item._id, item);
                    }
                });
            }

            this.state.mainList = await this.getLastValue(mainList);
            let resultArray=await this.showArray();
            let temp=await this.renderList(resultArray);
            this.setState({mainList: temp})
            // console.log('this',this.state.mainList)
        } catch (err) {
            console.error(err);
        } finally {
            if (this.functionsList && this.functionsList.length) {
                this.functionsList = _.sortBy(this.functionsList, 'name');
            }

        }
    }

    getValue(facility, keys) {                          //collect itemList
        this.keys = keys;
        let item = facility;
        // console.log('facility',facility)
        // console.log('keys',keys)
        let itemList;
        itemList = {
            '_id': item.id,
            'templateId': item.templateId,
            'passportName': item.name
        };
        if (keys && keys.length) {
            keys.forEach(key => {
                if (item[key] && item[key].length) {
                    if (key === 'na') {
                        itemList.value = new Map();
                        item[key].forEach(element => {
                            itemList.value.set(element._id, element);
                        });
                    }
                }
            });
        }
        return itemList;
    }


    getLastValue(mainList) {                                  //get last value from objectvalues201 = array
        // console.log(mainList)
        this.objectValues.forEach(el => {
            if (mainList.get(el.objectId)) {
                mainList.get(el.objectId).alerts = this.formValue(mainList.get(el.objectId), el);
            } else {
                mainList.forEach((value, key) => {
                    if (value && value.value && value.value.get(el.objectId)) {
                        value.value.get(el.objectId).alerts = this.formValue(value.value.get(el.objectId), el);
                    }
                });
            }
        });
        return mainList;
    }



    formValue(temp, val) {                       //create value {sysName,value}
        // console.log(temp)
        if (!val) return;
        // console.log(val)

        let alerts = [];
        let type = this.type;
        let name = temp.passportName;
        // let templateId = this.templates;
        let functionList = this.functionsList;
        Object.keys(val).forEach(function (key, index) {
            if (_.find(functionList, { 'fieldname': key })) {
                let functionFound = _.find(functionList, { 'fieldname': key });
                // console.log(functionFound)
                let color;
                if (typeof val[key] === 'boolean' && functionFound
                    && functionFound.TrueColor !== undefined && functionFound.FalseColor !== undefined) { // here takes color for circle
                    color = val[key] ? functionFound.TrueColor : functionFound.FalseColor;                //if you do not get go to passports
                }
                if (val.constatus){
                    console.log(val.constatus)
                }
                alerts.push({
                    'fieldname': functionFound.fieldname ? functionFound.fieldname : '',
                    'name':  name +' '+ functionFound.name,
                    'value': val[key], 'imei': val.deviceId,
                    'color': color ? color : 0,
                    'common': (val.constatus===true || val.constatus===false) && (val.conavailable===true || val.conavailable===false)?
                        val.conavailable ===val.constatus ? 1 : 2: 3
                });
            }
        });
        if (alerts && alerts.length) {
            let conavailable = alerts.find(x=> x.fieldname === 'conavailable');
            let constatus = alerts.find(x=> x.fieldname === 'constatus');
            if (conavailable && constatus) {
                let val = (constatus.constatus===true || constatus.constatus===false) && (conavailable.conavailable===true || conavailable.conavailable===false)?
                    conavailable.conavailable ===constatus.constatus ? 1 : 2: 4;
                alerts.push({
                    'fieldname':'common',
                    'name':'common',
                    'value': val,
                    'color': val
                });
            }
            return alerts;
        }
    }

    async getDictionaryPassports() {  //just get boolean functions for monit at this page

        let items = (await apiService.getFunctionsForMonitoring(this.type));
        this.functionsList = items.functionsList?items.functionsList:[];
        this.sysNames = this.functionsList.map(x=> x.fieldname);
        // console.log('f',this.functionsList)
        // console.log('s',this.sysNames)
    }

    async renderList(array){
        // console.log(array)
        let resultArray=[];
        let start=[];
        let drobilka=[];
        let vytazhka=[];
        let voltagestatus=[];
        let error=[];
        array.map((item,i)=>{
            // console.log('1',item)
            item[1].value.map((val, j) => {
                if (val[1].alerts && val[1].alerts.length > 0) {
                    val[1].alerts.map((alert) => {
                        if (alert.fieldname === 'start') {
                            if (alert.color===1) {
                                start.push(
                                    <FontAwesome name='circle' key={j} size={20} color='green' style={styles.tripleAlert}/>
                                )
                            } else if(alert.color===0){
                                start.push(
                                    <FontAwesome name='circle' key={j} size={20} color='gray' style={styles.tripleAlert}/>
                                    // <FontAwesome name='circle' key={j} size={20} color='gray' style={styles.alert}/>
                                )
                            } else if(alert.color===2){
                                start.push(
                                    <FontAwesome name='circle' key={j} size={20} color='red' style={styles.tripleAlert}/>
                                )
                            }
                        }else if (alert.fieldname === 'error') {
                            if (alert.color===1) {
                                error.push(
                                    <FontAwesome name='circle' key={j} size={20} color='green' style={styles.tripleAlert}/>
                                )
                            } else if(alert.color===0){
                                error.push(
                                    <FontAwesome name='circle' key={j} size={20} color='gray' style={styles.tripleAlert}/>
                                )
                            } else if(alert.color===2){
                                error.push(
                                    <FontAwesome name='circle' key={j} size={20} color='red' style={styles.tripleAlert}/>
                                )
                            }
                        }
                    })
                }
            })
            if (item[1].alerts && item[1].alerts.length>0) {
                item[1].alerts.map((alert, k) => {
                    if (alert.fieldname === 'drobilka') {
                        if (alert.color===1) {
                            drobilka.push(
                                <FontAwesome name='circle' key={k} size={20} color='green' style={styles.alert}/>
                            )
                        } else if(alert.color===0){
                            drobilka.push(
                                <FontAwesome name='circle' key={k} size={20} color='gray' style={styles.alert}/>
                            )
                        } else if(alert.color===2){
                            drobilka.push(
                                <FontAwesome name='circle' key={k} size={20} color='red' style={styles.alert}/>
                            )
                        }
                    } else if (alert.fieldname === 'vytazhka') {
                        if (alert.color===1) {
                            vytazhka.push(
                                <FontAwesome name='circle' key={k} size={20} color='green' style={styles.alert}/>
                            )
                        } else if(alert.color===0){
                            vytazhka.push(
                                <FontAwesome name='circle' key={k} size={20} color='gray' style={styles.alert}/>
                            )
                        } else if(alert.color===2){
                            vytazhka.push(
                                <FontAwesome name='circle' key={k} size={20} color='red' style={styles.alert}/>
                            )
                        }
                    } else if (alert.fieldname === 'voltagestatus') {
                        if (alert.color===1) {
                            voltagestatus.push(
                                <FontAwesome name='circle' key={k} size={20} color='green' style={styles.alert}/>
                            )
                        } else if(alert.color===0){
                            voltagestatus.push(
                                <FontAwesome name='circle' key={k} size={20} color='gray' style={styles.alert}/>
                            )
                        } else if(alert.color===2){
                            voltagestatus.push(
                                <FontAwesome name='circle' key={k} size={20} color='red' style={styles.alert}/>
                            )
                        }
                    }
                })
            }
            resultArray.push(
                <TouchableOpacity
                    style={styles.listWrapper} key={i}
                    onPress={()=>{
                          this.props.navigation.navigate('Kns Details',{title:item[1].passportName, id:item[0], templateId:item[1].templateId})
                    }}
                >
                    <Text style={styles.firstRow}>{i+1}</Text>
                    <Text style={styles.secondRow}>{item[1].passportName}</Text>
                    <View style={styles.thirdRow}>
                        <View style={styles.alertWrapper}>
                            {start}
                        </View>
                    </View>
                    <View style={styles.fourthRow}>
                        <View style={styles.alertWrapper}>
                            {drobilka}
                        </View>
                    </View>
                    <View style={styles.fifthRow}>
                        <View style={styles.alertWrapper}>
                            {vytazhka}
                        </View>
                    </View>
                    <View style={styles.sixthRow}>
                        <View style={styles.alertWrapper}>
                            {voltagestatus}
                        </View>
                    </View>
                    <View style={styles.seventhRow}>
                        <View style={styles.alertWrapper}>
                            {error}
                        </View>
                    </View>
                </TouchableOpacity>
            )
            start=[];
            drobilka=[];
            vytazhka=[];
            voltagestatus=[];
            error=[];
            // console.log(item[1].passportName, start)
        })
        return resultArray;
    }

    handleRefresh=async ()=>{
        this.setState({
            refreshing:true
        },()=>{
            this.getData()
        })
    }


    render() {
        // if (this.state.array.includes("kns-room-monitoring")) {
        //     return (
        //         <View style={styles.body}>
        //             <View style={styles.listWrapper}>
        //                 <Text style={styles.firstHeader}>№</Text>
        //                 <Text style={styles.secondHeader}>{i18n.t('Title')}</Text>
        //                 <Text style={styles.thirdHeader}>В работе</Text>
        //                 <Text style={styles.fourthHeader}>Дроб</Text>
        //                 <Text style={styles.fifthHeader}>Выт</Text>
        //                 <Text style={styles.sixthHeader}>U</Text>
        //                 <Text style={styles.seventhHeader}>Ошибка</Text>
        //             </View>
        //             <ScrollView>
        //                 {this.state.mainList}
        //             </ScrollView>
        //         </View>
        //     )
        // }
        // else if(this.state.array.includes("Loading")){
        //     return <Loading/>
        // }
        // else{
        //     return (
        //         <NoData/>
        //     )
        // }
        return(
            <View style={styles.body}>
                <Text style={{top:50,left:20, color:'black'}}>
                    Страница на стадии разработки
                </Text>
            </View>
        )
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
        borderColor:'gray',
        width:'100%',
        position:'relative',
        height:45,
        alignItems:'center',
    },
    alertWrapper:{
        flexDirection:'row',
        // flexWrap:'wrap',
        width:'100%',
        position:'relative',
        height:'100%',
        lineHeight:40,
        alignItems:'center',
        borderLeftWidth:1,
        borderColor:'gray'
        // justifyContent:'center'
    },
    alert:{
        flex:1,
        textAlign:'center',
        height: '100%',
        lineHeight:40,
        maxWidth:'100%',
        // marginRight:5
        alignItems:'center',
    },
    tripleAlert:{
        flex:1,
        textAlign:'center',
        height: '100%',
        lineHeight:40,
        maxWidth:'33.3%',
        // marginRight:5
        alignItems:'center',
    },
    firstRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        textAlign:'center',
        height: '100%',
        lineHeight:40,
        borderRightWidth:1,
        borderColor: 'gray'
    },
    secondRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'18%',
        textAlign:'center'
    },
    thirdRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'20%',
        textAlign:'center'
    },
    fourthRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center'
    },
    fifthRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        textAlign:'center'
    },
    sixthRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        textAlign:'center'
    },
    seventhRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'20%',
        textAlign:'center'
    },
    firstHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        textAlign:'center',
        lineHeight:40,
        height: '100%',

    },
    secondHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'18%',
        textAlign:'center'
    },
    thirdHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'20%',
        textAlign:'center'
    },
    fourthHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center'
    },
    fifthHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        textAlign:'center'
    },
    sixthHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        textAlign:'center'
    },
    seventhHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'20%',
        textAlign:'center',
        justifyContent:'center'
    },
})
