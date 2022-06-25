import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React,{useEffect} from 'react'
import { ScrollView } from 'react-native-gesture-handler'

const StartScreen = ({navigation}) => {
    const nextScreen = ()=>{
        navigation.navigate('login')
    }
  
  return (
      <ScrollView style={{flex:1,backgroundColor:'#2e3137'}}>
  
        <Text style={styles.heading}>Welcome to Chat</Text>
      
      <Image style={{ resizeMode: 'contain',alignSelf:'center',width:300,height:300,marginTop:'15%',}} source={require("../Images/logo.png")} />
      <View style={{alignItems:'center',marginTop:'10%'}}>
      <Text style={{color:'#fff',fontSize:15 }}> By Continue, you are accepting the
      <Text style={{color:'#fa9f4b',fontSize:15,}}> terms and {'\n'} conditions</Text>
      
      <Text style={{color:'#fff',fontSize:15,}}> Textie. Read the</Text>
      <Text style={{color:'#fa9f4b',fontSize:15,}}> Privacy policy.</Text></Text>
      </View>
      <View style={{marginTop:'8%',marginBottom:'12%'}}>
      <TouchableOpacity style={styles.submitContainer} onPress={ nextScreen}>
                        <Text
                            style={[
                                styles.text,{color: "#FFF", fontWeight: "600", fontSize: 17,fontFamily: "sans-serif"  }]}  >
                            Continue
                        </Text>
                    </TouchableOpacity></View>

                    
      </ScrollView>

    
  )
}

export default StartScreen

const styles = StyleSheet.create({

    heading:{
        marginTop:'22%',
        
    color:'#fa9f4b',
    textAlign:'center',
    
    fontWeight:'800',
    fontSize:20,
    fontFamily:'lucida grande'
    },
    submitContainer: {

        marginTop:'6%',
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

    },
    button: {
        position: 'absolute',
        left: 0,
        bottom: 10,
        marginRight: 0,
        marginLeft: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'green',
        borderRadius: 10,
        borderColor: 'white',
      },
      buttonText: {
          color:'#fff',
          textAlign:'center',
          paddingLeft : 10,
          paddingRight : 10
      }

})