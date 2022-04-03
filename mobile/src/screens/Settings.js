import React, {Component, useEffect, useState} from "react";
import {
    TextInput,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback, Keyboard
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../css/GlobalStyles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {en} from '../translation/Translation'
import {ru} from '../translation/Translation'
import i18n from 'i18n-js'
// import {Restart} from "fiction-expo-restart";
import Ionicons from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

i18n.translations={ru,en};

//Компонент идентичный с StartSettings, только тут переход происходит не на страницу авторизации
//а на главную страницу
export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
            modalOpen: false,
        }
    }

    async componentDidMount() {
        await AsyncStorage.getItem('language')
            .then(language => {
                if (language) {
                    i18n.locale = language;
                } else {
                    i18n.locale = 'ru';
                }
            });

        await AsyncStorage.getItem('url')
            .then((value) => {
                if (value !== null) {
                    this.setState({url: value});
                }
            }).done();
    }


    urlHandler = async () => {
        await AsyncStorage.removeItem('url')
        await AsyncStorage.setItem('url', this.state.url)
            .then(data=>{
                // Restart()
            })
            .catch(err=>{
                console.log(err)
            })
        await this.props.navigation.navigate('Home')
    }
    ChangeEn = async () => {
        await AsyncStorage.setItem('language', 'en')
            .then(data => {
                // Restart()
            })
            .catch(err => {
                console.log("err");
            });
    }
    ChangeRu = async () => {
        await AsyncStorage.setItem('language', 'ru')
            .then(data => {
                // Restart()
            })
            .catch(err => {
                console.log("err");
            });
    }
    ChangeKz = async () => {
        await AsyncStorage.setItem('language', 'kz')
            .then(data => {
                // Restart()
            })
            .catch(err => {
                console.log("err");
            });
    }
    OpenModal = () => {
        this.setState({modalOpen: true})
    }
    CloseModal = () => {
        this.setState({modalOpen: false})
    }

    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={localStyles.outerContainer}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <View style={styles.container}>
                        <TouchableOpacity onPress={this.OpenModal} style={localStyles.modalButton}>
                            <Icon name='web'
                                  color='black'
                                  size={32}
                            />
                        </TouchableOpacity>
                        <Modal isVisible={this.state.modalOpen}>
                            <View style={localStyles.modalPosition}>
                                <TouchableOpacity onPress={this.CloseModal} style={localStyles.backModal}>
                                    <Ionicons name='arrow-back' size={32} color='gray'/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.ChangeEn} style={{flexDirection: 'row'}}>
                                    <Text style={localStyles.modalText}>English</Text>
                                    <Image source={require('../../assets/en.png')} style={localStyles.imageModal}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.ChangeRu} style={{flexDirection: 'row'}}>
                                    <Text style={localStyles.modalText}>Русский</Text>
                                    <Image source={require('../../assets/ru.png')} style={localStyles.imageModal}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.ChangeKz} style={{flexDirection: 'row'}}>
                                    <Text style={localStyles.modalText}>Қазақша</Text>
                                    <Image source={require('../../assets/kz.png')} style={localStyles.imageModal}/>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                        <View style={styles.imagePosition}>
                            <Image source={require('../../assets/icon.png')} style={styles.image}/>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={this.state.url}
                            onChangeText={val => this.setState({url: val})}
                            placeholder={i18n.t('URL')}/>
                        <TouchableOpacity
                            onPress={this.urlHandler}
                            style={styles.button}>
                            <Text>{i18n.t('Save')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
    }
}
const localStyles=StyleSheet.create({
    outerContainer:{
      flex:1
    },
    button:{
        backgroundColor: 'white',
        alignItems: "center",
        color: 'black',
        borderColor: '#DDDDDD',
        position:'absolute',
        top:'4%',
        left:'4%'
    },
    modalButton:{
        backgroundColor: 'white',
        alignItems: "center",
        color: 'black',
        borderColor: '#DDDDDD',
        position:'absolute',
        top:'4%',
        right:'4%'
    },
    modalPosition:{
        backgroundColor:'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '40%'
    },
    modalText:{
        fontSize:20,
        paddingRight:5
    },
    backModal:{
        backgroundColor: 'white',
        alignItems: "center",
        color: 'black',
        borderColor: '#DDDDDD',
        position:'absolute',
        top:'4%',
        left:'4%'
    },
    imageModal:{
        height:35, width:35
    }
})