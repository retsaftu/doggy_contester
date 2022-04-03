import React, {Component}  from "react";
import {View, Text, FlatList, StyleSheet, Button} from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../../css/ListStyles'
import i18n from "i18n-js";
import RNFetchBlob from 'rn-fetch-blob'


export default class Pressure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            refreshing:false
        }
        this._isMounted = false;
    }

    async componentDidMount() {
        this._isMounted = true;
        await AsyncStorage.getItem('language')
            .then(language => {
                if (language){
                    i18n.locale = language;
                }else {
                    i18n.locale = 'ru';
                }
            });
        await this.getData()
    }

    getData=async ()=>{
        //Получение домена с AsyncStorage и обращаться в нужный url
        const item=await AsyncStorage.getItem('url')
        // const url=`https://${item}/api/passport/getPassportListForPressure`
        const url=`https://${item}/api/passport/getZanderDeviceListByFunction?type=pressure`
        //Создаем сокет и делаем fetch запрос на url упомянутый выше

        this.socket = io(`http://agis.kz:4325`);

        const response = await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        const json = await response.json();
        console.log(json.data)
        //Сохраняем объект в массив data
        if (this._isMounted) {
            this.setState({data: json.data, refreshing: false});
        }

        this.socket.on("connect",(res)=>{
            console.log("con")
        })
        this.socket.on("connect_error",(res)=>{
            console.log('socket error',res)
        })
        this.socket.on("error",(res)=>{
            console.log('socket err',res)
        })
        //Сокет с ивентом "pressure"
        this.socket.on('pressure',(res)=>{
            console.log(res)
            if (!this.state.data.length || !res) return

            let currentValueDate = new Date(res.currentValueDate)
            let currentDate = new Date()
            currentDate.setMinutes(new Date().getMinutes() - 10)

            //Проверяем поле id (у объектов которые сохранены в массиве data)
            // с полем objectId из объектов которые получаем с сокетов
            // и создаем поле value которое будем рендерить
            if (currentValueDate >= currentDate && res.pressure!=null) {
                for (let i=0;i<this.state.data.length;i++){
                    if (this.state.data[i]._id===res.objectId){
                        this.state.data[i].value=res.pressure ? res.pressure.toFixed(2) : res.pressure === 0 ? '0.00' : '-'
                        this.forceUpdate();
                    }
                }
            }

        })

    }

    componentWillUnmount() {
        this.socket.disconnect();
    }

    handleRefresh=async ()=>{
        this.setState({
            refreshing:true
        },()=>{
            this.getData()
        })
    }
    // красный - ниже мин
    // желтый выше макс
    //равно им то зеленый
    render() {
        return (
            <View style={styles.body}>
                <View style={styles.listWrapper}>
                    <Text style={styles.firstHeader}>№</Text>
                    <Text style={styles.secondHeader}>{i18n.t('Title')}</Text>
                    <Text style={styles.thirdHeader}>{i18n.t('Value')}</Text>
                </View>

                <FlatList
                    data={this.state.data}
                    extraData={this.state.data}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({item, index}) => (
                        <View>
                            <View style={styles.listWrapper}>
                                <Text style={styles.firstRow}>{index + 1}</Text>
                                <Text style={styles.secondRow}>{item.name}</Text>
                                <Text style={styles.thirdRow}>{item.value}</Text>
                            </View>
                        </View>
                    )}
                />
            </View>

        )
    }
}
const localStyles= StyleSheet.create({
    firstRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        height:'100%',
        textAlign:'center',
        lineHeight:45,
        color:'black'
    },
    secondRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'65%',
        textAlign:'center',
        flexShrink: 1,
    },
    thirdRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'24%',
        textAlign:'center',
    },

})