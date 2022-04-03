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
import i18n from 'i18n-js'
import RNFetchBlob from 'rn-fetch-blob'
export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email:'',
            name:'',
            isPending:false
        }
    }

    async componentDidMount() {
        //Получаем какой язык(русс, каз, англ) установлен
        await AsyncStorage.getItem('language')
            .then(language => {
                if (language) {
                    i18n.locale = language;
                } else {
                    i18n.locale = 'ru';
                }
            });
        //Сохраняем логин и пароль в AsyncStorage
        await AsyncStorage.getItem('username').then((value) => {
            if (value !== null) {
                this.setState({username: value});
            }
        }).done();
        await AsyncStorage.getItem('password').then((value) => {
            if (value !== null) {
                this.setState({password: value});
            }
        }).done();
    }

    //Функция авторизации
    authHandler = async () => {
        //Получаем url прописанный в юзером
        let item=await AsyncStorage.getItem('url')
        let url;
        //только при разработке! удалить для продакшна
        if (!item){
            item='agis.kz:5115';
            await AsyncStorage.setItem('url', item)
            url=`https://${item}/api/identity/signin`
        } else {
            url=`https://${item}/api/identity/signin`
        }
        //только при разработке! удалить для продакшна





        //Перезаписываем и сохраняем логин и пароль в один объект для авторизации
        await AsyncStorage.removeItem('username')
        await AsyncStorage.setItem('username', this.state.username)
        await AsyncStorage.removeItem('password')
        await AsyncStorage.setItem('password', this.state.password)
        let username=this.state.username
        let password=this.state.password
        let user={username, password}
        //Пост метод для авторизации, с помощью выше созданного юзера
        try {
            this.setState({isPending:true})
            await RNFetchBlob.config({
            trusty : true
            })
            .fetch('POST',url, {
            Accept: 'application/json',
            'Content-Type':'application/json'
            },JSON.stringify(user))
            .then(res=>res.json())
            .then(async (data)=>{
                let currentUser=data.data;
                await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser))
                if (data.message==='OK' && data.details==='success'){
                    this.setState({isPending:false})
                    this.props.navigation.navigate('Navigator')
                }else if (data.status === 400){
                    Alert.alert('Ошибка!', 'Неверные логин или пароль!')
                }else{
                    Alert.alert('Внимание!', 'Проблемы с соединением')
                }
            })
            .catch((e)=>{
                console.log(e)
                Alert.alert('Внимание!', 'Проверьте введен ли адрес! \n\nНеверные логин или пароль!')
            })
        }catch (err){
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
                            // onPress={this.authHandler}
                            style={localStyles.googleButton}>
                            <Image source={require('../../../assets/google.png')} style={{height:30, width:30}}/>
                            <Text style={{color:'black', fontSize:15}}>  Continue with Google</Text>
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
