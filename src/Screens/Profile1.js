import { StyleSheet, Text, View,Image,TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';

const Profile1 = ({navigation}) => {
    const curUser = useSelector(state => state.userReducer.currentUser)
    console.log('CUrent Use ',curUser)

    
  const[pressedMale, setPressedMale] = useState(false);
  const[pressedFemale, setPressedFemale] = useState(false);
const[gender,setGender] = useState('not selected')

  const onPressMale = () =>{
    setPressedFemale(false)
    setPressedMale(true);
    setGender("male")
   
  };

  const onPressFemale = () =>{
      setPressedMale(false)
    setPressedFemale(true);
    setGender("female")
   
  };


    const onContinue = ()=>{
console.log("Gender",gender)
firestore().collection('users').doc(curUser).update({
                 
    gender:gender,
})  
        navigation.navigate('Profile2')


    }
    const nextScreen = ()=>{
        navigation.navigate('Profile2')
    }
    
  return (
      <ScrollView style={{flex:1,backgroundColor:'#2e3137'}}>
    <View >
    <Text style={styles.heading}>Complete Profile</Text>
  <Image style={{ resizeMode: 'contain',alignSelf:'center',width:360,height:130,margin:0,}} source={require("../Images/indicator1.png")} />
  <View style={{flexDirection:'row',alignSelf:'center', marginTop:'12%'}}>
  <Image style={{ resizeMode: 'contain',width:360,height:150}} source={require("../Images/gender1.png")} />
  </View>
  <View style={{flexDirection:'row',}}>
      <View>
  <TouchableOpacity style={[styles.male,{ backgroundColor: pressedMale ? '#f2994a' : '#2e3137'}]} onPress={()=>onPressMale()}>
                    <Text
                        style={[
                            styles.text,{color: "#FFF", fontWeight: "600", fontSize: 17,fontFamily: "sans-serif"  }]}  >
                        He
                    </Text>
                </TouchableOpacity></View>
                <View style={{alignItems:'flex-end',marginLeft:80,}}>

               
                <TouchableOpacity style={[styles.female,{ backgroundColor: pressedFemale ?  '#f2994a' : '#2e3137'}]} onPress={()=>onPressFemale()}>
                    <Text
                        style={[
                            styles.text,{color: "#FFF", fontWeight: "600", fontSize: 17,fontFamily: "sans-serif"  }]}  >
                        She
                    </Text>
                </TouchableOpacity>
                 </View>
  </View>
  <View style={{alignSelf:'center',marginTop:'14%',}}>
    
<TouchableOpacity onPress={nextScreen}>
<Text style={{color:'white',fontSize: 17}}>Skip</Text> 

</TouchableOpacity>
     
  </View>
  <View style={{marginTop:'2%',marginBottom:'12%'}}>
  <TouchableOpacity style={styles.submitContainer} onPress={onContinue} >
                    <Text
                        style={[
                            styles.text,{color: "#FFF", fontWeight: "600", fontSize: 17,fontFamily: "sans-serif"  }]}  >
                        Continue
                    </Text>
                </TouchableOpacity></View>
  </View></ScrollView>



)
}

export default Profile1

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
    marginTop:'14%',
    marginBottom:'3%',


},
male:{
    
    fontSize: 17,
    paddingVertical: 6,
    borderRadius:7,
        
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    shadowColor: "rgba(255, 22, 84, 0.24)",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    margin:10,
    borderColor: '#f2994a', borderWidth: 2,
    paddingHorizontal:34,
    marginLeft:45,

},
female:{
    paddingHorizontal:34,
    fontSize: 17,
    paddingVertical: 6,
    borderRadius:7,
    borderColor: '#f2994a', borderWidth: 2,
    marginLeft:46,
    alignItems: "center",
    justifyContent: "center",
    color: "#FFF",
    shadowColor: "rgba(255, 22, 84, 0.24)",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    margin:10,
    

    
},

})