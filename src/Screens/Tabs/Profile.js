import { StyleSheet, Text, View,Image, ScrollView } from 'react-native'
import React,{useState,useEffect} from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Feather';  
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux'
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
const Profile = () => {
  const curUser = useSelector(state => state.userReducer.currentUser)
  

  const [name,setname] =useState(null);
  const [image,setImage] =useState(null);
  const getCurrentUser = async()=>{
      const userInfo = await firestore().collection('users').doc(curUser).get()
      console.log("User$$",userInfo?.data()?.name)
      setname(userInfo?.data()?.name)
      setImage(userInfo?.data()?.photo)
      
  }
  useEffect(()=>{
      
    
      getCurrentUser()
          },[])

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
                      firestore().collection('users').doc(curUser)
                      .update({
                        photo:downloadURL,
                      })
                    });
                  },
                );
              });
           }
  return (
      <ScrollView style={{flex:1,backgroundColor:'#2e3137',}}>
    <View >
    <View>
    <Image style={{ marginTop:22,alignSelf:'center',width:370,height:400,}} source={{uri:image}} />
    <View style={{ flexDirection:'row', justifyContent: 'space-between',
        alignItems: 'center', backgroundColor: '#000',marginTop:-41,padding:14,marginLeft:30,marginRight:30,paddingTop:16,opacity:0.8}}>
                  <Text style={{color:'#fff',fontSize:14,}}>{name}</Text>
                  <Text style={{color:'#fff',fontSize:14,}}>923943949212</Text>

                </View>
    </View>
    
    <View style={{marginTop:12,}}>
              <View style={styles.content}>
                  <TouchableOpacity onPress={pickImageUpload}>
                  <Text style={styles.text}>Edit Profile Picture</Text>              
                   </TouchableOpacity>
                <Image style={styles.image} source={{uri:image}} />
                
              </View>
              <View style={{ height: 2, backgroundColor: '#7c7c7c',marginLeft:20,marginRight:20,}} />
            </View>
            
            <View>
              <View style={styles.content}>
                  <TouchableOpacity>
                  <Text style={styles.text}>Change Name</Text>              
                   </TouchableOpacity>
                   <Icon style={[styles.image,{color:'#f2994a',}]} size={25} name={'user'} />
              </View>
              <View style={{ height: 2, backgroundColor: '#7c7c7c',marginLeft:20,marginRight:20,}} />
            </View>

            <View >
              <View style={styles.content}>
                  <TouchableOpacity>
                  <Text style={styles.text}>Change Number</Text>              
                   </TouchableOpacity>
                   <Icon style={[styles.image,{color:'#f2994a',}]} size={25} name={'phone'} />
              </View>
              <View style={{ height: 2, backgroundColor: '#7c7c7c',marginLeft:20,marginRight:20,}} />
            </View>
            <View >
              <View style={styles.content}>
                  <TouchableOpacity>
                  <Text style={styles.text}>Help</Text>              
                   </TouchableOpacity>
                   <Icon style={[styles.image,{color:'#f2994a',}]} size={25} name={'help-circle'} />
              </View>
              <View style={{ height: 2, backgroundColor: '#7c7c7c',marginLeft:20,marginRight:20,}} />
            </View>
           
       

</View></ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({

    
      content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      selectionList: {
        marginTop: 22,
      },
      sectionHeader: {
        backgroundColor: '#64B5F6',
        fontSize: 20,
        padding: 5,
        color: '#fff',
        fontWeight: 'bold',
      },
      text:{
          color:'grey',
          marginLeft:20,
          fontSize:17,
      },
      image: {
          
        width: 35,
        height: 35,
        borderRadius: 20,
        margin: 10,
      },
})