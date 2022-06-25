import { StyleSheet, Text, View,Image,TouchableOpacity,ScrollView,TextInput,ActivityIndicator} from 'react-native'
import React,{useState,useEffect,useLayoutEffect} from 'react'
import Icon from 'react-native-vector-icons/Feather';  
import AntDesign from 'react-native-vector-icons/AntDesign'
import AutoScroll from 'react-native-auto-scroll'
import { useSelector } from 'react-redux'
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import PushNotification from "react-native-push-notification";
import messaging from '@react-native-firebase/messaging';
const Messages = ({route,navigation}) => {
  
 
  const curUser = useSelector(state => state.userReducer.currentUser)
    const [currentUser,setCurrentUser] = useState(null)

    const getUsers = async()=>{
        const userInfo = await firestore().collection('users').where('uid','==',curUser).get()
        const allusers = userInfo.docs.map(docSnap=>docSnap.data())
        console.log("allUsers",allusers)
        setCurrentUser(allusers[0]?.photo)
        console.log("currentUSer",currentUser)
    }
    useEffect(()=>{
getUsers()
    },[])

  const {uidval} = route.params
  console.log("name",route.params.curUser)
 const uid = route.params.curUser
 const userImage = route.params.image
 const [messages, setMessages]= useState([]);
 const [input, setInput]= useState("");
 const [modalVisible,setModalVisible] =useState(false)
 const [image,setImage] =useState();
 const [photo, setPhoto] = useState([]);

 const docid  = uid > curUser ? curUser+ "-" + uid : uid+"-"+curUser 
 console.log("DOC ID###",userImage)

 const senderMessage =  ()=>{
   if(input==''){
alert("Please Enter Message")
   }
   else{

  const docid  = uid >  curUser ? curUser+ "-" + uid : uid+"-"+curUser
  

  firestore().collection('chatroomsTest')
  .doc(docid)
  .collection('messages')
  .add({
message:input,
      sentBy:curUser,
      sentTo:uid,
      createdAt:firestore.FieldValue.serverTimestamp(),
  })
  firestore().collection('users')
  .doc(uid)
  .update({
lastmessage:input,
  })
}
  setInput('')
}

useLayoutEffect(() => {
    
  const docid  = uid > curUser ? curUser+ "-" + uid : uid+"-"+curUser 

  firestore().collection('chatroomsTest')
  .doc(docid)
  .collection('messages')   .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) =>
          setMessages(
              snapshot.docs.map((doc) => ({
                  id: doc.id,
                  data: doc.data(),
              
                  
                  
              }))
          

          )

      );
  

  
}, [route]);
function onBackPress() {
  navigation.navigate('Home')
}
  return (
   <View style={{flex:1,backgroundColor:'#2e3137'}}>
   
<View style={{flexDirection:'row',marginTop:22, justifyContent:'space-around',

}}>
  <TouchableOpacity onPress={onBackPress}> 
  <Icon style={[styles.image,{color:'#ec9f4b',}]} size={35} name={'chevron-left'} />

  </TouchableOpacity>

    <View style={{flexDirection:'row'}}>

    <Image style={styles.image} source={{uri:userImage}} />
    <Text style={styles.text}>{route.params.name} {'\n'}
                  <Text style={{color:'grey'}}>online</Text>
                  </Text>  
    </View>
    <View style={{marginLeft:15,}}>
      <TouchableOpacity onPress={()=>navigation.navigate('VideoIndex',{name:route.params.name,curUser:uid,userImage:userImage})}>
      <Icon style={[styles.image,{color:'#ec9f4b',margin:10}]} size={30} name={'video'} />

      </TouchableOpacity>

    </View>
    <View>
    <Icon style={[styles.image,{color:'#ec9f4b',margin:10}]} size={30} name={'phone'} />

    </View>

</View>

<AutoScroll>
{ messages.map(({ id, data }) =>
		    data.sentBy === curUser ? (
    <View key={id} style={{flexDirection:'row'}}>
   
    
    <View style={[styles.sender,{alignItems:'center',flex:1,}]}>
<TouchableOpacity>
<Text  style={styles.senderText}>{data.message}</Text>
</TouchableOpacity>

</View>

  
    <Image style={[styles.image,{marginTop:22,}]} source={{uri:currentUser}} />

</View>
) : (


<View key={id} style={{flexDirection:'row'}}>
<Image style={[styles.image,{marginTop:2,}]} source={{uri:userImage}} />
    
<View style={[styles.receiver,{alignItems:'center',flex:1,}]}>
<TouchableOpacity>
<Text  style={styles.receiverText}>{data.message}</Text>
</TouchableOpacity>

</View>


</View>))}
                 
</AutoScroll>
<View style={{paddingTop:12,}}>
<View style={styles.footer}>

            <TextInput 
           
           value={input}
            onChangeText={(text)=> setInput(text)}
            placeholder="Please Enter Message"
            style={styles.textInput}
            multiline={true} 
            placeholderTextColor={'#fff'}
			
            />
              <TouchableOpacity style={{marginLeft:4,}}
            activeOpacity={0.5} onPress={senderMessage}
            >
               <Icon style={[{color: '#ec9f4b'}]} size={25} name={'send'}/>
            </TouchableOpacity>

            <TouchableOpacity style={{marginLeft:4,}}
            activeOpacity={0.5}
            >
               <Icon style={[{color: '#ec9f4b'}]} size={25} name={'camera'}/>
            </TouchableOpacity>
            <TouchableOpacity style={{marginLeft:4,}}
            activeOpacity={0.5}
            >
               <Icon style={[{color: '#ec9f4b'}]} size={25} name={'mic'}/>
            </TouchableOpacity>
          

            </View>
            </View>



   </View>
  )
}

export default Messages

const styles = StyleSheet.create({
    
    image: {
          
        width: 45,
        height: 45,
        borderRadius: 40,
        margin: 10,
      },
      text:{
        color:'#fff',
        fontSize:17,
        margin: 10,
    },
 

	footer: {
		flexDirection: "row",
		alignItems: 'center',
		width: "100%",
		padding: 15,
        
       

 shadowColor: "#000",
    shadowOpacity: 0.2,
    
    shadowRadius: 5,
    shadowOffset: {
      height: 1,
      width: 1
    }
	},
	textInput: {
		bottom: 0,
		height: 40,
		flex: 1,
		marginRight: 13,
		padding: 10,
		
		borderRadius: 30,
        backgroundColor:'#2e3137',
        borderColor:'#ec9f4b',
        borderWidth:2,
        color: '#fff',
        
	},
 
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
    
      submitContainer: {
        backgroundColor: "#eaa22f",
        fontSize: 17,
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 32,
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        shadowColor: "rgba(255, 22, 84, 0.24)",
        shadowOffset: { width: 0, height: 9 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5
    },
    sender: {
        padding: 10,
        backgroundColor: "#ec9f4b",
        alignSelf: 'center',
        		borderRadius: 20,
		marginRight: 15,
		marginBottom: 20,
		maxWidth: "80%",
		position: "relative",
        marginLeft:"19%",
        marginTop:22,
	},
    senderText: {
		color: "#000",
		fontWeight: "500",
		marginLeft: 10,
	
        fontSize:13,
        fontFamily: "sans-serif",
	},
    receiver: {
        padding: 10,
        backgroundColor: "#fff",
        alignSelf: 'center',
        		borderRadius: 20,
		marginRight: '15%',
		marginBottom: 20,
		maxWidth: "80%",
		position: "relative",
       
        marginTop:2,
	},
    receiverText: {
		color: "#000",
		fontWeight: "500",
		marginLeft: 10,
	
        fontSize:13,
        fontFamily: "sans-serif",
	},
})