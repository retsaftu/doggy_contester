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
export default class AuthForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: 'admin',
            password: '1',
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

    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={localStyles.outerContainer}>
                <TouchableWithoutFeedback
                    onPress={Keyboard.dismiss}
                >
                    <View style={styles.container}>
                        <TouchableOpacity
                            onPress={this.SettingsHandler}
                            style={localStyles.button}
                        >
                            <Ionicons name='settings-outline' size={32} color='gray'/>
                        </TouchableOpacity>
                        <View style={styles.imagePosition}>
                            <Image source={require('../../../assets/icon.png')} style={styles.image}/>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={this.state.username}
                            onChangeText={val => this.setState({username: val})}
                            placeholder={i18n.t('Login')}
                        />
                        <TextInput
                            style={styles.input}
                            value={this.state.password}
                            secureTextEntry={true}
                            onChangeText={val => this.setState({password: val})}
                            placeholder={i18n.t('Password')}
                        />
                        <TouchableOpacity
                            onPress={this.authHandler}
                            style={styles.button}>
                            <Text style={{color:'black'}}>{i18n.t('SignIn')}</Text>
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
        borderColor: '#DDDDDD',
        position:'absolute',
        top:'4%',
        right:'4%'
    },
})
