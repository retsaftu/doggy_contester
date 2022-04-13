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
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure();
export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email:'',
            name:'',
            isLoader:false,
            userInfo:{}
        }
    }

    async componentDidMount() {

    }

    successAlert=()=>{
        this.props.navigation.navigate('AuthForm')
    }

    //Функция авторизации
    googleSignUp = async () => {
        console.log('press');
        try {
            let res=await GoogleSignin.hasPlayServices();
            console.log(`res`, res);
            const userInfo = await GoogleSignin.signIn();
            this.register(userInfo)
        } catch (error) {
            console.log(`error`, error);
        }
        
    };
    register=async (user)=>{
        let username=user.user.email.split('@');
        let userForUpload={
            email: user.user.email,
            name:user.user.name,
            password: user.user.email,
            username:username[0],
            avatar:''
        }
        console.log(`user`, user);
        let url=`http://${backend.host}:${backend.port}/auth/register`
        try {
            await RNFetchBlob.config({
            trusty : true
            })
            .fetch('POST',url, {
            'Accept': 'application/json',
            'Content-Type':'application/json'
            },JSON.stringify(userForUpload))
            .then(res=>res.json())
            .then(async (data)=>{
                console.log(`data`, data);
                if (data.acknowledged){
                    await this.setState({isLoader:false})
                    showAlert({
                        title: 'Успешно!',
                        message: 'Пользователь успешно создан!',
                        alertType: 'success',
                        onPress:this.successAlert
                    })
                }else if (data.statusCode === 401){
                    await this.setState({isLoader:false})
                    showAlert({
                        title: 'Ошибка!',
                        // message: 'Неверные логин или пароль!',
                        message:data.message,
                        alertType: 'error'
                    })
                }else if (data.statusCode === 400){
                    await this.setState({isLoader:false})
                    showAlert({
                        title: 'Warning!',
                        message: data.message,
                        alertType: 'error'
                    })
                }
            })
        }catch (err){
            console.log(err)
            this.setState({isLoader:false})
            showAlert({
                title: 'Ошибка!',
                message: 'Проблемы с соединением!',
                alertType: 'error'
            })
        }
    }
    authHandler = async () => {
        let user={
            email: this.state.email,
            name:this.state.name,
            password: this.state.password,
            username:this.state.username,
            avatar:''
        }
        let url=`http://${backend.host}:${backend.port}/auth/register`
        console.log(`user`, user);
        if(this.state.email.length>0 && this.state.password.length>0 && this.state.username.length>0){
            await this.setState({isLoader:true})
            try {
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
                    if (data.acknowledged){
                        await this.setState({isLoader:false})
                        showAlert({
                            title: 'Успешно!',
                            message: 'Пользователь успешно создан!',
                            alertType: 'success',
                            onPress:this.successAlert
                        })
                    }else if (data.statusCode === 401){
                        await this.setState({isLoader:false})
                        showAlert({
                            title: 'Ошибка!',
                            // message: 'Неверные логин или пароль!',
                            message:data.message,
                            alertType: 'error'
                        })
                    }else if (data.statusCode === 400){
                        await this.setState({isLoader:false})
                        showAlert({
                            title: 'Warning!',
                            message: data.message,
                            alertType: 'error'
                        })
                    }
                })
            }catch (err){
                console.log(err)
                this.setState({isLoader:false})
                showAlert({
                    title: 'Ошибка!',
                    message: 'Проблемы с соединением!',
                    alertType: 'error'
                })
            }
        } else {
            this.setState({isLoader:false})
            showAlert({
                title: 'Внимание!',
                message: 'Введите все необходимые поля!',
                alertType: 'error'
            })
        } 
    }
    

    //Переход на страницу настроек
    SettingsHandler = async () => {
        await this.props.navigation.navigate('StartSettings')
    }

    signIn=async ()=>{
        this.props.navigation.navigate('AuthForm')
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
                            style={localStyles.input}
                            value={this.state.name}
                            onChangeText={val => this.setState({name: val})}
                            placeholder={'Name'}
                        />
                        <TextInput
                            style={localStyles.input}
                            value={this.state.username}
                            onChangeText={val => this.setState({username: val})}
                            placeholder={'Username*'}
                        />
                        <TextInput
                            style={localStyles.input}
                            value={this.state.email}
                            onChangeText={val => this.setState({email: val})}
                            placeholder={'Email*'}
                        />
                        <TextInput
                            style={localStyles.input}
                            value={this.state.password}
                            secureTextEntry={true}
                            onChangeText={val => this.setState({password: val})}
                            placeholder={'Password*'}
                        />
                        {
                            this.state.username.length>0 && this.state.password.length>0 &&
                            this.state.email.length>0
                            ?
                            <TouchableOpacity
                                onPress={this.authHandler}
                                style={[localStyles.button, {backgroundColor:'rgba(240, 5, 0, 1)'}]}>
                                <Text style={{color:'rgba(255, 255, 255, 1)', fontWeight:"bold"}}>Register</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={this.authHandler}
                                style={[localStyles.button,{backgroundColor:'rgba(220, 220, 220, 1)'}]}>
                                <Text style={{color:'rgba(163, 163, 163, 1)', fontWeight:"bold"}}>Register</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity
                            style={localStyles.parent}
                            onPress={this.signIn}
                        >     
                            <Text style={{color:"#A3A3A3", fontSize:15}}>Have an account? </Text>
                            <Text style={{color:"black", fontSize:15}}>Sign in</Text>
                        </TouchableOpacity>
                        
                        <View style={localStyles.lineSeparator}>
                            <View style={localStyles.line} />
                            <View>
                                <Text style={localStyles.orText}>OR</Text>
                            </View>
                            <View style={localStyles.line} />
                        </View>
                        <TouchableOpacity
                            onPress={this.googleSignUp}
                            style={localStyles.googleButton}>
                            <Image source={require('../../../assets/google.png')} style={{height:30, width:30}}/>
                            <Text style={{color:'black', fontSize:15}}>  Sign up with Google</Text>
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
    input:{
        shadowColor: '#000',
        shadowOffset:{
            width:0,
            height:1
        },
        marginVertical:'4%',
        paddingLeft:"6%",
        backgroundColor:'rgba(237, 241, 247, 1)'
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
        justifyContent: 'center',
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
