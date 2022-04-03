import React, {Component} from "react";
import {View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView,TextInput, SectionList, Button} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'


export default class CreateContest extends Component {
    constructor(props) {
        super(props);
        this.state = {
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

    getData=async ()=>{
    }


    render() {
        return(
            <View style={styles.body}>
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
                    <Button title="sasf" onPress={()=>{
                        console.log(`this.state.problems`, this.state.problems);
                        console.log(`.data`, this.state.problems[0].data);
                        console.log(`this.state.tests`, this.state.tests);
                        console.log(`.data`, this.state.tests[0].data);
                    }}/>
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
})
