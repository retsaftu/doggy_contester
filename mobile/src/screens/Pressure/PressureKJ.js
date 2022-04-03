import React, {Component}  from "react";
import {View, Text, FlatList, StyleSheet, Button} from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../../css/ListStyles'
import i18n from "i18n-js";
import RNFetchBlob from 'rn-fetch-blob'

//Смотреть описание компонента в файле Pressure
export default class PressureKJ extends Component {
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
        const item=await AsyncStorage.getItem('url')
        // const url=`https://${item}/api/passport/getPassportListForPressure`
        const url=`https://${item}/api/passport/getZanderDeviceListByFunction?type=pressure`

        this.socket = io(`http://agis.kz:4325`);
        const response = await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        const json = await response.json();
        if (this._isMounted) {
            this.setState({data: json.data, refreshing: false});
        }

        this.socket.on('pressure',(res)=>{
            if (!this.state.data.length || !res) return

            let currentValueDate = new Date(res.currentValueDate)
            let currentDate = new Date()
            currentDate.setMinutes(new Date().getMinutes() - 10)

            if (currentValueDate >= currentDate && res.pressure!=null && (res.pressure<1 || res.pressure>4.5)) {
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
                            {item.value<1
                                ?
                                <View style={styles.listWrapper}>
                                    <Text style={localStyles.firstRed}>{index + 1}</Text>
                                    <Text style={localStyles.secondRed}>{item.name}</Text>
                                    <Text style={localStyles.thirdRed}>{item.value}</Text>
                                </View>
                                :
                                item.value<=4.5 && item.value>=1
                                    ?
                                    <View style={styles.listWrapper}>
                                        <Text style={localStyles.firstGreen}>{index + 1}</Text>
                                        <Text style={localStyles.secondGreen}>{item.name}</Text>
                                        <Text style={localStyles.thirdGreen}>{item.value}</Text>
                                    </View>
                                    :
                                    item.value>4.5
                                        ?
                                        <View style={styles.listWrapper}>
                                            <Text style={localStyles.firstYellow}>{index + 1}</Text>
                                            <Text style={localStyles.secondYellow}>{item.name}</Text>
                                            <Text style={localStyles.thirdYellow}>{item.value}</Text>
                                        </View>
                                        :
                                        <View style={styles.listWrapper}>
                                            <Text style={styles.firstRow}>{index + 1}</Text>
                                            <Text style={styles.secondRow}>{item.name}</Text>
                                            <Text style={styles.thirdRow}>{item.value}</Text>
                                        </View>
                            }
                        </View>
                    )}
                />
            </View>

        )
    }
}
const localStyles= StyleSheet.create({
    firstGreen:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        height:'100%',
        textAlign:'center',
        lineHeight:45,
        color:'green'
    },
    secondGreen:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'65%',
        textAlign:'center',
        flexShrink: 1,
        color:'green'
    },
    thirdGreen:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'24%',
        textAlign:'center',
        color:'green'
    },
    firstRed:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        height:'100%',
        textAlign:'center',
        lineHeight:45,
        color:'red'
    },
    secondRed:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'65%',
        textAlign:'center',
        flexShrink: 1,
        color:'red'
    },
    thirdRed:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'24%',
        textAlign:'center',
        color:'red'
    },
    firstYellow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        height:'100%',
        textAlign:'center',
        lineHeight:45,
        color:'#FFD700'
    },
    secondYellow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'65%',
        textAlign:'center',
        flexShrink: 1,
        color:'#FFD700'
    },
    thirdYellow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'24%',
        textAlign:'center',
        color:'#FFD700'
    },
    firstRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        height:'100%',
        textAlign:'center',
        lineHeight:45,
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

