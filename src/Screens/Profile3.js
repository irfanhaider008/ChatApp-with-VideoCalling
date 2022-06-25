import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux'
const Profile3 = ({navigation}) => {
    const [name,setName] =useState(null);
    const curUser = useSelector(state => state.userReducer.currentUser)

    const onContinue = ()=>{

        firestore().collection('users').doc(curUser).update({
                         
            name:name,
        })  
                navigation.navigate('Profile4')
        
        
            }
    return (
        <ScrollView style={{flex:1,backgroundColor:'#2e3137'}}>
        <View >
        <Text style={styles.heading}>Complete Profile 3</Text>
        <Image style={{ resizeMode: 'contain',alignSelf:'center',width:360,height:130,margin:0,}} source={require("../Images/indicator3.png")} />
      <View style={{marginTop:'15%'}}>
      <Text style={{color:'#fff',fontSize:15, justifyContent:'center',textAlign:'center' }}>Type Your Name</Text>
      <TextInput style={styles.inputStyle}
        placeholderTextColor={'white'}
        onChangeText={setName}
        value={name}
        />
      </View>
      
      <View style={{alignSelf:'center',marginTop:'28%',marginBottom:'19%',}}>

      <TouchableOpacity  onPress={()=>navigation.navigate('Profile4')}>
<Text style={{color:'white',fontSize: 17}}>Skip</Text> 

</TouchableOpacity>
      </View>
      <View style={{marginTop:'6%',marginBottom:'12%'}}>
      <TouchableOpacity style={styles.submitContainer} onPress={onContinue}>
                        <Text
                            style={[
                                styles.text,{color: "#FFF", fontWeight: "600", fontSize: 17,fontFamily: "sans-serif"  }]}  >
                            Continue
                        </Text>
                    </TouchableOpacity></View>
      </View></ScrollView>
    
    
    
    )
    }
    
    export default Profile3
    
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


   
    inputStyle:{
        padding:10,
        color:'#fff',
        borderRadius:15,
        width:'85%',
        fontSize:17,
        fontFamily: 'sans-serif',
        borderColor: '#f2994a', borderWidth: 2,
        marginLeft:34,
        marginRight:34,
        marginTop:20
        
        },

    
    })