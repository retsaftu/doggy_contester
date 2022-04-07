import React, {useEffect, useState, Component} from "react";
import {View, StyleSheet, ScrollView, TouchableOpacity, Text, FlatList, SectionList} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {backend} from '../../config/config.json'
import RNFetchBlob from 'rn-fetch-blob'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth:false,
            myContests:[],
            activeContests:[],
            currentContests:[]
        }

    }

    async componentDidMount() {
        await this.getData();
    }

    getData=async ()=>{
        const token=await AsyncStorage.getItem('token');
        // const userId=await AsyncStorage.getItem('userId');
        if(token){
            await this.setState({isAuth: true, isLoader:true})
        
            let urlForMyContests=`http://${backend.host}:3000/contest/myContests`;
            await RNFetchBlob.config({
                trusty : true
                })
                .fetch('GET',urlForMyContests, {
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+token
                })
                .then(res=>res.json())
                .then(async (data)=>{
                    console.log(`myContests`, data);
                    await this.setState({isLoader:false, myContests:data})
                });


            let urlForMyActive=`http://${backend.host}:3000/contest/myActiveContests`;
            await RNFetchBlob.config({
                trusty : true
                })
                .fetch('GET',urlForMyActive, {
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+token
                })
                .then(res=>res.json())
                .then(async (data)=>{
                    console.log(`myActiveContests`, data);
                    await this.setState({isLoader:false, activeContests:data})
                });

            let urlForCurrent=`http://${backend.host}:3000/contest/currentContests`;
            await RNFetchBlob.config({
                trusty : true
                })
                .fetch('GET',urlForCurrent, {
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+token
                })
                .then(res=>res.json())
                .then(async (data)=>{
                    console.log(`currentContests`, data);
                    await this.setState({isLoader:false, currentContests:data})
                })
        } else {
            let urlForCurrent=`http://${backend.host}:3000/contest/currentContests`;
            await RNFetchBlob.config({
                trusty : true
                })
                .fetch('GET',urlForCurrent, {
                'Accept': 'application/json',
                'Content-Type':'application/json',
                // 'Authorization': 'Bearer '+token
                })
                .then(res=>res.json())
                .then(async (data)=>{
                    console.log(`currentContests`, data);
                    await this.setState({isLoader:false, currentContests:data})
                })
        }
    }
    
    render(){
        if(this.state.isAuth){
            return (
                <View style={styles.body}>
                    <SectionList
                        sections={[
                            {title:'My Contests', data: this.state.myContests}, 
                            {title:'Active Contests', data: this.state.activeContests},
                            {title:'Currently running contests', data: this.state.currentContests}
                        ]}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={styles.header}>{item.name}</Text>
                                <View style={styles.row}>
                                    <View style={styles.textIcon}>
                                        <Text style={[styles.itemText, {flex:0}]}>{item.count}  </Text>
                                        <Icon name='account' size={25} color='black'/>
                                    </View>
                                    <View style={[styles.textIcon, {flexDirection:'column'}]}>
                                        <Icon name='account' size={25} color='black'/>
                                        <Text style={{color:'black'}}>Owner</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        Enter
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.titleHeader}>{title}</Text>
                        )}
                    />
                    <TouchableOpacity
                        style={styles.floatingButton}
                        onPress={()=>{
                            this.props.navigation.navigate('CreateContest')
                        }}
                    >
                        <Icon name='plus' size={30} color='white' />
                    </TouchableOpacity>
                </View>
            )
        }
        else{
            return (
                <View style={styles.body}>
                    <SectionList
                        sections={[
                            {title:'Currently running contests', data: this.state.currentContests}
                        ]}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={styles.header}>{item.name}</Text>
                                <View style={styles.row}>
                                    <View style={styles.textIcon}>
                                        <Text style={[styles.itemText, {flex:0}]}>{item.count}  </Text>
                                        <Icon name='account' size={25} color='black'/>
                                    </View>
                                    <View style={[styles.textIcon, {flexDirection:'column'}]}>
                                        <Icon name='account' size={25} color='black'/>
                                        <Text style={{color:'black'}}>Owner</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        Enter
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={styles.titleHeader}>{title}</Text>
                        )}
                    />
                </View>
            )
        }

        
    }
}

const styles = StyleSheet.create({
    body:{
        flex:1,
        backgroundColor:'#EDF1F7',
        paddingLeft:'5%',
        paddingRight:'5%',
        paddingBottom:'5%',
    },
    titleHeader:{
        fontSize:20,
        color:'black',
        marginVertical:'4%',
        fontWeight:'bold'
    },
    header:{
        flex:1,
        color:'black',
        textAlign:'center',
        textAlignVertical:'center',
        fontSize:20,
        marginVertical:'3.5%',
        fontWeight:'bold'
    },
    item:{
        backgroundColor:'white',
        marginVertical:"2%",
        padding:'3%',
        paddingHorizontal:'4%'
    },
    row:{
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical:'2%'
    },
    itemText:{
        flex:1,
        color:'black',
        textAlign:'center',
        textAlignVertical:'center',
        fontSize:16
    },
    button:{
        flex:1,
        backgroundColor:'rgba(240, 5, 0, 1)',
        alignItems: "center",
        padding: 10,
        color: 'black',
        borderColor: '#DDDDDD',
        borderWidth:1,
        borderStyle:'solid',
        borderBottomWidth: 0.3,
        shadowColor: '#000',
        shadowOffset:{
            width:0,
            height:1
        },
        textAlign:'center',
    }, 
    buttonText:{
        color:'rgba(255, 255, 255, 1)', 
        fontWeight:"bold"
    },
    textIcon:{
        flex:0.5, 
        flexDirection:'row', 
        justifyContent:'center', 
        alignItems:'center'
    },
    floatingButton:{
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        position: 'absolute',
        bottom: 10,
        right: 10,
        height: 70,
        backgroundColor: 'rgba(240, 5, 0, 1)',
        borderRadius: 100,
    }
});