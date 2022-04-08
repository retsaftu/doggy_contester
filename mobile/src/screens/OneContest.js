import React, {useEffect, useState, Component} from "react";
import {View, StyleSheet, ScrollView, TouchableOpacity, Text, FlatList, SectionList} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import RNFetchBlob from 'rn-fetch-blob'
import Loader from "react-native-modal-loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {backend} from '../../config/config.json'
import * as Progress from 'react-native-progress';


export default class OneContest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoader:false,
            isAuth:false,
            progress:0,
            indeterminate:true,
            startDate:new Date(2022,3,8,0,8,1),
            endDate:new Date(2022,3,8,0,8,55),
            contests:[{name:'Contest Title', date:'14:00, 28/03/2022\n3 hours', count: 50}],
            currentProblem:null
        }

    }

    async componentDidMount() {
        await this.getData();
    }
    animate() {
        // let progress = 0;
        // this.setState({ progress });
        var start = this.state.startDate,
        end = this.state.endDate,
        today = new Date();
        today.setHours(today.getHours()+6)
        console.log(`today`, today.toLocaleDateString());
        let progress = ( ( today.getTime() - start.getTime() ) / ( end.getTime() - start.getTime() ) )
        console.log(`start`, start);
        console.log(`end`, end);
        console.log(`today`, today);
        console.log(`progress`, progress);
        
        this.setState({ progress });
        setTimeout(() => {
            this.setState({indeterminate: false})
            let id=setInterval(()=>{
                if(progress>=1){
                    this.setState({ progress:1 });
                    clearInterval(id)
                } else {
                    today=new Date();
                    today.setHours(today.getHours()+6)
                    progress = ( ( today.getTime() - start.getTime() ) / ( end.getTime() - start.getTime() ) )
                    this.setState({ progress });
                    // this.animate();
                }
            },1500)
        }, 1300);
    }

    getData=async ()=>{
        this.animate()
        const token=await AsyncStorage.getItem('token');
        if(token){
            await this.setState({isAuth: true})
        }
        // let url=`http://agis.kz:5002/api/contest`;
        // await this.setState({isLoader:true})
        // await RNFetchBlob.config({
        //     trusty : true
        //     })
        //     .fetch('GET',url, {
        //     'Accept': 'application/json',
        //     'Content-Type':'application/json',
        //     // 'Authorization': 'Bearer '+token
        //     })
        //     .then(res=>res.json())
        //     .then(async (data)=>{
        //         console.log(`data`, data);
        //         await this.setState({isLoader:false, contests:data})
        //     })
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
            <>
                <ScrollView style={styles.body}>
                    <Loader loading={this.state.isLoader} color="black" size='large'/>
                    <View style={styles.item}>
                        <Text style={styles.header}>{this.props.route.params.contest.name}</Text>
                        <Progress.Bar style={styles.progressBar} progress={this.state.progress} height={11} width={null} indeterminateAnimationDuration={1000} indeterminate={this.state.indeterminate} color={'rgba(240, 5, 0, 1)'}/>
                        <View style={styles.row}>
                            <Text style={styles.itemText}>Begin: {this.state.startDate.toLocaleDateString()}</Text>
                            <Text style={styles.itemText}>End: {this.state.endDate.toLocaleDateString()}</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.row}>
                            <Text style={styles.itemText}>{this.props.route.params.contest.description}</Text>
                        </View>
                        <View style={[styles.row, {justifyContent:'space-around', marginVertical:'4%'}]}>
                            {
                                this.props.route.params.contest.tasks.map((c,i)=>{
                                    console.log(`c`, c);
                                    return(
                                        <TouchableOpacity key={i} 
                                            style={{marginHorizontal:'5%', padding:'4%', marginVertical:'4%', backgroundColor:'rgba(240, 5, 0, 1)'}}
                                            onPress={async ()=>{
                                                await this.setState({currentProblem:c})
                                            }}>
                                            <Text style={[styles.itemText, {flex:0, color:'white', fontSize:25}]}>{c.index}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                    {
                        this.state.currentProblem
                        ?
                        <View style={styles.item}>
                            <View style={styles.row}>
                                <Text style={styles.header}>{this.state.currentProblem.index}. {this.state.currentProblem.name}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.itemText}>{this.state.currentProblem.description}</Text>
                            </View>
                        </View>
                        :
                        null

                    }
                </ScrollView>
                {
                    this.state.isAuth
                    ?
                    <TouchableOpacity
                        style={styles.floatingButton}
                        // onPress={()=>{
                        //     this.props.navigation.navigate('CreateContest')
                        // }}
                    >
                        {/* <Icon name='plus' size={30} color='white' /> */}
                        <Text style={{color:'white', fontSize:18}}>Join</Text>
                    </TouchableOpacity>
                    : 
                    null
                }
            </>
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
    progressBar:{
        marginVertical:'6%',
    },
    header:{
        // flex:1,
        color:'black',
        textAlign:'center',
        textAlignVertical:'center',
        fontSize:25,
        // marginVertical:'3.5%',
        fontWeight:'bold'
    },
    item:{
        backgroundColor:'white',
        marginVertical:"2%",
        padding:'3%',
        paddingHorizontal:'4%',
        paddingVertical:"7%"
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
        fontSize:18
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