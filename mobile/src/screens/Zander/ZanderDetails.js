import React, {Component}  from "react";
import {View, Text, FlatList, StyleSheet, Button, TouchableOpacity, ScrollView} from "react-native";
import { Dimensions, Platform, PixelRatio } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import { SearchBar } from 'react-native-elements';
import Ionicons from "react-native-vector-icons/Ionicons";
import io from "socket.io-client";

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;

export default class ZanderDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {

            data:{}
            ,
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
        this.socket = io(`http://agis.kz:4325`);
        //Устанавливаем в массив data объект который мы передаем на эту страницу(по нажатию в странице ZanderList)
        this.setState({data:this.props.route.params.item})

        this.socket.on('docValues201', async (res) => {
            console.log(res)

            //Создаем сокет для получения свежих данных по полю deviceId
            //Сравниваем deviceId объекта которй мы сюда передали и deviceId от сокета
            // и перезаписываем data
            if (this.props.route.params.item.deviceId===res.deviceId){
                this.setState({data:res})
            }

        })

    }

    componentWillUnmount() {
        this.socket.disconnect();
    }
    render() {
        return (
            <ScrollView style={styles.body}>
                <View style={styles.listWrapper}>
                    <Text style={styles.firstHeader}>
                        Создано
                    </Text>
                    <Text style={styles.secondHeader}>
                        {new Date(this.state.data.currentValueDate).toLocaleTimeString()}
                    </Text>
                    <Text style={styles.firstHeader}>
                        Получено
                    </Text>
                    <Text style={styles.secondHeader}>
                        {new Date(this.state.data.createDate).toLocaleTimeString()}
                    </Text>
                </View>
                {/*<View style={styles.listWrapper}>*/}
                {/*    <Text style={styles.firstRow}>*/}
                {/*        Получено*/}
                {/*    </Text>*/}
                {/*    <Text style={styles.secondRow}>*/}
                {/*        {new Date(this.state.data.createDate).toLocaleTimeString()}*/}
                {/*    </Text>*/}
                {/*</View>*/}
                <View style={styles.listWrapper}>
                    <Text style={styles.firstRow}>
                        DI1
                    </Text>
                    {this.state.data.DI1 ?
                        <Ionicons name='radio-button-on' style={styles.secondRowGreen} size={24}/>
                        // <Text style={styles.secondRowGreen}>Да</Text>
                        :
                        <Ionicons name='radio-button-on' style={styles.secondRowGray} size={24}/>
                        // <Text style={styles.secondRowGray}>Нет</Text>
                    }
                    <Text style={styles.firstRow}>
                        DO3
                    </Text>
                    {this.state.data.DO3 ?
                        <Ionicons name='radio-button-on' style={styles.secondRowGreen} size={24}/>
                        // <Text style={styles.secondRowGreen}>Вкл</Text>
                        :
                        <Ionicons name='radio-button-on' style={styles.secondRowGray} size={24}/>
                        // <Text style={styles.secondRowGray}>Выкл</Text>
                    }
                </View>
                <View style={styles.listWrapper}>
                    <Text style={styles.firstRow}>
                        DI2
                    </Text>
                    {this.state.data.DI2 ?
                        <Ionicons name='radio-button-on' style={styles.secondRowGreen} size={24}/>
                        // <Text style={styles.secondRowGreen}>Да</Text>
                        :
                        <Ionicons name='radio-button-on' style={styles.secondRowGray} size={24}/>
                        // <Text style={styles.secondRowGray}>Нет</Text>
                    }
                    <Text style={styles.firstRow}>
                        AI1, мкА
                    </Text>
                    <Text style={styles.secondRow}>
                        {this.state.data.AI1}
                    </Text>
                </View>
                <View style={styles.listWrapper}>
                    <Text style={styles.firstRow}>
                        DI3
                    </Text>
                    {this.state.data.DI3 ?
                        <Ionicons name='radio-button-on' style={styles.secondRowGreen} size={24}/>
                        // <Text style={styles.secondRowGreen}>Да</Text>
                        :
                        <Ionicons name='radio-button-on' style={styles.secondRowGray} size={24}/>
                        // <Text style={styles.secondRowGray}>Нет</Text>
                    }
                    <Text style={styles.firstRow}>
                        AI2, мкА
                    </Text>
                    <Text style={styles.secondRow}>
                        {this.state.data.AI2}
                    </Text>
                </View>
                <View style={styles.listWrapper}>
                    <Text style={styles.firstRow}>
                        DI4
                    </Text>
                    {this.state.data.DI4 ?
                        <Ionicons name='radio-button-on' style={styles.secondRowGreen} size={24}/>
                        // <Text style={styles.secondRowGreen}>Да</Text>
                        :
                        <Ionicons name='radio-button-on' style={styles.secondRowGray} size={24}/>
                        // <Text style={styles.secondRowGray}>Нет</Text>
                    }

                    <Text style={styles.firstRow}>
                        AI3, мкА
                    </Text>
                    <Text style={styles.secondRow}>
                        {this.state.data.AI3}
                    </Text>
                </View>
                <View style={styles.listWrapper}>
                    <Text style={styles.firstRow}>
                        DI5
                    </Text>
                    {this.state.data.DI5 ?
                        <Ionicons name='radio-button-on' style={styles.secondRowGreen} size={24}/>
                        // <Text style={styles.secondRowGreen}>Да</Text>
                        :
                        <Ionicons name='radio-button-on' style={styles.secondRowGray} size={24}/>
                        // <Text style={styles.secondRowGray}>Нет</Text>
                    }
                    <Text style={styles.firstRow}>
                        Версия прошивки
                    </Text>
                    <Text style={styles.secondRow}>
                        {this.state.data.firmwareVersion}
                    </Text>
                </View>
                <View style={styles.listWrapper}>
                    <Text style={styles.firstRow}>
                        DI6
                    </Text>
                    {this.state.data.DI6 ?
                        <Ionicons name='radio-button-on' style={styles.secondRowGreen} size={24}/>
                        // <Text style={styles.secondRowGreen}>Да</Text>
                        :
                        <Ionicons name='radio-button-on' style={styles.secondRowGray} size={24}/>
                        // <Text style={styles.secondRowGray}>Нет</Text>
                    }

                    <Text style={styles.firstRow}>
                        Температура
                    </Text>
                    <Text style={styles.secondRow}>
                        {this.state.data.temperature}
                    </Text>
                </View>
                <View style={styles.listWrapper}>
                    <Text style={styles.firstRow}>
                        DO1
                    </Text>
                    {this.state.data.DO1 ?
                        // <Text style={styles.secondRowGreen}>Вкл</Text>
                        <Ionicons name='radio-button-on' style={styles.secondRowGreen} size={24}/>
                        :
                        // <Text style={styles.secondRowGray}>Выкл</Text>
                        <Ionicons name='radio-button-on' style={styles.secondRowGray} size={24}/>
                    }
                    <Text style={styles.firstRow}>
                        Влажность
                    </Text>
                    <Text style={styles.secondRow}>
                        {this.state.data.humidity}
                    </Text>
                </View>
                <View style={styles.listWrapper}>
                    <Text style={styles.firstRow}>
                        DO2
                    </Text>
                    {this.state.data.DO2 ?
                        <Ionicons name='radio-button-on' style={styles.secondRowGreen} size={24}/>
                        // <Text style={styles.secondRowGreen}>Вкл</Text>
                        :
                        <Ionicons name='radio-button-on' style={styles.secondRowGray} size={24}/>
                        // <Text style={styles.secondRowGray}>Выкл</Text>
                    }
                </View>
            </ScrollView>
        )
    }
}
const size=Platform.OS === 'ios'?Math.round(PixelRatio.roundToNearestPixel(scale*12)):Math.round(PixelRatio.roundToNearestPixel(scale*12))-2;
const styles=StyleSheet.create({
    body:{
        backgroundColor:'#fff',
        flex:1
    },
    listWrapper:{
        flexDirection:'row',
        flexWrap:'wrap',
        borderBottomWidth:1,
        position:'relative',
        height:45,
        width:'100%',
        alignItems:'center'
    },
    firstRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:15,
        maxWidth:'35%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        // fontWeight: 'bold'
    },
    secondRow:{
        flex:1,
        fontSize:13,
        maxWidth:'15%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        borderLeftWidth:1,
        borderRightWidth:1
    },
    secondRowGray:{
        // backgroundColor: '#c0c0c0',
        // color: 'red',
        color: '#c0c0c0',
        flex:1,
        fontSize:18,
        maxWidth:'15%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        borderLeftWidth:1,
        borderRightWidth:1
    },
    secondRowGreen:{
        color: '#32CD32',
        // color: '#32CD32',
        // backgroundColor: '#32CD32',
        flex:1,
        fontSize:18,
        maxWidth:'15%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        borderLeftWidth:1,
        borderRightWidth:1
    },
    firstHeader:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:15,
        maxWidth:'35%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        fontWeight:'bold'
    },
    secondHeader:{
        flex:1,
        fontSize:size,
        maxWidth:'15%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        borderLeftWidth:1,
        borderRightWidth:1,
        fontWeight:'bold'
    }
})


