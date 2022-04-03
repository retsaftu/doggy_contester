import React, {Component} from "react";
import {FlatList, Text, View} from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import styles from '../../css/ListStyles'
import RNFetchBlob from 'rn-fetch-blob'

//Остальные компоненты расходомеров точно такие же
export default class FlowMeterRate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            refreshing:false
        }
        this._isMounted = false;
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
        await this.getData()
    }

    getData=async ()=>{
        //Получение домена с AsyncStorage и обращаться в нужный url
        const item=await AsyncStorage.getItem('url')
        const url=`https://${item}/api/passport/getPassportListForFlowmeter1`
        //Создаем сокет и делаем fetch запрос на url упомянутый выше
        this.socket = io(`http://agis.kz:4325`);
        const response =  await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        const json = await response.json();
        //Сохраняем объект в массив data
        if (this._isMounted) {
            this.setState({data: json.data, refreshing: false});
        }
        //Сокет с ивентом "flowrate"
        this.socket.on('flowrate',(res)=>{
            console.log(res)
            if (!this.state.data.length || !res) return

            let currentValueDate = new Date(res.currentValueDate)
            let currentDate = new Date()
            currentDate.setMinutes(new Date().getMinutes() - 10)

            //Проверяем поле id (у объектов которые сохранены в массиве data)
            // с полем objectId из объектов которые получаем с сокетов
            // и создаем поле value которое будем рендерить
            if (currentValueDate >= currentDate && res.FlowRate!=null) {
                for (let i=0;i<this.state.data.length;i++){
                    if (this.state.data[i].id===res.objectId){
                        if (res.FlowRate<1 && res.FlowRate>0){
                            this.state.data[i].value=res.FlowRate.toFixed(2);
                        } else if(res.FlowRate===0){
                            this.state.data[i].value=res.FlowRate;
                        }else {
                            let value=Math.round(res.FlowRate).toString();
                            this.state.data[i].value=value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                        }
                        // this.state.data[i].value=res.FlowRate.toFixed(2);
                        //Ре-рендерим страницу по скольку новый сокет поступил
                        this.forceUpdate();
                    }
                }
            }

        })
    }
    //Когда мы выходим с этой страницы-отключаем соединение к сокету
    componentWillUnmount() {
        this._isMounted = false;
        this.socket.disconnect();
    }
    handleRefresh=async ()=>{
        this.setState({
            refreshing:true
        },()=>{
            this.getData()
        })
    }


render() {
    return (
        <View style={styles.body}>
            <View style={styles.listWrapper}>
                <Text style={styles.firstHeader}>№</Text>
                <Text style={styles.secondHeader}>{i18n.t('Title')}</Text>
                <Text style={styles.thirdHeader}>{i18n.t('m3h')}</Text>
            </View>

            <FlatList
                data={this.state.data}
                extraData={this.state.data}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                keyExtractor={(item, index) => String(index)}
                renderItem={({item, index}) => (
                    <View style={styles.listWrapper}>
                        <Text style={styles.firstRow}>{index + 1}</Text>
                        <Text style={styles.secondRow}>{item.name}</Text>
                        <Text style={styles.thirdRow}>{item.value}</Text>
                    </View>
                )}
            />
        </View>

    )
}
}
