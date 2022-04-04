import React, {useEffect, useState, Component} from "react";
import {View, StyleSheet, ScrollView, TouchableOpacity, Text, FlatList, SectionList} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RNFetchBlob from 'rn-fetch-blob'
import Loader from "react-native-modal-loader";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Contests extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoader:false,
            contests:[{name:'Contest Title', date:'14:00, 28/03/2022\n3 hours', count: 50}],
        }

    }

    async componentDidMount() {
        await this.getData();
    }

    getData=async ()=>{
        let url='http://192.168.1.121:3000/contest';
        const token=await AsyncStorage.getItem('token');
        await this.setState({isLoader:true})
        await RNFetchBlob.config({
            trusty : true
            })
            .fetch('GET',url, {
            'Accept': 'application/json',
            'Content-Type':'application/json',
            'Authorization': 'Bearer '+token
            })
            .then(res=>res.json())
            .then(async (data)=>{
                console.log(`data`, data);
                await this.setState({isLoader:false, contests:data})
            })
    }

    handleRefresh=async ()=>{
        this.setState({
            isLoader:true
        },()=>{
            this.getData()
        })
    }

    render(){
        return (
            <View style={styles.body}>
                <Loader loading={this.state.isLoader} color="black" size='large'/>
                <FlatList
                    data={this.state.contests}
                    extraData={this.state.data}
                    refreshing={this.state.isLoader}
                    onRefresh={this.handleRefresh}
                    keyExtractor={(item, index) => item + index}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <View style={styles.row}>
                                <Text style={styles.itemText}>{item.name}</Text>
                                <Text style={styles.itemText}>{item.description}</Text>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.textIcon}>
                                    <Text style={[styles.itemText, {flex:0}]}>50  </Text>
                                    <Icon name='account' size={25} color='black'/>
                                </View>
                                <View style={[styles.textIcon, {flexDirection:'column'}]}>
                                    <Icon name='account' size={25} color='black'/>
                                    <Text style={{color:'black'}}>Owner</Text>
                                </View>
                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        Enter
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
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
}

const styles = StyleSheet.create({
    body:{
        flex:1,
        backgroundColor:'#EDF1F7',
        paddingLeft:'5%',
        paddingRight:'5%',
        paddingBottom:'5%',
    },
    header:{
        fontSize:20,
        color:'black',
        marginVertical:'4%',
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