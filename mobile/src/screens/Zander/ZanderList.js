import React, {Component}  from "react";
import {View, Text, FlatList, StyleSheet, Button, TouchableOpacity} from "react-native";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18n-js";
import {SearchBar} from "react-native-elements";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default class ZanderList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            search:'',
            filteredDataSource:[],
            masterDataSource:[],
            searching: false,
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

        //Обращаемся к сокету с ивентом docValues201
        this.socket.on('docValues201', async (res) => {
            console.log(res)
            if (!this.state.searching) {
                //Отправляем главный массив и объект полученный с сокета в функцию upsert
                this.upsert(this.state.filteredDataSource, res);
                //Делаем сортинг по полю currentValueDate(самые свежие сокеты будут стоять на самом верху
                this.state.filteredDataSource.sort(function (a, b) {
                    return new Date(b.currentValueDate) - new Date(a.currentValueDate)
                })
            }
            //Делаем тоже самое для другого массива который нужен для searchBar(поисковой строки)
            this.upsert(this.state.masterDataSource, res);
            this.state.masterDataSource.sort(function (a, b) {
                return new Date(b.currentValueDate) - new Date(a.currentValueDate)
            })

            this.setState({refreshing:false})
            // this.forceUpdate();

        })

    }
    //Если в массиве присутсвует объект с полем deviceId, то он его перезапишет
    // вместе с полем color="green"(Чтобы сделать поле зеленым цветом, что означает что поле отправило свежие данные)
    //Если в массиве такого объекта нет, то добавляем в массив вместе с полем color="red"
    //(Чтобы сделать поле красным цветом, что означает что поле НЕ отправило свежие данные)
    upsert(array, element) {
        const i = array.findIndex(_element => _element.deviceId === element.deviceId);
        if (i > -1) {
            array[i] = element;
            array[i].color = "green"
        } else {
            element.color = "red";
            array.push(element);
        }
    }
    componentWillUnmount() {
        this.socket.disconnect();
    }
    //Эта функция предназначается для поисковой строки
    // Позволяет искать нужные поля с deviceId который мы будем писать в поисковую строку
    searchFilterFunction = (text) => {
        // Check if searched text is not blank
        this.setState({searching:true})
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = this.state.masterDataSource.filter(function (item) {
                const itemData = item.deviceId
                    ? item.deviceId.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            this.setState({filteredDataSource:newData, search:text})
            // setFilteredDataSource(newData);
            // setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            this.setState({filteredDataSource:this.state.masterDataSource})
            this.setState({search:text, searching:false})
            // setFilteredDataSource(masterDataSource);
            // setSearch(text);
        }
    };
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
                <SearchBar
                    round
                    // searchIcon={{ size: 17 }}
                    searchIcon={()=> <Ionicons name='search'size={22}/>}
                    clearIcon={() =>{
                        return(
                            <TouchableOpacity onPress={()=>this.searchFilterFunction('')}>
                                <MaterialCommunityIcon name="bookmark-remove" size={24} color={'black'}/>
                            </TouchableOpacity>
                        )
                    } }
                    onChangeText={(text) => this.searchFilterFunction(text)}
                    onClear={(text) => this.searchFilterFunction('')}
                    placeholder="Введите..."
                    value={this.state.search}
                    inputStyle={{backgroundColor: 'white'}}
                    containerStyle={{backgroundColor: 'white', borderWidth: 1, borderRadius: 5, padding:0.1, borderColor:'gray',margin:'1%'}}
                    inputContainerStyle={{backgroundColor: 'white'}}
                    color='black'
                />
                <View style={styles.listWrapper}>
                    <Text style={styles.firstHeader}>№</Text>
                    <Text style={styles.secondHeader}>Device ID</Text>
                    <Text style={styles.thirdHeader}>Создано</Text>
                    <Text style={styles.fourthHeader}>Получено</Text>
                </View>
                <FlatList
                    data={this.state.filteredDataSource}
                    extraData={this.state.filteredDataSource}
                    refreshing={this.state.refreshing}
                    onRefresh={this.handleRefresh}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({item, index}) => (
                        <View>
                            {/*Смотря на поле color будем рендерить поле с нужным цветом*/}
                            {item.color==='green'
                                ?
                                <TouchableOpacity
                                    style={styles.listWrapper}
                                    onPress={()=>{
                                        this.props.navigation.navigate('Zander Details',{item:item, title:item.deviceId})
                                    }}>
                                        <Text style={styles.greenFirstRow}>{index+1}</Text>
                                        <Text style={styles.greenSecondRow}>{item.deviceId.toUpperCase()}</Text>
                                        <Text style={styles.greenThirdRow}>{new Date(item.currentValueDate).toLocaleTimeString()}</Text>
                                        <Text style={styles.greenFourthRow}>{new Date(item.createDate).toLocaleTimeString()}</Text>
                                </TouchableOpacity>
                                :

                                <TouchableOpacity
                                    onPress={()=>{
                                        this.props.navigation.navigate('Zander Details',{item:item, title:item.deviceId})
                                    }}>
                                    <View style={styles.listWrapper}>
                                        <Text style={styles.redFirstRow}>{index+1}</Text>
                                        <Text style={styles.redSecondRow}>{item.deviceId.toUpperCase()}</Text>
                                        <Text style={styles.redThirdRow}>{new Date(item.currentValueDate).toLocaleTimeString()}</Text>
                                        <Text style={styles.redFourthRow}>{new Date(item.createDate).toLocaleTimeString()}</Text>
                                    </View>
                                </TouchableOpacity>

                            }
                        </View>
                    )
                    }
                />
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
        backgroundColor:'green',
        flexDirection:'row',
        flexWrap:'wrap',
        borderBottomWidth:1,
        position:'relative',
        height:45,
        width:'100%',
        alignItems:'center'
    },
    greenFirstRow:{
        backgroundColor:'#ace1af',
        //#a8e4a0
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    greenSecondRow:{
        backgroundColor:'#ace1af',
        flex:1,
        fontSize:13,
        maxWidth:'40%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    greenThirdRow:{
        backgroundColor:'#ace1af',
        flex:1,
        fontSize:13,
        maxWidth:'25%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    greenFourthRow:{
        backgroundColor:'#ace1af',
        flex:1,
        fontSize:13,
        maxWidth:'25%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    redFirstRow:{
        backgroundColor:'#FFA07A',
        flex:1,
        fontSize:13,
        maxWidth:'10%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    redSecondRow:{
        backgroundColor:'#FFA07A',
        flex:1,
        fontSize:13,
        maxWidth:'40%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    redThirdRow:{
        backgroundColor:'#FFA07A',
        flex:1,
        fontSize:13,
        maxWidth:'25%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    redFourthRow:{
        backgroundColor:'#FFA07A',
        flex:1,
        fontSize:13,
        maxWidth:'25%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    firstHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:16,
        maxWidth:'10%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    secondHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:16,
        maxWidth:'40%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    thirdHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:16,
        maxWidth:'25%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
    fourthHeader:{
        fontWeight: 'bold',
        backgroundColor: '#fff',
        flex:1,
        fontSize:16,
        maxWidth:'25%',
        height:'100%',
        textAlign:'center',
        lineHeight:40,
        color: 'black',
    },
})


