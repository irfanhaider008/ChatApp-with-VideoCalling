import { StyleSheet, Text, View,Image,TouchableOpacity,ActivityIndicator } from 'react-native'
import React,{useState} from 'react'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import storage from '@react-native-firebase/storage'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from 'react-redux';
import { currentUserData } from '../../redux/action/userAction'
const LoginScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const [user,setUser] = useState('')

    const [deviceToken,setDeviceToken] =useState(null);
    messaging().getToken().then(token=>{
      setDeviceToken(token)
    })
  
    const [password,setPassword] =useState(null);
      const [email,setEmail] =useState(null);


      const [loading,setLoading] = useState(false)
      if(loading){
          return  <ActivityIndicator size="large" color="#c4461c" />
      }
const onSignIn =async ()=>{

if(!email || !password){
                    alert("Please fill all the fields")}
               try{
                const result = await auth().signInWithEmailAndPassword(email,password)
                dispatch(currentUserData(result.user.uid))
                console.log(result)
           
                setLoading(false)
                navigation.navigate('Home')
               }
            catch(error){
                  alert("Credential not correct")
                  setLoading(false)
            }
  }

     
  return (
      <ScrollView style={{flex:1,backgroundColor:'#2e3137'}}>
    <View>
        <Text style={styles.heading}>Welcome to Chat</Text>
      
      <View style={{alignItems:'center',marginTop:'24%'}}>
      <TextInput style={styles.inputStyle}
        placeholder='Enter Your Email'
        placeholderTextColor={'white'}
        onChangeText={setEmail}
        value={email}
        />
         <TextInput style={styles.inputStyle}
        placeholder='Enter Your Pasword'
        placeholderTextColor={'white'}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        />
      </View>
      <View style={{alignItems:'center',marginLeft:34,marginRight:34,marginTop:'12%'}}>
          <Text style={{color:'#fff',fontSize:15, justifyContent:'center',textAlign:'center' }}>Textie will send you SMS to verify your account. Carrier charges may apply</Text>
      </View>
      <View style={{ marginTop:'22%',}} >
      <TouchableOpacity style={styles.submitContainer} onPress={ onSignIn}>
                        <Text
                            style={[
                                styles.text,{color: "#FFF", fontWeight: "600", fontSize: 17,fontFamily: "sans-serif"  }]}  >
                            Sign in
                        </Text>
                    </TouchableOpacity></View>
                    <View style={{ marginTop:'7%',}} >
      <TouchableOpacity style={styles.submitContainer} onPress={()=> navigation.navigate('SignUp')}>
                        <Text
                            style={[
                                styles.text,{color: "#FFF", fontWeight: "600", fontSize: 17,fontFamily: "sans-serif"  }]}  >
                            Sign up
                        </Text>
                    </TouchableOpacity></View>
                    
      </View>
   
      </ScrollView>
    
  )
}

export default LoginScreen

const styles = StyleSheet.create({

    heading:{

    color:'#fa9f4b',
    textAlign:'center',
    marginTop:'22%',
    fontWeight:'800',
    fontSize:20,
    fontFamily:'lucida grande'
    },
    submitContainer: {
       
        backgroundColor: "#f2994a",
        fontSize: 17,
        borderRadius: 4,
        paddingVertical: 12,
        borderRadius:12,
        marginLeft:24,
        marginRight:24,
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