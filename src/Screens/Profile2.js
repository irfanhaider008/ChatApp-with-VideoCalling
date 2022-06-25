import { StyleSheet, Text, View,Image,TouchableOpacity, ScrollView } from 'react-native'
import React,{useState} from 'react'
import Icon from 'react-native-vector-icons/Ionicons';  
import * as ImagePicker from 'react-native-image-picker';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux'
const Profile2 = ({navigation}) => {
    const [image,setImage] =useState(null);
    const curUser = useSelector(state => state.userReducer.currentUser)
  


    const pickImageUpload = ()=>{
        launchImageLibrary({ quality: 0.5 }, (result) => {
            if (result.errorCode || result.didCancel) {
              return console.log('You should handle errors or user cancellation!');
            }
            const img = result.assets[0];
            const uploadTask = storage()
              .ref()
              .child(`/items/${Date.now()}`)
              .putFile(img.uri);
        
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (progress == 100) {
                  alert('Uploaded');
                }
              },
              (error) => {
                alert('something went wrong');
              },
              () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  console.log(downloadURL);
                  setImage(downloadURL);
                });
              },
            );
          });
       }
        

       const onContinue = ()=>{
       
        firestore().collection('users').doc(curUser).update({
                         
            photo:image,
        })  
                navigation.navigate('Profile3')
        
        
            }
            const onNextScreen = ()=>{
                navigation.navigate('Profile3')
            }
  return (
      <ScrollView style={{flex:1,backgroundColor:'#2e3137'}}>
    <View >
    <Text style={styles.heading}>Complete Profile 2</Text>
  <Image style={{ resizeMode: 'contain',alignSelf:'center',width:360,height:130,margin:0,}} source={require("../Images/indicator2.png")} />
  <View style={{alignSelf:'center',marginTop:'12%'}}>
 <TouchableOpacity style={{width: 150, 
   height: 150,
   borderRadius: 150/2, backgroundColor:'#5f4b3c'}} onPress={pickImageUpload}>
    {image?    <Image style={styles.image} source={{uri:image}} />
 :<Icon name={'camera-outline'} color={'#f2994a'} size={70} style={{alignSelf:'center',marginTop:'26%'}} />}   

 </TouchableOpacity>
 <View style={{alignSelf:'center',marginTop:'3%',}}>
    
    <TouchableOpacity onPress={pickImageUpload}>
    <Text style={{color:'white',fontSize: 15}}>Choose Profile Picture</Text> 
    
    </TouchableOpacity>
         
      </View>
  </View>
 
  <View style={{alignSelf:'center',marginTop:'21%',}}>
    
<TouchableOpacity  onPress={()=>navigation.navigate('Profile3')}>
<Text style={{color:'white',fontSize: 17}}>Skip</Text> 

</TouchableOpacity>
     
  </View>
  <View style={{marginTop:'2%',marginBottom:'12%'}}>
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

export default Profile2

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
    paddingHorizontal:40,
    marginLeft:30,
    borderColor: '#f2994a', borderWidth: 2,

},
female:{
    fontSize: 17,
    paddingVertical: 6,
    paddingHorizontal:40,
    borderRadius:7,
    borderColor: '#f2994a', borderWidth: 2,
   
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
    
},
image: {
      
    width: 150,
    height: 150,
    borderRadius: 100,
    
  },

})