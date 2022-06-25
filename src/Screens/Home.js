import { StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'; 
import AntDesign from 'react-native-vector-icons/AntDesign' 

import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chats from './Tabs/Chats';
import Calls from './Tabs/Calls';
import Profile from './Tabs/Profile';




const Tab = createBottomTabNavigator();


const Home = ({navigation}) => {

  return (
   
    <Tab.Navigator 
    screenOptions={{headerTintColor:'red', headerStyle: {
        backgroundColor: '#c4461c',
      
      },
    }}
    tabBarOptions={{
      activeBackgroundColor: '#2e3137',
      inactiveBackgroundColor: '#2e3137',
      showLabel: false
          
   }}
       initialRouteName="Chats" >
 <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarInactiveTintColor:'#eaa22f', 
          tabBarActiveTintColor:'#eaa22f', 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
       <Icon style={[{color: '#f2994a',marginBottom:12,}]} size={30} name={'ios-chatbubble-sharp'} />  ), }}
      />

<Tab.Screen
        name="Calls"
        component={Calls}
        options={{
          tabBarInactiveTintColor:'#eaa22f', 
          tabBarActiveTintColor:'#eaa22f', 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
       <Icon style={[{color: '#f2994a',marginBottom:12,}]} size={30} name={'ios-call'} />  ), }}
      />

<Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarInactiveTintColor:'#eaa22f', 
          tabBarActiveTintColor:'#eaa22f', 
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
       <AntDesign style={[{color: '#f2994a',marginBottom:12,}]} size={30} name={'appstore1'} />  ), }}
      />

    </Tab.Navigator>

  )
}

export default Home

const styles = StyleSheet.create({})