import React, {useEffect, useState, Component} from "react";
import {View, StyleSheet, ScrollView, TouchableOpacity, Text, FlatList, SectionList} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myContests:[{name:'Contest Title', date:'14:00, 28/03/2022\n3 hours', count: 50}],
            activeContests:[{name:'Contest Title', date:'14:00, 28/03/2022\n3 hours', count: 50},{name:'Contest Title', date:'14:00, 28/03/2022\n3 hours', count: 50}],
            currentContests:[{name:'Contest Title', date:'14:00, 28/03/2022\n3 hours', count: 50},{name:'Contest Titlelll', date:'14:00, 28/03/2022\n3 hours', count: 50},{name:'Contest Title', date:'14:00, 28/03/2022\n3 hours', count: 50}]
        }

    }
    
    render(){

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
                            <View style={styles.row}>
                                <Text style={styles.itemText}>{item.name}</Text>
                                <Text style={styles.itemText}>{item.date}</Text>
                            </View>
                            <View style={styles.row}>
                                <View style={styles.textIcon}>
                                    <Text style={[styles.itemText, {flex:0}]}>{item.count}  </Text>
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
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.header}>{title}</Text>
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