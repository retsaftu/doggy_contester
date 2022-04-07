import React, {Component} from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView,TextInput, SectionList, Button} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import CustomisableAlert, { showAlert, closeAlert } from "react-native-customisable-alert";
import Loader from "react-native-modal-loader";
import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {backend} from '../../config/config.json'
import DateTimePicker from '@react-native-community/datetimepicker';

export default class CreateContest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoader:false,
            contestName:'',
            description:'',
            startDate:null,
            endDate:null,
            startTime:null,
            endTime:null,
            totalParticipants:null,
            showStartCalendar:false,
            showStartTime:false,
            showEndCalendar:false,
            showEndTime:false,
            problems:[
                {
                    title:'Problem', 
                    data:[
                        {
                            tests:
                            [
                                {
                                    title:'Test', 
                                    data:[
                                        {
                                            input:'',
                                            output:''
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
            ],
        }

    }

    async componentDidMount() {

    }

    successAlert=()=>{
        this.props.navigation.push('Navigator')
    }

    removeTrashFromTests=(arr)=>{
        let temp = arr.map((ob) => {
            return {
                input:ob.data[0].input,
                output:ob.data[0].output,
            }
        });
        return temp;
    }

    save=async ()=>{
        const token=await AsyncStorage.getItem('token');
        let tempTasks = this.state.problems.map((ob, i) => {
            console.log(`ob.data.tests`, ob.data[0].tests);
            return {
                index : this.toLetters(i+1),
                name: ob.data[0].problemName,
                description: ob.data[0].description,
                inputExample: ob.data[0].inputExample,
                outputExample: ob.data[0].outputExample,
                time:ob.data[0].time,
                memory:ob.data[0].memory,
                tests:this.removeTrashFromTests(ob.data[0].tests)
            }
        });
        console.log(`tempTasks`, tempTasks);

        console.log(`this.state.startTime`, this.state.startTime);
        console.log(`this.state.startDate`, this.state.startDate);
        let startHours=this.state.startTime.getHours();
        let startMinutes=this.state.startTime.getMinutes();

        let endHours=this.state.endTime.getHours();
        let endMinutes=this.state.endTime.getMinutes();

        let startDate=this.state.startDate;
        startDate.setHours(startHours);
        startDate.setMinutes(startMinutes);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);

        let endDate=this.state.endDate;
        endDate.setHours(endHours);
        endDate.setMinutes(endMinutes);
        endDate.setSeconds(0);
        endDate.setMilliseconds(0);

        let contest={
            name: this.state.contestName,
            description: this.state.description,
            total_participants: Number(this.state.totalParticipants),
            startDate: startDate,
            endDate: endDate,
            tasks:tempTasks
        }
        let url=`http://${backend.host}:3000/contest`

        console.log(`contest`, contest);

        if(this.state.contestName.length>0 && this.state.description.length>0 && 
            this.state.startDate!==null && this.state.endDate!==null && 
            this.state.totalParticipants!==null){
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
                    }else if (data.statusCode){
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

    toLetters=(num)=>{
        "use strict";
        var mod = num % 26,
            pow = num / 26 | 0,
            out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
        return pow ? toLetters(pow) + out : out;
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
                    <TextInput
                        style={styles.input}
                        value={this.state.description}
                        onChangeText={val => this.setState({description: val})}
                        placeholder={'Description'}
                    />
                    {
                        this.state.showStartCalendar
                        ?
                        <DateTimePicker
                            value={this.state.startDate}
                            mode={'date'}
                            // display="calendar"
                            onChange={(event, selectedDate)=>{
                                const currentDate = selectedDate || this.state.startDate;
                                this.setState({showStartCalendar:Platform.OS === 'ios'});
                                this.setState({startDate:currentDate});
                                // this.dateIsChanged()
                            }}
                        />
                        :
                        null
                    }
                    {
                        this.state.showStartTime
                        ?
                        <DateTimePicker
                            value={this.state.startTime}
                            mode={'time'}
                            // display="calendar"
                            onChange={(event, selectedTime)=>{
                                const currentTime = selectedTime || this.state.startTime;
                                this.setState({showStartTime:Platform.OS === 'ios'});
                                this.setState({startTime:currentTime});
                                // this.dateIsChanged()
                            }}
                        />
                        :
                        null
                    }
                    {
                        this.state.showEndCalendar
                        ?
                        <DateTimePicker
                            // testID="dateTimePicker"
                            value={this.state.endDate}
                            mode={'datetime'}
                            display="calendar"
                            // maximumDate={new Date()}
                            // minimumDate={new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                            onChange={(event, selectedDate)=>{
                                const currentDate = selectedDate || this.state.endDate;
                                this.setState({showEndCalendar:Platform.OS === 'ios'});
                                this.setState({endDate:currentDate});
                                // this.dateIsChanged()
                            }}
                        />
                        :
                        null
                    }
                    {
                        this.state.showEndTime
                        ?
                        <DateTimePicker
                            value={this.state.endTime}
                            mode={'time'}
                            // display="calendar"
                            onChange={(event, selectedTime)=>{
                                const currentTime = selectedTime || this.state.endTime;
                                this.setState({showEndTime:Platform.OS === 'ios'});
                                this.setState({endTime:currentTime});
                                // this.dateIsChanged()
                            }}
                        />
                        :
                        null
                    }
                    <View style={styles.row}>
                        <TouchableOpacity 
                            style={styles.calendar}
                            onPress={async ()=>{
                                if(this.state.startDate===null){
                                    await this.setState({startDate:new Date()})
                                }
                                this.setState({showStartCalendar:true})
                            }}>
                                {
                                    this.state.startDate===null
                                    ?
                                    <Text>Start Date</Text>
                                    :
                                    <Text>
                                        {this.state.startDate.getDate()<10?'0'+this.state.startDate.getDate():this.state.startDate.getDate()}
                                                .{(this.state.startDate.getMonth()+1)<10?'0'+(this.state.startDate.getMonth()+1):this.state.startDate.getMonth()+1}
                                                .{this.state.startDate.getFullYear()}
                                    </Text>
                                }
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.calendar}
                            onPress={async ()=>{
                                if(this.state.endDate===null){
                                    await this.setState({endDate:new Date()})
                                }
                                this.setState({showEndCalendar:true})
                            }}>
                                {
                                    this.state.endDate===null
                                    ?
                                    <Text>End Date</Text>
                                    :
                                    <Text>
                                        {this.state.endDate.getDate()<10?'0'+this.state.endDate.getDate():this.state.endDate.getDate()}
                                                .{(this.state.endDate.getMonth()+1)<10?'0'+(this.state.endDate.getMonth()+1):this.state.endDate.getMonth()+1}
                                                .{this.state.endDate.getFullYear()}
                                    </Text>
                                }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity 
                            style={styles.calendar}
                            onPress={async ()=>{
                                if(this.state.startTime===null){
                                    await this.setState({startTime:new Date()})
                                }
                                this.setState({showStartTime:true})
                            }}>
                                {
                                    this.state.startTime===null
                                    ?
                                    <Text>Start Time</Text>
                                    :
                                    <Text>
                                        {this.state.startTime.getHours()<10?'0'+this.state.startTime.getHours():this.state.startTime.getHours()}
                                                :{this.state.startTime.getMinutes()<10?'0'+this.state.startTime.getMinutes():this.state.startTime.getMinutes()}
                                    </Text>
                                }
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.calendar}
                            onPress={async ()=>{
                                if(this.state.endTime===null){
                                    await this.setState({endTime:new Date()})
                                }
                                this.setState({showEndTime:true})
                            }}>
                                {
                                    this.state.endTime===null
                                    ?
                                    <Text>End Time</Text>
                                    :
                                    <Text>
                                        {this.state.endTime.getHours()<10?'0'+this.state.endTime.getHours():this.state.endTime.getHours()}
                                                :{this.state.endTime.getMinutes()<10?'0'+this.state.endTime.getMinutes():this.state.endTime.getMinutes()}
                                    </Text>
                                }
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        keyboardType={'number-pad'}
                        value={this.state.totalParticipants}
                        onChangeText={val => this.setState({totalParticipants: val})}
                        placeholder={'Total participants'}
                    />
                    <View>
                    <SectionList
                        // nestedScrollEnabled={true}
                        sections={this.state.problems}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => {
                            // console.log(`item.tests`, item.tests);
                            return (
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
                                    value={item.inputExample}
                                    onChangeText={val => item.inputExample=val}
                                    placeholder={'Sample test input'}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={item.outputExample}
                                    onChangeText={val => item.outputExample=val}
                                    placeholder={'Sample test output'}
                                />
                                <View style={styles.row}>
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.input, {flex:0.4}]}
                                        value={item.memory}
                                        onChangeText={val => item.memory=val}
                                        placeholder={'Memory limit (MB)'}
                                    />
                                    <TextInput
                                        keyboardType={'number-pad'}
                                        style={[styles.input, {flex:0.4}]}
                                        value={item.time}
                                        onChangeText={val => item.time=val}
                                        placeholder={'Time limit (sec.)'}
                                    />
                                </View>
                                <View>
                                    <SectionList
                                        // nestedScrollEnabled={true}
                                        sections={item.tests}
                                        keyExtractor={(it, ind) => it + ind}
                                        renderItem={({item:it}) => {
                                            // console.log(`it`, it);
                                            return (
                                            <>
                                                <TextInput
                                                    style={styles.input}
                                                    value={it.input}
                                                    onChangeText={val => {
                                                        console.log(`val`, it.input);
                                                        this.forceUpdate()
                                                        return(
                                                            it.input=val
                                                        )
                                                    }}
                                                    placeholder={'Test input'}
                                                />
                                                <TextInput
                                                    style={styles.input}
                                                    value={it.output}
                                                    onChangeText={val => {
                                                        this.forceUpdate()
                                                        return(
                                                            it.output=val
                                                        )
                                                    }}
                                                    placeholder={'Test output'}
                                                />
                                            </>
                                        )}}
                                        renderSectionHeader={({ section }) => {
                                            let ind=item.tests.indexOf(section);
                                            return(
                                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                                    <Text style={styles.header}>{section.title} {ind+1}  </Text> 
                                                    <TouchableOpacity onPress={async ()=>{
                                                            item.tests.push({title:'Test', data:[{}]});
                                                            // await this.setState({tests:temp})
                                                            this.forceUpdate()
                                                        }}>
                                                        <Icon name="add" size={27} color='rgba(240, 5, 0, 1)'/>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }}
                                    />
                                </View>
                            </>
                        ) 
                        }}
                        renderSectionHeader={({ section }) => {
                            let index=this.state.problems.indexOf(section);
                            return(
                                <View style={{flexDirection:'row', alignItems:'center'}}>
                                    <Text style={styles.header}>{section.title} {this.toLetters(index+1)}  </Text> 
                                    <TouchableOpacity onPress={async ()=>{
                                            let temp = this.state.problems;
                                            temp.push({title:'Problem', data:[{
                                                tests:
                                                [
                                                    {
                                                        title:'Test', 
                                                        data:[
                                                            {
                                                                input:'',
                                                                output:''
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }]});
                                            await this.setState({problems:temp})
                                        }}>
                                        <Icon name="add" size={27} color='rgba(240, 5, 0, 1)'/>
                                    </TouchableOpacity>
                                    {
                                        this.state.problems.length===1
                                        ?
                                        null
                                        :
                                        <TouchableOpacity onPress={async ()=>{
                                                let temp = this.state.problems;
                                                temp.pop();
                                                await this.setState({problems:temp})
                                            }}>
                                            <Icon name="remove" size={27} color='rgba(240, 5, 0, 1)'/>
                                        </TouchableOpacity>
                                    }
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
    calendar:{
        shadowColor: '#000',
        shadowOffset:{
            width:0,
            height:1
        },
        marginVertical:'4%',
        paddingLeft:"6%",
        backgroundColor:'rgba(237, 241, 247, 1)',
        flex:0.4, 
        justifyContent:'center', 
        paddingVertical:'4.5%'
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
