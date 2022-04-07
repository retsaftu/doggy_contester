import React, {Component} from "react";
import {
    TextInput,
    View,
    StyleSheet,
    Text,
    Alert,
    Image,
    TouchableOpacity,
    Platform,
    Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback,
    PermissionsAndroid
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../../css/GlobalStyles'
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomisableAlert, { showAlert, closeAlert } from "react-native-customisable-alert";
import Loader from "react-native-modal-loader";
import RNFetchBlob from 'rn-fetch-blob'
import {backend} from '../../../config/config.json'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SmsAndroid from 'react-native-get-sms-android';

export default class AuthWithPhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone:'',
            isPending:false,
            isLoader:false,
            granted:false,
            codeSent:false,
            sms:'',
            smsToCheck:''
        }
    }

    async componentDidMount() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.SEND_SMS,
        );
        if(granted===PermissionsAndroid.RESULTS.GRANTED){
            this.setState({granted:true})
        } else {
            this.setState({granted:false})
        }

        //Получаем какой язык(русс, каз, англ) установлен
        // await AsyncStorage.getItem('language')
        //     .then(language => {
        //         if (language) {
        //             i18n.locale = language;
        //         } else {
        //             i18n.locale = 'ru';
        //         }
        //     });
        // //Сохраняем логин и пароль в AsyncStorage
        // await AsyncStorage.getItem('username').then((value) => {
        //     if (value !== null) {
        //         this.setState({username: value});
        //     }
        // }).done();
        // await AsyncStorage.getItem('password').then((value) => {
        //     if (value !== null) {
        //         this.setState({password: value});
        //     }
        // }).done();
    }

    //Функция авторизации
    sendCode = async () => {
        if(this.state.granted){
            let phoneNumbers = {
                "addressList": [this.state.phone.toString()]
            };
            let sms=Math.floor(1000 + Math.random() * 9000);
            this.setState({smsToCheck:sms})
            console.log(`sms`, sms);
            console.log(`JSON.stringify(phoneNumbers),`, JSON.stringify(phoneNumbers),);
            SmsAndroid.autoSend(
                JSON.stringify(phoneNumbers),
                sms.toString(),
                (fail) => {
                    console.log(`fail`, fail);
                    showAlert({
                        title: 'Ошибка!',
                        message: 'Что то пошло не так! Повторите попытку!',
                        alertType: 'error'
                    })
                },
                (success) => {
                    console.log('success');
                    this.setState({codeSent:true})
                },
            );
        } else {
            showAlert({
                title: 'Ошибка!',
                message: 'Вы не дали доступ к отправке смс!',
                alertType: 'error'
            })
        }
    }
    authHandler = async () => {
        console.log(`this.state.smsToCheck`, this.state.smsToCheck);
        console.log(`this.state.my`, this.state.sms);
        if(this.state.sms.toString()===this.state.smsToCheck.toString()){
            await this.props.navigation.navigate('Navigator')
        } else {
            showAlert({
                title: 'Внимание!',
                message: 'Вы ввели неправильный код!',
                alertType: 'error'
            })
        }
    }

    //Переход на страницу настроек
    SettingsHandler = async () => {
        await this.props.navigation.navigate('StartSettings')
    }

    register=async ()=>{
        this.props.navigation.navigate('Registration')
    }

    render() {
        return (
            <View
                // behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={localStyles.outerContainer}>
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
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <View style={styles.container}>
                        {/* <TouchableOpacity
                            onPress={this.SettingsHandler}
                            style={localStyles.settingsButton}
                        >
                            <Ionicons name='settings-outline' size={32} color='gray'/>
                        </TouchableOpacity> */}
                        <View style={styles.imagePosition}>
                            <Image source={require('../../../assets/logo.png')} style={styles.image}/>
                        </View>
                        {
                            this.state.codeSent
                            ?
                            <TextInput
                                keyboardType='number-pad'
                                style={[styles.input, {backgroundColor:'rgba(0, 81, 202, 0.04)'}]}
                                value={this.state.sms}
                                onChangeText={val => this.setState({sms: val})}
                                placeholder={'Enter your code'}
                            />
                            :
                            <TextInput
                                keyboardType='number-pad'
                                style={[styles.input, {backgroundColor:'rgba(0, 81, 202, 0.04)'}]}
                                value={this.state.phone}
                                onChangeText={val => this.setState({phone: val})}
                                placeholder={'Enter your phone number'}
                            />
                        }                        
                        {
                            this.state.codeSent
                            ?
                            <TouchableOpacity
                                onPress={this.authHandler}
                                // onPress={()=>{this.props.navigation.navigate('Navigator')}}
                                style={[localStyles.button, {backgroundColor:'rgba(240, 5, 0, 1)'}]}>
                                <Text style={{color:'rgba(255, 255, 255, 1)', fontWeight:"bold"}}>Login</Text>
                            </TouchableOpacity>
                            :
                            this.state.phone.length>0
                            ?
                            <TouchableOpacity
                                onPress={this.sendCode}
                                // onPress={()=>{this.props.navigation.navigate('Navigator')}}
                                style={[localStyles.button, {backgroundColor:'rgba(240, 5, 0, 1)'}]}>
                                <Text style={{color:'rgba(255, 255, 255, 1)', fontWeight:"bold"}}>Send code</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={this.sendCode}
                                // onPress={()=>{this.props.navigation.navigate('Navigator')}}
                                style={[localStyles.button,{backgroundColor:'rgba(220, 220, 220, 1)'}]}>
                                <Text style={{color:'rgba(163, 163, 163, 1)', fontWeight:"bold"}}>Send code</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.navigation.navigate('AuthForm')
                            }}
                            style={localStyles.googleButton}>
                            <MaterialIcons name='arrow-back'
                                color={'black'}
                                size={25}
                            />
                            <Text style={{color:'black', fontSize:18}}>  Go back</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const localStyles=StyleSheet.create({
    outerContainer:{
        flex:1
    },
    settingsButton:{
        backgroundColor: 'white',
        alignItems: "center",
        borderColor: '#DDDDDD',
        position:'absolute',
        top:'4%',
        right:'4%'
    },
    button:{
        // marginHorizontal:'0%',
        backgroundColor: 'white',
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
        // backgroundColor:'#E5E5E5'
    },
    parent:{
        // flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical:"2%"
    },
    child:{
        color:'rgba(0, 0, 0, 1)',
        fontSize:15
    },
    orText:{
        width: 50, 
        fontSize:16, 
        textAlign: 'center', 
        color:'black', 
        fontWeight: '500'
    },
    googleButton:{
        backgroundColor: 'white',
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
        paddingVertical:'3%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent:'center'
    },
    guestButton:{
        backgroundColor: 'white',
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
        marginVertical:'2%',
        paddingVertical:'3%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent:'center'
    },
    lineSeparator:{
        flexDirection: 'row', 
        alignItems: 'center', 
        marginVertical:'3%'
    },
    line:{
        flex: 1,
        height: 1, 
        backgroundColor: 'black'
    }
})
