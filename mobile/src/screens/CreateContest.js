import React, {Component} from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView,TextInput, SectionList, Button} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import CustomisableAlert, { showAlert, closeAlert } from "react-native-customisable-alert";
import Loader from "react-native-modal-loader";
import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {backend} from '../../config/config.json'
export default class CreateContest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoader:false,
            contestName:'',
            startDate:'',
            endDate:'',
            problems:[
                {title:'Problem', data:[{}]},
                // {title:'Problem', data:[{}]},
            ],
            tests:[
                {title:'Test', data:[{}]},
            ]
        }

    }

    async componentDidMount() {

    }

    successAlert=()=>{
        this.props.navigation.push('Navigator')
    }

    save=async ()=>{
        const token=await AsyncStorage.getItem('token');
        let contest={
            name: this.state.contestName,
            // description: this.state.description,
            description: '32 строка в коде тест, потом убрать',
            tasks:[]
        }
        let url=`http://${backend.host}:3000/contest`

        console.log(`contest`, contest);
        if(this.state.contestName.length>0){
            try {
                await this.setState({isLoader:true})
                await RNFetchBlob.config({
                trusty : true
                })
                .fetch('POST',url, {
                'Accept': 'application/json',
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+token
                },JSON.stringify(contest))
                .then(res=>res.json())
                .then(async (data)=>{
                    console.log(`data`, data);
                    if (data.acknowledged){
                        await this.setState({isLoader:false})
                        showAlert({
                            title: 'Success!',
                            message: data.message,
                            alertType: 'success',
                            onPress:this.successAlert
                        })
                    }else if (data.statusCode === 401){
                        await this.setState({isLoader:false})
                        showAlert({
                            title: 'Error!',
                            message: data.message,
                            alertType: 'error'
                        })
                    }
                })
            }catch (err){
                console.log(err)
                await this.setState({isLoader:false})
                showAlert({
                    title: 'Error!',
                    message: 'Problems with connection!',
                    alertType: 'error'
                })
            }
        } else {
            showAlert({
                title: 'Warning!',
                message: 'Enter all fields!',
                alertType: 'error'
            })
        } 
    }


    render() {
        return(
            <View style={styles.body}>
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
                <ScrollView 
                        nestedScrollEnabled={true}
                        style={{ flex:1}}>
                    <TextInput
                        style={styles.input}
                        value={this.state.contestName}
                        onChangeText={val => this.setState({contestName: val})}
                        placeholder={'Contest name'}
                    />
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, {flex:0.4}]}
                            value={this.state.startDate}
                            onChangeText={val => this.setState({startDate: val})}
                            placeholder={'Start date'}
                        />
                        <TextInput
                            style={[styles.input, {flex:0.4}]}
                            value={this.state.endDate}
                            onChangeText={val => this.setState({endDate: val})}
                            placeholder={'End date'}
                        />
                    </View>
                    <View>
                    <SectionList
                        // nestedScrollEnabled={true}
                        sections={this.state.problems}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => (
                            <>
                                <TextInput
                                    style={styles.input}
                                    value={item.problemName}
                                    onChangeText={val => item.problemName=val}
                                    placeholder={'Problem name'}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={item.description}
                                    onChangeText={val => item.description=val}
                                    placeholder={'Problem description'}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={item.testInput}
                                    onChangeText={val => item.testInput=val}
                                    placeholder={'Sample test input'}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={item.testOutput}
                                    onChangeText={val => item.testOutput=val}
                                    placeholder={'Sample test output'}
                                />
                                <View style={styles.row}>
                                    <TextInput
                                        style={[styles.input, {flex:0.4}]}
                                        value={item.memoryLimit}
                                        onChangeText={val => item.memoryLimit=val}
                                        placeholder={'Memory limit (MB)'}
                                    />
                                    <TextInput
                                        style={[styles.input, {flex:0.4}]}
                                        value={item.timeLimit}
                                        onChangeText={val => item.timeLimit=val}
                                        placeholder={'Time limit (sec.)'}
                                    />
                                </View>
                            </>
                        )}
                        renderSectionHeader={({ section }) => {
                            let index=this.state.problems.indexOf(section);
                            return(
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Text style={styles.header}>{section.title} {index+1}  </Text> 
                                    <TouchableOpacity onPress={async ()=>{
                                            let temp = this.state.problems;
                                            temp.push({title:'Problem', data:[{}]});
                                            await this.setState({problems:temp})
                                        }}>
                                        <Icon name="add" size={27} color='rgba(240, 5, 0, 1)'/>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                    </View>
                    <View>
                    <SectionList
                        // nestedScrollEnabled={true}
                        sections={this.state.tests}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => (
                            <>
                                <TextInput
                                    style={styles.input}
                                    value={item.testInput}
                                    onChangeText={val => item.problemName=val}
                                    placeholder={'Test input'}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={item.testOutput}
                                    onChangeText={val => item.description=val}
                                    placeholder={'Test output'}
                                />
                            </>
                        )}
                        renderSectionHeader={({ section }) => {
                            let index=this.state.tests.indexOf(section);
                            return(
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Text style={styles.header}>{section.title} {index+1}  </Text> 
                                    <TouchableOpacity onPress={async ()=>{
                                            let temp = this.state.tests;
                                            temp.push({title:'Test', data:[{}]});
                                            await this.setState({tests:temp})
                                        }}>
                                        <Icon name="add" size={27} color='rgba(240, 5, 0, 1)'/>
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                    />
                    </View>
                    <TouchableOpacity
                        onPress={this.save}
                        style={styles.button}>
                        <Text style={{color:'rgba(255, 255, 255, 1)', fontWeight:"bold"}}>Save</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    body:{
        flex:1,
        backgroundColor:'#fff',
        padding:'6%',
        paddingTop:'2%'
    },
    input:{
        shadowColor: '#000',
        shadowOffset:{
            width:0,
            height:1
        },
        marginVertical:'4%',
        paddingLeft:"6%",
        backgroundColor:'rgba(237, 241, 247, 1)',
    },
    row:{
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginVertical:'2%'
    },
    header:{
        fontSize:20,
        color:'black',
        marginVertical:'4%',
        fontWeight:'bold'
    },
    button:{
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
        marginVertical:'4%',
        paddingVertical:'5%',
    },
})
