import React, {Component} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, PermissionsAndroid, TextInput, ScrollView} from "react-native";
import RNFetchBlob from 'rn-fetch-blob'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import DocumentPicker from "react-native-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {backend} from '../../config/config.json'
import Loader from "react-native-modal-loader";
import CustomisableAlert, { showAlert, closeAlert } from "react-native-customisable-alert";

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData:{},
            isLoader:false,
            image:'',
            isMyProfile:false,
            isEdit:false,
            isPasswordEdit:false,
            name:'',
            username:'',
            about:'',
            oldPassword:'',
            newPassword:''
        }

    }

    async componentDidMount() {
        // console.log(`this.props.route.params.userId`, this.props.route.params.userId);
        await this.getData();
    }

    getData=async ()=>{
        const currentUserId=await AsyncStorage.getItem('userId');
        if(currentUserId===this.props.route.params.userId){
            await this.setState({isLoader:true, isMyProfile: true})
        } else {
            await this.setState({isLoader:true, isMyProfile: false})
        }
        let url=`http://${backend.host}:${backend.port}/user/${this.props.route.params.userId}`;
        const image=await AsyncStorage.getItem('image');
        let urlForImage=`http://${backend.host}:${backend.port}${image}`;
        if(image){
            this.setState({image:urlForImage})
        }
        await RNFetchBlob.config({
            trusty : true
            })
            .fetch('GET',url, {
            'Accept': 'application/json',
            'Content-Type':'application/json',
            // 'Authorization': 'Bearer '+token
            })
            .then(res=>res.json())
            .then(async (data)=>{
                console.log(`data`, data);
                if(data.avatar){
                    let str=data.avatar.split('/')
                    let url=`http://${backend.host}:${backend.port}/file/download/${str[str.length-1]}`
                    console.log(`url`, url);
                    this.setState({image:url})
                }
                await this.setState({isLoader:false, userData:data, name:data.name, email:data.email, username:data.username})
            })
    }

    pickPhoto = async () => {
        this.setState({isLoader:true})
        const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        ]);
        if (granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED && granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
            await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })
            .then(async response => {
                console.log('ASDASDASFD',response);
                const res=await RNFetchBlob.fs.stat(response[0].uri)
                console.log('SADFFSDF',res);
                let { name, uri } = response[0];
                console.log('SAFDSAFD',name, uri);
    
                // // console.log(response);
                // if (Platform.OS === "android" && uri[0] === "/") {
                //     uri = `file://${uri}`;
                //     uri = uri.replace(/%/g, "%25");
                // }
        
    
                let nameParts = name.split('.');
                let fileType = nameParts[nameParts.length - 1];
                let fileToUpload = {
                name: name,
                size: res.size,
                type: "application/"+fileType,
                extension:fileType,
                uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri
                };
                const formData = new FormData();
                formData.append('file', fileToUpload);
                console.log('form',fileToUpload);        


                const url = `http://${backend.host}:${backend.port}/file/image`;
                const token=await AsyncStorage.getItem('token');
                try{
                    await fetch(url, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'Bearer '+token
                        },
                    })
                    .then(res=>res.json())
                    .then(async (data)=>{
                        console.log(`data`, data);
                        // this.setState({isLoader:false})
                        this.props.navigation.push('Navigator', {screen:'Profile', params: {userId:this.props.route.params.userId}})
                        // await AsyncStorage.setItem('image', );
                    })
                } catch(err){
                    console.log(`err`, err);
                    this.setState({isLoader:false})
                }
                
            })
        }
    }

    save=async ()=>{
        this.setState({isLoader:true})
        const url = `http://${backend.host}:${backend.port}/user/updateUserProfile`;
        const token=await AsyncStorage.getItem('token');
        let user={
            name:this.state.name,
            username:this.state.username,
            about:this.state.about,
            avatar:''
        }
        console.log(`user`, user);
        try{
            await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(user),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+token
                },
            })
            .then(res=>res.json())
            .then(async (data)=>{
                console.log(`data`, data);
                this.setState({isLoader:false})
                showAlert({
                    title: 'Успешно!',
                    message: 'Данные были изменены!',
                    alertType: 'success',
                    onPress:this.alertPress
                })
                // await AsyncStorage.setItem('image', );
            })
        } catch(err){
            console.log(`err`, err);
            this.setState({isLoader:false})
        }
    }

    alertPress=()=>{
        this.props.navigation.push('Navigator', {screen:'Profile', params: {userId:this.props.route.params.userId}})
    }
    changePassword=async ()=>{
        this.setState({isLoader:true})
        const token=await AsyncStorage.getItem('token');
        if(this.state.newPassword.length>0 && this.state.oldPassword.length>0){
            let ob={
                oldPassword:this.state.oldPassword,
                newPassword:this.state.newPassword
            }
            let urll=`http://${backend.host}:${backend.port}/user/changePassword`
            await fetch(urll, {
                method: 'PUT',
                body: JSON.stringify(ob),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer '+token
                },
            })
            .then(res=>res.json())
            .then(async (data)=>{
                console.log(`data`, data);
                this.setState({isLoader:false})
                showAlert({
                    title: 'Успешно!',
                    message: 'Данные были изменены!',
                    alertType: 'success',
                    onPress:this.alertPress
                })
                // await AsyncStorage.setItem('image', );
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
                <View style={[styles.item,{alignItems:'center',}]}>
                    {
                        this.state.isMyProfile
                        ?
                        <TouchableOpacity onPress={()=>{
                            this.pickPhoto()
                        }}>
                            {
                                this.state.image.length>0
                                ?
                                <View style={{width:150,height:150,borderRadius:75,overflow: 'hidden'}}>
                                    <Image
                                        style={{ 
                                            flex:1,
                                            aspectRatio: 1.5, 
                                            resizeMode: 'contain'}}
                                        resizeMode='contain'
                                        source={{uri: this.state.image}}
                                    />
                                </View>
                                :
                                <Icon name='account' size={80} color='black'/>
                            }
                        </TouchableOpacity>
                        :
                        <View>
                            {
                                this.state.image.length>0
                                ?
                                <View style={{width:150,height:150,borderRadius:75,overflow: 'hidden'}}>
                                    <Image
                                        style={{ 
                                            flex:1,
                                            aspectRatio: 1.5, 
                                            resizeMode: 'contain'}}
                                        resizeMode='contain'
                                        source={{uri: this.state.image}}
                                    />
                                </View>
                                :
                                <Icon name='account' size={80} color='black'/>
                            }
                        </View>
                    }
                    <Text style={styles.header}>{this.state.userData.name}</Text>
                    <Text style={styles.itemText}>{this.state.userData.username}</Text>
                    <Text style={styles.itemText}>{this.state.userData.email}</Text>
                </View>
                {
                    this.state.isEdit
                    ?
                    <ScrollView style={[styles.item,{flex:1}]}>
                        <View style={{
                            justifyContent:'center',
                            flex:1,
                            // padding:36,
                            paddingHorizontal:"5%",
                            paddingBottom:'5%',
                            backgroundColor:'#fff',
                        }}>
                            <TextInput
                                style={[styles.input, {backgroundColor:'rgba(0, 81, 202, 0.04)'}]}
                                value={this.state.name}
                                onChangeText={val => this.setState({name: val})}
                                placeholder={'Name'}
                            />
                            <TextInput
                                style={[styles.input, {backgroundColor:'rgba(0, 81, 202, 0.04)'}]}
                                value={this.state.username}
                                onChangeText={val => this.setState({username: val})}
                                placeholder={'Username'}
                            />
                            <TextInput
                                style={[styles.input, {backgroundColor:'rgba(0, 81, 202, 0.04)'}]}
                                value={this.state.about}
                                onChangeText={val => this.setState({about: val})}
                                placeholder={'About me'}
                            />
                            <TouchableOpacity
                                    onPress={this.save}
                                    style={[styles.button, {backgroundColor:'rgba(240, 5, 0, 1)'}]}>
                                <Text style={{color:'rgba(255, 255, 255, 1)', fontWeight:"bold"}}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({isEdit:false})
                                    }}
                                    style={[styles.button, {backgroundColor:'rgba(220, 220, 220, 1)'}]}>
                                <Text style={{color:'rgba(255, 255, 255, 1)', fontWeight:"bold"}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    :
                    null
                }
                {
                    this.state.isPasswordEdit
                    ?
                    <ScrollView style={[styles.item,{flex:1}]}>
                        <View style={{
                            justifyContent:'center',
                            flex:1,
                            // padding:36,
                            paddingHorizontal:"5%",
                            paddingBottom:'5%',
                            backgroundColor:'#fff',
                        }}>
                            <TextInput
                                style={[styles.input, {backgroundColor:'rgba(0, 81, 202, 0.04)'}]}
                                value={this.state.oldPassword}
                                onChangeText={val => this.setState({oldPassword: val})}
                                placeholder={'Old Password'}
                            />
                            <TextInput
                                style={[styles.input, {backgroundColor:'rgba(0, 81, 202, 0.04)'}]}
                                value={this.state.newPassword}
                                onChangeText={val => this.setState({newPassword: val})}
                                placeholder={'New Password'}
                            />
                            <TouchableOpacity
                                    onPress={this.changePassword}
                                    style={[styles.button, {backgroundColor:'rgba(240, 5, 0, 1)'}]}>
                                <Text style={{color:'rgba(255, 255, 255, 1)', fontWeight:"bold"}}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                    onPress={()=>{
                                        this.setState({isPasswordEdit:false})
                                    }}
                                    style={[styles.button, {backgroundColor:'rgba(220, 220, 220, 1)'}]}>
                                <Text style={{color:'rgba(255, 255, 255, 1)', fontWeight:"bold"}}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    :
                    null
                }
                {
                    !this.state.isEdit
                    ?
                    <TouchableOpacity
                        style={styles.floatingButton}
                        onPress={()=>{
                            this.setState({isEdit:true})
                        }}
                    >
                        <Icon name='pencil' size={30} color='white' />
                    </TouchableOpacity>
                    : 
                    null
                }
                {
                    !this.state.isPasswordEdit
                    ?
                    <TouchableOpacity
                        style={styles.changePasswordButton}
                        onPress={()=>{
                            this.setState({isPasswordEdit:true})
                        }}
                    >
                        <Icon name='pencil-lock' size={30} color='white' />
                    </TouchableOpacity>
                    : 
                    null
                }
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
    titleHeader:{
        fontSize:20,
        color:'black',
        marginVertical:'4%',
        fontWeight:'bold'
    },
    input:{
        shadowColor: '#000',
        shadowOffset:{
            width:0,
            height:1
        },
        marginVertical:'4%',
        paddingLeft:"6%",
        // paddingHorizontal:'40%',
        // flex:1,
        backgroundColor:'rgba(237, 241, 247, 1)'
    },
    header:{
        // flex:1,
        color:'black',
        textAlign:'center',
        textAlignVertical:'center',
        fontSize:20,
        marginVertical:'3.5%',
        fontWeight:'bold',

    },
    item:{
        // flex:1,
        backgroundColor:'white',
        marginVertical:"2%",
        padding:'3%',
        paddingHorizontal:'4%',
        // justifyContent:'center',
        // alignItems:'center',
    },
    row:{
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical:'2%'
    },
    column:{
        // flex:1,
        // flexWrap: 'wrap',
        flexDirection: 'column',
        backgroundColor:'green'
        // justifyContent: 'space-between',
        // marginVertical:'2%',
    },
    itemText:{
        // flex:1,
        color:'black',
        textAlign:'center',
        textAlignVertical:'center',
        fontSize:16,

    },
    button:{
        flex:1,
        backgroundColor:'rgba(240, 5, 0, 1)',
        alignItems: "center",
        paddingVertical:'4%',
        marginVertical:'4%',
        color: 'black',
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
    },
    changePasswordButton:{
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        position: 'absolute',
        bottom: 10,
        right:90,
        height: 70,
        backgroundColor: 'rgba(240, 5, 0, 1)',
        borderRadius: 100,
    }
});