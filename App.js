import React,{useState,useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Image,
  View,
  
} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import StartScreen from './src/Screens/StartScreen';
import LoginScreen from './src/Screens/LoginScreen';
import RegisterScreen from './src/Screens/RegisterScreen';
import Profile1 from './src/Screens/Profile1';
import Profile2 from './src/Screens/Profile2';
import Profile3 from './src/Screens/Profile3';
import Profile4 from './src/Screens/Profile4';
import Home from './src/Screens/Home';
import Messages from './src/Screens/Messages';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from 'react-redux';
import { currentUserData } from './redux/action/userAction';
import VideoIndex from './src/VideoCalling/VideoIndex';
import CreateCall from './src/VideoCalling/CreateCall';
import JoinCaller from './src/VideoCalling/JoinCaller';


const Stack = createStackNavigator();


const App = () => {
  const dispatch = useDispatch();

  const [user,setUser] = useState();
  useEffect(()=>{
    const unsubscribe = auth().onAuthStateChanged(userExist=>{
     if(userExist)
     {
      setUser(userExist)

     }
      
     else{
       setUser('')
     } 
    })
    return()=>{
      unsubscribe()
    }
  
  },[])
  dispatch(currentUserData(user?.uid))
  console.log(user?.uid)

  return (
    <NavigationContainer>
       {/* <StatusBar
        backgroundColor="#2e3137"
        barStyle="light-content"
      
     /> */}
     <StatusBar hidden />
    <Stack.Navigator>
    {user?
 <Stack.Screen name="Home" component={Home}   options={{ headerShown: false }}/>

:
<>
<Stack.Screen name="StartScreen" component={StartScreen}   options={{ headerShown: false }}/>


</>}

<Stack.Screen name="login" component={LoginScreen}   options={{ headerShown: false }}/>
  
  <Stack.Screen name="Profile1" component={Profile1}   options={{ headerShown: false }}/>
  <Stack.Screen name="Profile2" component={Profile2}   options={{ headerShown: false }}/>
  <Stack.Screen name="Profile3" component={Profile3}   options={{ headerShown: false }}/>
  <Stack.Screen name="Profile4" component={Profile4}   options={{ headerShown: false }}/>
  <Stack.Screen name="Messages" component={Messages} options={{headerShown:false}} />
  <Stack.Screen name="SignUp" component={RegisterScreen}   options={{ headerShown: false }}/>
  <Stack.Screen name="VideoIndex" component={VideoIndex} options={{headerShown:false}} />

  <Stack.Screen name="Join" component={JoinCaller} options={{headerShown:false}} />
  <Stack.Screen name="Start" component={CreateCall} options={{headerShown:false}} />







    </Stack.Navigator>
  </NavigationContainer>   
  )
}

export default App

const styles = StyleSheet.create({})