import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
const VideoIndex = ({navigation,route}) => {
    const curUser = useSelector(state => state.userReducer.currentUser)
    const uid = route.params.curUser
    const userImage = route.params.userImage
    console.log("USER IMAGE",userImage)
    console.log("USER UID",route.params)
    
    const docid  = uid >  curUser ? curUser+ "-" + uid : uid+"-"+curUser

  return (
      <View style={{flex:1,backgroundColor:'#2e3137',}}>
        <View style={styles.content}>
            <Image style={[styles.image,]} source={{uri:userImage}}/>
</View>
    <View style={{flexDirection:'row',paddingBottom:7, alignItems:'center',alignSelf:'center',marginTop:123}}>
    {/* <Text style={{color:'white'}}>{deviceToken}</Text> */}
    {/* <Text style={{color:'white'}}>{messages[2]?.data.message}</Text> */}

  <TouchableOpacity onPress={() => navigation.navigate('Start',{ID:docid,uidval:uid})} style={{backgroundColor:'#ec9f4b',padding:10,marginLeft:10,paddingHorizontal:40,borderRadius:12,}}>

    <Text style={{fontSize:16,fontWeight:'bold',color:'#fff'}}> Start Call</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('Join',{ID:docid,uidval:uid})} style={{backgroundColor:'#ec9f4b',padding:10,marginLeft:20,paddingHorizontal:40,borderRadius:12,}}>
    <Text style={{fontSize:16,fontWeight:'bold',color:'#fff'}}>Join Call</Text>
</TouchableOpacity>
  </View></View>
  )
}

export default VideoIndex

const styles = StyleSheet.create({
  image: {
      
    width: 305,
    height: 305,
    borderRadius: 140,
    margin: 60,
    borderWidth:8,
borderColor:'#ec9f4b'
    
  },
})