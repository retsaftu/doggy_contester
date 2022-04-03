import React, {Component} from "react";
import {FlatList, Text, View} from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import styles from '../../css/ListStyles'
import RNFetchBlob from 'rn-fetch-blob'

//Смотреть описание компонента в файле FlowMeterRate
export default class FlowMeterVMinus extends Component {
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
        const item=await AsyncStorage.getItem('url')
        const url=`https://${item}/api/passport/getPassportListForFlowmeter1`

        this.socket = io(`http://agis.kz:4325`);
        const response = await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        const json = await response.json();
        if (this._isMounted) {
            this.setState({data: json.data, refreshing: false});
        }

        this.socket.on('flowrate',(res)=>{
            if (!this.state.data.length || !res) return

            let currentValueDate = new Date(res.currentValueDate)
            let currentDate = new Date()
            currentDate.setMinutes(new Date().getMinutes() - 10)


            if (currentValueDate >= currentDate && res.FlowRateNegative!=null) {
                for (let i=0;i<this.state.data.length;i++){
                    if (this.state.data[i].id===res.objectId){
                        if (res.FlowRateNegative<1 && res.FlowRateNegative>0){
                            this.state.data[i].value=res.FlowRateNegative.toFixed(2);
                        } else if(res.FlowRateNegative===0){
                            this.state.data[i].value=res.FlowRateNegative;
                        }else {
                            let value=Math.round(res.FlowRateNegative).toString();
                            this.state.data[i].value=value.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
                        }
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

    render() {
        return (
            <View style={styles.body}>
                <View style={styles.listWrapper}>
                    <Text style={styles.firstHeader}>№</Text>
                    <Text style={styles.secondHeader}>{i18n.t('Title')}</Text>
                    <Text style={styles.thirdHeader}>V-</Text>
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

