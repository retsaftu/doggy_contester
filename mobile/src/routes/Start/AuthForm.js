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
    Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from '../../css/GlobalStyles'
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomisableAlert, { showAlert, closeAlert } from "react-native-customisable-alert";
import Loader from "react-native-modal-loader";
import RNFetchBlob from 'rn-fetch-blob'
import {backend} from '../../../config/config.json'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class AuthForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isPending:false,
            isLoader:false,

        }
    }

    async componentDidMount() {
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
    authHandler = async () => {
        console.log(`backend`, backend);
        let user={
            email: this.state.email,
            password: this.state.password
        }
        let url=`http://${backend.host}:3000/auth/login`
        console.log(`url`, url);

        console.log(`user`, user);
        if(this.state.email.length>0 && this.state.password.length>0){
            try {
                await this.setState({isLoader:true})
                await RNFetchBlob.config({
                trusty : true
                })
                .fetch('POST',url, {
                'Accept': 'application/json',
                'Content-Type':'application/json'
                },JSON.stringify(user))
                .then(res=>res.json())
                .then(async (data)=>{
                    console.log(`data`, data);
                    if (data.access_token){
                        await AsyncStorage.setItem('token', data.access_token)
                        await this.setState({isLoader:false})
                        this.props.navigation.navigate('Navigator')
                    }else if (data.statusCode === 401){
                        await this.setState({isLoader:false})
                        showAlert({
                            title: 'Ошибка!',
                            message: data.message,
                            alertType: 'error'
                        })
                    }
                })
            }catch (err){
                console.log(err)
                await this.setState({isLoader:false})
                showAlert({
                    title: 'Ошибка!',
                    message: 'Проблемы с соединением!',
                    alertType: 'error'
                })
            }
        } else {
            showAlert({
                title: 'Внимание!',
                message: 'Введите все поля!',
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
                        <TextInput
                            style={[styles.input, {backgroundColor:'rgba(0, 81, 202, 0.04)'}]}
                            value={this.state.email}
                            onChangeText={val => this.setState({email: val})}
                            placeholder={'Email'}
                        />
                        
                        <TextInput
                            style={[styles.input, {backgroundColor:'rgba(237, 241, 247, 1)'}]}
                            value={this.state.password}
                            secureTextEntry={true}
                            onChangeText={val => this.setState({password: val})}
                            placeholder={'Password'}
                        />
                        {
                            this.state.email.length>0 && this.state.password.length>0
                            ?
                            <TouchableOpacity
                                onPress={this.authHandler}
                                // onPress={()=>{this.props.navigation.navigate('Navigator')}}
                                style={[localStyles.button, {backgroundColor:'rgba(240, 5, 0, 1)'}]}>
                                <Text style={{color:'rgba(255, 255, 255, 1)', fontWeight:"bold"}}>Login</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={this.authHandler}
                                // onPress={()=>{this.props.navigation.navigate('Navigator')}}
                                style={[localStyles.button,{backgroundColor:'rgba(220, 220, 220, 1)'}]}>
                                <Text style={{color:'rgba(163, 163, 163, 1)', fontWeight:"bold"}}>Login</Text>
                            </TouchableOpacity>
                        }
                        <View style={localStyles.parent}>
                            <TouchableOpacity
                                onPress={this.register}
                            >                                
                                <Text style={localStyles.child}>Sign up</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                // onPress={this.authHandler}
                            >
                                <Text style={localStyles.child}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={localStyles.lineSeparator}>
                            <View style={localStyles.line} />
                            <View>
                                <Text style={localStyles.orText}>OR</Text>
                            </View>
                            <View style={localStyles.line} />
                        </View>
                        <TouchableOpacity
                            // onPress={this.authHandler}
                            style={localStyles.googleButton}>
                            <Image source={require('../../../assets/google.png')} style={{height:30, width:30}}/>
                            <Text style={{color:'black', fontSize:15}}>  Sign in with Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.navigation.navigate('Navigator')
                            }}
                            style={localStyles.guestButton}>
                            <MaterialIcons name='account-circle'
                                color={'black'}
                                size={30}
                            />
                            <Text style={{color:'black', fontSize:15}}>  Continue as guest</Text>
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
        paddingVertical:'5%',
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
        paddingVertical:'5%',
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
