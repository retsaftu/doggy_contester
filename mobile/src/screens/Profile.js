import React, {Component} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, PermissionsAndroid} from "react-native";
import RNFetchBlob from 'rn-fetch-blob'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import DocumentPicker from "react-native-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData:{},
            isLoader:false,
            image:''
        }

    }

    async componentDidMount() {
        // console.log(`this.props.route.params.userId`, this.props.route.params.userId);
        await this.getData();
    }

    getData=async ()=>{

        let url=`http://agis.kz:5002/api/user/${this.props.route.params.userId}`;
        const image=await AsyncStorage.getItem('image');
        let urlForImage=`http://agis.kz:5002${image}`;
        if(image){
            this.setState({image:urlForImage})
        }
        await this.setState({isLoader:true})
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
                await this.setState({isLoader:false, userData:data})
            })
    }

    pickPhoto = async () => {
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
                if (Platform.OS === "android" && uri[0] === "/") {
                    uri = `file://${uri}`;
                    uri = uri.replace(/%/g, "%25");
                }
        
    
                let nameParts = name.split('.');
                let fileType = nameParts[nameParts.length - 1];
                let fileToUpload = {
                // name: name,
                // size: res.size,
                type: "application/" + fileType,
                extension:fileType,
                uri: uri
                };
                const formData = new FormData();
                formData.append('file', fileToUpload);
                console.log('form',fileToUpload);        


                const url = 'http://agis.kz:5002/api/file/image';
                const token=await AsyncStorage.getItem('token');
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
                    await AsyncStorage.setItem('image', data[0].avatar);
                })
                .catch(err=>{
                    console.log(`err`, err);
                })
                if(uri){
                    this.setState({image:uri})
                }
            })
        }
    }


    render() {
        return(
            <View style={styles.body}>
                <View style={styles.item}>
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
                    <Text style={styles.header}>{this.state.userData.name}</Text>
                    <Text style={styles.itemText}>{this.state.userData.username}</Text>
                    <Text style={styles.itemText}>{this.state.userData.email}</Text>
                </View>
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
        backgroundColor:'white',
        marginVertical:"2%",
        padding:'3%',
        paddingHorizontal:'4%',
        justifyContent:'center',
        alignItems:'center'
    },
    row:{
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical:'2%'
    },
    column:{
        flex:1,
        flexWrap: 'wrap',
        flexDirection: 'column',
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