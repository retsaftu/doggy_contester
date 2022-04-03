import React, {Component}  from "react";
import {View, Text, FlatList, StyleSheet, Button} from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import userService from "../service/UserService";
import NoData from "./NoData";
import Loading from "./Loading";
import RNFetchBlob from 'rn-fetch-blob'


export default class Service extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            arr:[],
            array:["Loading"],
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
        // await this.getData()
    }

    getData=async ()=>{

        const item=await AsyncStorage.getItem('url')

        const url=`https://${item}/api/main/getNameMessage201ByIMEI`;

        let currentUser=await userService.getCurrentUserInfo();
        let permissionList=currentUser.roles[0].permissionList;
        permissionList.map((list)=>{
            if (list.menuId) {
                list.child.map((child) => {
                    if (child.id === 'message-201') {
                        this.state.arr.push(child.id);
                    }
                })
            }
        })
        this.socket = io(`http://agis.kz:4325`);
        const response = await RNFetchBlob.config({trusty : true}).fetch('GET', url);
        const json = await response.json();
        const readyData=json.data.data.sort((a, b) => {
            if (!a.name) return 0
            return a.name.localeCompare(b.name)
        })
        if (this._isMounted) {
            if (this.state.arr.length>0) {
                this.setState({data: readyData, refreshing: false, array:this.state.arr});
            }else{
                this.setState({array: 'No data'});
            }
        }
        console.log(this.state.data)

        //Получаем данные с сокета с ивентом docValues201
        this.socket.on('docValues201', async (res) => {
            console.log(res)

            if (!this.state.data.length || !res) return
            const messageTime = new Date(res.currentValueDate).toLocaleTimeString();
            let messageByteCount = await getByteCount(res.messageId)

            //Получаем из сокета нужные поля, после чего сортируем по времени и ререндерим компонент
            if (res.messageId != null) {
                for (let i = 0; i < this.state.data.length; i++) {
                    if (this.state.data[i].IMEI === res.deviceId) {
                        this.state.data[i].lastMessageTime = messageTime;
                        this.state.data[i].lastMessageByteCount = messageByteCount+2;
                    }
                }
            }
            this.state.data.sort(function (a,b){
                return new Date(b.currentValueDate)-new Date(a.currentValueDate)
            })
            this.forceUpdate();
        })

        const getByteCount = async (messageId) => {
            return await getMessage(messageId).then((message) => {
                if (getByteCountB(message) != null) {
                    return (
                        getByteCountB(message)
                    )
                }
            })
        }


        const getMessage = async (id) => {
            return await getMessages201ById(id)
        }
        const getMessages201ById = async (id) => {
            const url= `https://${item}//api/main/getMessages201ById?id=` + id;
            const res = await RNFetchBlob.config({trusty : true}).fetch('GET', url);
            let data = await res.json()
            return data.data
        }
        const getByteCountB = (message) => {
            return (message && message.clientData) ? message.byteCount : null
        }

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
        // if (this.state.array.includes("message-201")) {
        //     return (
        //         <View style={styles.body}>
        //             <View style={styles.listWrapper}>
        //                 <Text style={styles.firstHeader}>{i18n.t('Title')}</Text>
        //                 <Text style={styles.secondHeader}>{i18n.t('Time')}</Text>
        //                 <Text style={styles.thirdHeader}>{i18n.t('ByteCount')}</Text>
        //             </View>
        //             <FlatList
        //                 data={this.state.data}
        //                 extraData={this.state.data}
        //                 refreshing={this.state.refreshing}
        //                 onRefresh={this.handleRefresh}
        //                 keyExtractor={(item, index) => String(index)}
        //                 renderItem={({item, index}) => (
        //                     <View>
        //                         {item.lastMessageByteCount ?
        //                             <View style={styles.listWrapper}>
        //                                 <Text style={styles.firstRow}>{item.name}</Text>
        //                                 <Text style={styles.secondRow}>{item.lastMessageTime}</Text>
        //                                 <Text style={styles.thirdRow}>{item.lastMessageByteCount}</Text>
        //                             </View>
        //                             : null
        //                         }
        //                     </View>
        //                 )}
        //             />
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
        position:'relative',
        height:45,
        width:'100%',
        alignItems:'center'
    },
    firstRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'40%',
        height:'100%',
        textAlign:'center',
        lineHeight:40
    },
    secondRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'30%',
        textAlign:'center'
    },
    thirdRow:{
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'29%',
        textAlign:'center',
    },
    firstHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'40%',
        height:'100%',
        textAlign:'center',
        lineHeight:40
    },
    secondHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'30%',
        textAlign:'center'
    },
    thirdHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:13,
        maxWidth:'29%',
        textAlign:'center',
    },
})


