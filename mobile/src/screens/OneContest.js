import React, {useEffect, useState, Component} from "react";
import {View, StyleSheet, ScrollView, TouchableOpacity, Text, PermissionsAndroid} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import RNFetchBlob from 'rn-fetch-blob'
import Loader from "react-native-modal-loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {backend} from '../../config/config.json'
import * as Progress from 'react-native-progress';
import CustomisableAlert, { showAlert, closeAlert } from "react-native-customisable-alert";
import DocumentPicker from "react-native-document-picker";


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
            contest:{name:'Contest Title', date:'14:00, 28/03/2022\n3 hours', count: 50, tasks:[]},
            currentProblem:null,
            currentUserId:'',
            contest:[],
            isParticipant:false
        }

    }

    async componentDidMount() {
        await this.getData();
    }
    animate() {
        // let progress = 0;
        // this.setState({ progress });
        var start = new Date(this.state.startDate),
        end = new Date(this.state.endDate),
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
        await this.setState({isLoader:true})
        const token=await AsyncStorage.getItem('token');
        const currentUserId=await AsyncStorage.getItem('userId');
        let url=`http://${backend.host}:${backend.port}/contest/${this.props.route.params.contest._id}`
        try{
            await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer '+token
                },
            })
            .then(res=>res.json())
            .then(async (data)=>{
                console.log(`data`, data);
                await this.setState({contest:data[0], isLoader:false})
            })
        } catch(err){
            console.log(`err`, err);
            this.setState({isLoader:false})
        }
        this.state.contest.participants.map(ob=>{
            if(ob._id===currentUserId){
                this.setState({isParticipant:true})
            }
        })
        if(token){
            console.log(`this.state.contest`, this.state.contest);
            await this.setState({
                isAuth: true, 
                currentUserId:currentUserId, 
                contest: this.state.contest,
                startDate: this.state.contest.startDate,
                endDate: this.state.contest.endDate})
        }
        let startDate=new Date(this.state.contest.startDate)
        let endDate=new Date(this.state.contest.endDate);
        await this.setState({
            renderStartDate:startDate.toLocaleDateString(),
            renderEndDate:endDate.toLocaleDateString(),
            })
        this.animate()
        await this.setState({isLoader:false})
        // let url=`http://${backend.host}:${backend.port}/contest`;
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

    joinContest=async ()=>{
        const token=await AsyncStorage.getItem('token');

        let url=`http://${backend.host}:${backend.port}/contest/joinContest/${this.state.contest._id}`
        console.log(`url`, url);
        console.log(`token`, token);
        try{
            await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer '+token
                },
            })
            .then(async (data)=>{
                this.setState({isLoader:false})
                showAlert({
                    title: 'Успешно!',
                    message: 'Вы присоединились!',
                    alertType: 'success',
                    onPress:this.successAlert
                })
            })
        } catch(err){
            console.log(`err`, err);
            this.setState({isLoader:false})
        }
    }

    successAlert=()=>{
        this.props.navigation.push('Navigator', {screen:'Home'})
    }

    uploadFile=async ()=>{
        const token=await AsyncStorage.getItem('token');
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);
        if (granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED && granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
            await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })
            .then(async response => {
                console.log('ASDASDASFD',response);
                const res=await RNFetchBlob.fs.stat(response[0].uri)
                console.log('SADFFSDF',res);
                let { name, uri } = response[0];
                console.log('SAFDSAFD',name, uri);
    
                let nameParts = name.split('.');
                let fileType = nameParts[nameParts.length - 1];
                let fileToUpload = {
                name: name,
                size: res.size,
                type: "application/"+fileType,
                extension:fileType,
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri
                };

                const formData = new FormData();
                formData.append('file', fileToUpload);
                formData.append('contestId', '60c09af61d2fc08732e62edd');
                formData.append('taskId', '60c09b891d2fc08732e62ede');
                formData.append('extension', fileType);
                console.log('form',formData);        
        
        
                let url=`http://${backend.host}:${backend.port}/api/file`

                try{
                    await fetch(url, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer '+token
                        },
                    })
                    .then(res=>res.json())
                    .then(async (data)=>{
                        console.log(`data`, data);
                        this.setState({isLoader:false})
                        // this.props.navigation.push('Navigator', {screen:'Profile', params: {userId:this.props.route.params.userId}})
                        // await AsyncStorage.setItem('image', );
                    })
                } catch(err){
                    console.log(`err`, err);
                    this.setState({isLoader:false})
                }
                
            })
            .catch(()=>{
                this.setState({isLoader:false})

            })
        }
    }


    render(){
        // return(<View></View>)
        // console.log(this.state.contest);
        return (
            <>
                <ScrollView style={styles.body}>
                    <Loader loading={this.state.isLoader} color="black" size='large'/>
                    <CustomisableAlert
                        // dismissable
                        btnStyle={{
                            backgroundColor:'rgba(240, 5, 0, 1)'
                        }}
                        titleStyle={{
                        fontSize: 24,
                        fontWeight: 'bold'
                        }}
                        textStyle={{
                            fontSize: 18,
                        }}
                        btnLabelStyle={{
                        color: 'white',
                        paddingHorizontal: 10,
                        textAlign: 'center',
                        }}
                    />
                    <View style={styles.item}>
                        <Text style={styles.header}>{this.state.contest.name}</Text>
                        <Progress.Bar style={styles.progressBar} progress={this.state.progress} height={11} width={null} indeterminateAnimationDuration={1000} indeterminate={this.state.indeterminate} color={'rgba(240, 5, 0, 1)'}/>
                        <View style={styles.row}>
                            <Text style={styles.itemText}>Begin: {this.state.renderStartDate}</Text>
                            <Text style={styles.itemText}>End: {this.state.renderEndDate}</Text>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.row}>
                            <Text style={styles.itemText}>{this.state.contest.description}</Text>
                        </View>
                        <View style={[styles.row, {justifyContent:'space-around', marginVertical:'4%'}]}>
                            {
                                this.props.route.params.contest.tasks.map((c,i)=>{
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
                            <TouchableOpacity 
                                onPress={this.uploadFile}
                                style={[styles.button, {borderRadius:30}]}>
                                <Text style={styles.buttonText}>Upload File</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        null

                    }
                </ScrollView>
                {
                    this.state.isAuth
                    ?
                    this.state.currentUserId!==this.props.route.params.contest.owner._id
                    ?
                    this.state.isParticipant
                    ?
                    null
                    :
                    <TouchableOpacity
                        style={styles.floatingButton}
                        onPress={this.joinContest}
                    >
                        <MaterialIcon name='person-add' size={30} color='white'/>
                    </TouchableOpacity>
                    : 
                    <TouchableOpacity
                        style={styles.floatingButton}
                    >
                        <Icon name='pencil' size={30} color='white'/>
                    </TouchableOpacity>
                    :null
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