import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
const Profile4 = ({navigation}) => {
    const curUser = useSelector(state => state.userReducer.currentUser)
    const [name,setname] =useState(null);

    const getCurrentUser = async()=>{
        const userInfo = await firestore().collection('users').doc(curUser).get()
        console.log("User$$",userInfo.data().name)
        setname(userInfo.data().name)
        
    }
    useEffect(()=>{
        
      
        getCurrentUser()
            },[])

    return (
       <ScrollView style={{flex:1,backgroundColor:'#2e3137'}}>
        <View >
        <Text style={styles.heading}>Complete Profile 4</Text>
        <Image style={{ resizeMode: 'contain',alignSelf:'center',width:360,height:130,margin:0,}} source={require("../Images/indicator4.png")} />

      <View  style={{marginTop:'16%',}}>
      <Text style={{color:'#f2994a',fontSize:20, justifyContent:'center',textAlign:'center',fontWeight:'600'}}>{name},
      <Text style={{color:'#fff',fontSize:17, justifyContent:'center',textAlign:'center' }}> Your Profile is Ready</Text>
      </Text>
      
      </View>
      
      <View style={{alignSelf:'center',marginTop:'20%',marginBottom:'13%',}}>
      <Image style={{ resizeMode: 'contain',alignSelf:'center',marginTop:20,}} source={require("../Images/done.png")} />

      
      </View>
      <View style={{marginTop:'7%',marginBottom:'12%'}}>
      <TouchableOpacity style={styles.submitContainer} onPress={()=>navigation.navigate('Home')}>
                        <Text
                            style={[
                                styles.text,{color: "#FFF", fontWeight: "600", fontSize: 17,fontFamily: "sans-serif"  }]}  >
                            Continue
                        </Text>
                    </TouchableOpacity></View>
      </View></ScrollView>
    
    
    
    )
    }
    
    export default Profile4
    
    const styles = StyleSheet.create({
    
    heading:{
        marginTop:'22%',
            color:'#fa9f4b',
    textAlign:'center',
    fontWeight:'800',
    fontSize:20,
    fontFamily:'lucida grande',
    },
    submitContainer: {
        marginTop:'19%',
        backgroundColor: "#f2994a",
        fontSize: 17,
        borderRadius: 4,
        paddingVertical: 12,
        borderRadius:12,
        marginLeft:34,
        marginRight:34,
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        shadowColor: "rgba(255, 22, 84, 0.24)",
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
        margin:10,
        marginBottom:'3%',

    
    },
  


    
    })