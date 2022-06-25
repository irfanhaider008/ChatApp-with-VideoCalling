import { StyleSheet, Text, View,Image,TouchableOpacity,FlatList } from 'react-native'
import React, {useState, useEffect } from 'react'
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';  
import AntDesign from 'react-native-vector-icons/AntDesign'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux'
import PushNotification, {Importance} from "react-native-push-notification";
import { useDispatch } from 'react-redux';
import { userData } from '../../../redux/action/userAction';
import { useFocusEffect } from '@react-navigation/native';


const Chats = ({navigation}) => {
  const [currentMessage,setCurrentMessage] = useState(null)

  const currentUser1 = async()=>{
    const currentInfo = await firestore().collection('users').where('uid','==',curUser).get()
    const user = currentInfo.docs.map(docSnap=>docSnap.data())
    //console.log("currentUser",user[0]?.lastmessage)
    setCurrentMessage(user[0]?.lastmessage)

    dispatch(userData(user))
    
}

const curUser = useSelector(state => state.userReducer.currentUser)


const [message,setMessage] = useState()
useEffect(()=>{

  const subscriber = firestore()
      .collection('users')
      .doc(curUser)
      .onSnapshot(documentSnapshot => {
        console.log('User data:@@ ', documentSnapshot.data().lastmessage);
        const NotificationSent = ()=>{
       
          PushNotification.createChannel(
            {
              channelId: "channel-id", // (required)
              channelName: "My channel", // (required)
              channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
              playSound: true, // (optional) default: true
              soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
              importance: Importance.HIGH, // (optional) default: 4. Int value of the Android notification importance
              vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
          );
          
          PushNotification.configure({
        
            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
              console.log('LOCAL NOTIFICATION ==>', notification)
            
            },
          
            popInitialNotification: true,
            requestPermissions: true
          })
          
          PushNotification.localNotification({
            channelId : "channel-id",
            autoCancel: true,
            // bigText:
            //   'started the cal',
          //  subText: 'Please Join the Call',
            title: documentSnapshot.data().lastmessage,
            message: 'Expand me to see more',
            vibrate: true,
            vibration: 300,
            playSound: true,
            soundName: 'default',
            // actions: '["Yes", "No"]',
            invokeApp: true,
            
          })
        }
        if(documentSnapshot.data().lastmessage?.includes("Call has been Ended by")|| (documentSnapshot.data().lastmessage.includes("Call has been Started by"))){

          NotificationSent();
          console.log("MATCHED1")
        
        } 
        setMessage(documentSnapshot.data().lastmessage)
       
      });
     // console.log('message##',message)
    
    // Stop listening for updates when no longer required
    return () => subscriber();
   
    
  
},[])


  const onLogout=()=>{
    auth().signOut().then(() => 
   
    console.log('User signed out!') 
   
    )
    navigation.navigate('StartScreen')
  }

  const [users,setUsers] = useState(null)
  const [status,setStatus] = useState(false)

 
  const dispatch = useDispatch();


    const getUsers = async()=>{
        const userInfo = await firestore().collection('users').where('uid','!=',curUser).get()
        const allusers = userInfo.docs.map(docSnap=>docSnap.data())
        console.log("allUsers",allusers)
        setUsers(allusers)
 
    }
  
    useEffect(()=>{
getUsers()
currentUser1()
    

    },[])
  
// useFocusEffect(
//   React.useCallback(() => {
//     getUsers()
//     currentUser1()
//     if(currentMessage?.includes("Call has been Started by") || currentMessage?.includes("Call has been Ended by")){
//        NotificationSent();
//     }
    
//   }, [])
//  );

    const RenderUsers =({item})=>{
     
      return(
      <View style={{marginTop:20,}}>

      <TouchableOpacity onPress={()=>navigation.navigate('Messages',{name:item.name,curUser:item.uid,image:item.photo})}>
      <View style={[styles.content,{marginLeft:16,}]}>
            <Image style={[styles.image,]} source={{uri:item.photo}}/>

               <View style={{flexDirection:'column'}}>
                <Text style={[styles.text,]}>{item.name}
                </Text>
                <Text style={{color:'grey',marginTop:6,}}>{item.lastmessage}</Text>
                  
                </View>
              
            </View>
            <View style={{alignSelf: 'flex-end',}}>
                 <Text style={{color:'grey',marginBottom:4,marginRight:27,}}>Yesterday</Text>    

                 </View>
            </TouchableOpacity>
            
            <View style={{ height: 2, backgroundColor: '#7c7c7c',width:360,alignSelf:'center',marginLeft:9,}} />
          </View>
      )

    }
  
  

   
  return (
      <View style={{flex:1,backgroundColor:'#2e3137'}}>



        <View style={{margin:20,flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{color:'#fff',flex:1,textAlign:'center',fontSize:21,fontWeight:'bold',marginTop:16,}}>Chats</Text>
        <TouchableOpacity onPress={onLogout}>
        <AntDesign style={{color:'#ec9f4b',margin:10,textAlign:'right'}} size={30} name={'logout'} />

        </TouchableOpacity>

        </View>

        <View style={{marginTop:30,}}>
        <SearchBar style={{fontSize:19,}}
        inputStyle={{backgroundColor: '#2e3137'}}
        inputContainerStyle={{backgroundColor: '#2e3137',marginTop:-5,}}
        placeholderTextColor={'#fff'}
        placeholder={'Search'}
       searchIcon={{color:'#f2994a',size:25}}
       containerStyle={{backgroundColor: '#2e3137',borderWidth: 3, height:59,width:360,alignSelf:'center', borderTopWidth:3, borderEndWidth:3,borderBottomWidth:3,
       
       borderBottomColor: '#f2994a', borderLeftColor:'#f2994a', borderRightColor:'#f2994a',
       borderTopColor: '#f2994a', borderRadius: 26,}}
       clearIcon = {false}
      
        />    
            
    </View>
        {/* <View style={{marginTop:20,}}>

        <TouchableOpacity onPress={()=>navigation.navigate('Messages')}>
              <View style={styles.content}>
              <Image style={[styles.image,]} source={require("../../Images/john.jpg")} />

                 <View style={{flexDirection:'column'}}>
                  <Text style={[styles.text,]}>Muhammad Ali
                  </Text>
                  <Text style={{color:'grey',marginTop:6,}}>last Messages</Text>
                    
                  </View>
                   
                 
                   <View style={{alignSelf: 'flex-end',display:'flex'}}>
                   <Text style={{color:'grey',textAlign:'right',marginLeft:100,marginBottom:4,}}>Yesterday</Text>    

                   </View>
                   

              </View>
              </TouchableOpacity>
              
              <View style={{ height: 1, backgroundColor: '#7c7c7c',width:360,alignSelf:'center',marginLeft:9,}} />
            </View> */}

            <FlatList
      data={users}
      renderItem={({item})=><RenderUsers item={item}/>}
      keyExtractor={(item)=>item.uid}
      />    

      {/* <Text style={{color:'red',fontSize:120,}}>{message}</Text> */}
    </View>
  )
}

export default Chats

const styles = StyleSheet.create({

    
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'baseline',
    justifyContent:'flex-start',
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
      color:'#fff',
      fontSize:17,
  },
  image: {
      
    width: 65,
    height: 65,
    borderRadius: 40,
    margin: 10,
  },
})