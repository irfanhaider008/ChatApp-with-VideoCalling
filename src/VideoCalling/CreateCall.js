import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, View,TouchableOpacity } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import { useSelector } from 'react-redux'
import firestore from '@react-native-firebase/firestore'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';  

import { RTCPeerConnection, RTCView, mediaDevices, RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc';

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302',  "stun:stun.l.google.com:19302",
    
      // "stun:stun1.l.google.com:19302",
      // "stun:stun2.l.google.com:19302",
      // "stun:stun.l.google.com:19302",
      // "stun:stun3.l.google.com:19302",
      // "stun:stun4.l.google.com:19302",
      // "stun:stun.services.mozilla.com",
    ],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function CreateCall({route,navigation}) {
    const curUser = useSelector(state => state.userReducer.currentUser)

const currentUserName = useSelector(state => state.userReducer.user[0]?.name)
const currentUser = useSelector(state => state.userReducer.user)



const ID = route.params.ID
const uidval = route.params.uidval;
console.log("UIDVALUE",route.params)

console.log("ID",ID)
  function onBackPress() {
    if (cachedLocalPC) {
      cachedLocalPC.removeStream(localStream);
      cachedLocalPC.close();
      navigation.navigate('Home')
    }
    setLocalStream();
    setRemoteStream();
    setCachedLocalPC();
    navigation.navigate('Home')

    firestore().collection('chatroomsTest')
    .doc(ID)
    .collection('messages')
    .add({
message:'Call has been Ended by'+ " " + currentUser[0]?.name,

        sentBy:curUser,
        sentTo:ID,
         createdAt:firestore.FieldValue.serverTimestamp(),
    })

    firestore().collection('users')
    .doc(uidval)
    .update({
  lastmessage:'Call has been Ended by'+ " " + currentUser[0]?.name,
    })

  }


  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();
  const [userDetail,setUserDetail] = useState([])

  const [isMuted, setIsMuted] = useState(false);
  const [isloud, setIsloud] = useState(false);

  const onLoud =()=>{
    
    InCallManager.setSpeakerphoneOn(!isloud);
    setIsloud(isloud)

 
  }
  useEffect(() => {
   
  }, []);

  const startLocalStream = async () => {
    // isFront will determine if the initial camera should face user or environment
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFront ? 'front' : 'environment';
    const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);
    const facingMode = isFront ? 'user' : 'environment';
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  const startCall = async id => {
   
    
    const localPC = new RTCPeerConnection(configuration);

    localPC.addStream(localStream);


    const roomRef = await firestore().collection('rooms').doc(id);
    const CallStarter = roomRef.collection('StartMeetingPerson');
    localPC.onicecandidate = e => {
      if (!e.candidate) {
        console.log('Got final candidate!');
        return;
      }
      CallStarter.add(e.candidate.toJSON());
    };

   
    

    localPC.onaddstream = e => {
      if (e.stream && remoteStream !== e.stream) {
        console.log('RemotePC received the stream call', e.stream);
        setRemoteStream(e.stream);
      }
    };
   

    const offer = await localPC.createOffer();

    await localPC.setLocalDescription(offer);


    const roomWithOffer = { offer };
    await roomRef.set(roomWithOffer);

    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!localPC.currentRemoteDescription && data.answer) {
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await localPC.setRemoteDescription(rtcSessionDescription);
      }
    });


    roomRef.collection('JoinMeetingPerson').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          await localPC.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
   
  
    setCachedLocalPC(localPC);
    InCallManager.setSpeakerphoneOn(true);
    
    firestore().collection('chatroomsTest')
    .doc(ID)
    .collection('messages')
    .add({
message:'Call has been Started by'+ " " + currentUser[0]?.name,

        sentBy:curUser,
        sentTo:ID,
         createdAt:firestore.FieldValue.serverTimestamp(),
    })
    firestore().collection('users')
    .doc(uidval)
    .update({
  lastmessage:'Call has been Started by'+ " " + currentUser[0]?.name,
    })

  };

  const switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  const toogleLoudVoice= ()=>{
    if (!remoteStream) {
      return;
    }
    // InCallManager.setSpeakerphoneOn(true);
    // setIsloud(true)


  }
  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach(track => {
      // console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };
  // const onOpen = () => {
  //   LoudSpeaker.open(true)
  // }
 
  // const OnloudSpeaker = ()=>{
  //   InCallManager.setSpeakerphoneOn(true);

  // }
  const [toggle, setToggle] = useState(false);
  const toggleFunction = () => {
    InCallManager.setSpeakerphoneOn(toggle);
    console.log("TOGGLE",toggle)
    setToggle(!toggle);
  };
  return (
    <View style={{backgroundColor:'#2e3137', flex:1, margin:0}}>
      {/* <Text style={styles.heading} >Start Call</Text> */}
      {/* <Text style={styles.heading} >Room : {roomId}</Text> */}
      <View style={styles.callButtons} >
        {/* <View styles={styles.buttonContainer} >
         
          <TouchableOpacity style={styles.btnStyle} onPress={onBackPress}>
          <Text style={styles.textStyle}>stop call</Text>
        </TouchableOpacity>
        </View> */}
        <View styles={styles.buttonContainer} >
          {!localStream &&
           <TouchableOpacity style={styles.btnStyle} onPress={startLocalStream}>
           <Text style={styles.textStyle}>Add Camera</Text>
         </TouchableOpacity>
          
          
          // <Button title='Click to Add Camera' onPress={startLocalStream} color="green"/>
          }
          {localStream &&
            <TouchableOpacity style={styles.btnStyle} onPress={() => startCall(ID)}  disabled={!!remoteStream}>
            <Text style={styles.textStyle}>Start call</Text>
          </TouchableOpacity>
          
          // <Button title='Click to start call' onPress={() => startCall(roomId)}  color="green"/>
          
          }
        </View>
      </View>

      {localStream && (
        <View style={styles.toggleButtons}>
 <View styles={styles.buttonContainer} >
         
         <TouchableOpacity style={styles.btnStyle} onPress={onBackPress}  disabled={!remoteStream}>
         <Text style={styles.textStyle}>stop call</Text>
       </TouchableOpacity>
       </View>
<TouchableOpacity style={styles.btnStyle}onPress={switchCamera} >
          
<Icon style={[styles.image,{color:'#fff',}]} size={40} name={'camera'} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.btnStyle}onPress={()=>onLoud} >
          <Text>{isloud ? 'Add ' : ' from Favorites'}</Text>

          </TouchableOpacity> */}

<TouchableOpacity onPress={() => toggleFunction()} style={styles.btnStyle}>
       {/* <Text style={{color:'#fff'}}>{toggle ? 'Onloud' : 'offLoud'}</Text> */}
        <Icon style={[styles.image,{color:'#fff',}]} size={40} name={toggle ? 'speaker-off' : 'speaker'} />

      </TouchableOpacity>

          {/* <Button title='Switch camera' onPress={switchCamera}  color="green"/> */}

          <TouchableOpacity style={styles.btnStyle} onPress={toggleMute} disabled={!remoteStream} >
            {/* <Text style={styles.textStyle}>{`${isMuted ? 'Unmute' : 'Mute'}`}</Text> */}
            <Icon style={[styles.image,{color:'#fff',}]} size={40} name={isMuted ? 'microphone-off' : 'microphone'} />

          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.btnStyle} onPress={toogleLoudVoice} disabled={!remoteStream} >
            <Text style={styles.textStyle}>{`${isloud ? 'unloudSpeaker' : 'loudSpeaker'}`}</Text>
          </TouchableOpacity> */}
          

       


          {/* <Button title={`${isMuted ? 'Unmute' : 'Mute'} stream`} onPress={toggleMute} disabled={!remoteStream} color="green"/> */}
        </View>
      )}
        {/* <View style={styles.toggleButtons}>
<TouchableOpacity style={styles.btnStyle} onPress={OnloudSpeaker}>
         <Text style={styles.textStyle}>LoudSpeaker</Text>
       </TouchableOpacity>
       </View> */}

      <View style={{ display: 'flex', flex: 1, padding: 10 }} >
        <View style={styles.rtcviewlocal}>
          {localStream && <RTCView style={styles.rtclocal} streamURL={localStream && localStream.toURL()} />}
        </View>
        

        
        <View style={styles.rtcviewRemote}>
 {remoteStream && <RTCView style={styles.rtcRemote} streamURL={remoteStream && remoteStream.toURL()} />}
          {/* {remoteStream && <RTCView style={styles.rtcRemote} streamURL={remoteStream && remoteStream.toURL()} />} */}
        </View>

      
        {/* <View style={styles.loud}>
        <TouchableOpacity onPress={onOpen()} style={styles.loudBtn}>
            <Text style={{color:'white',fontSize:20,  justifyContent: 'center',}}>Loud Speaker</Text>
        </TouchableOpacity></View> */}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  textStyle:{
    color: "white",
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
  },
  btnStyle:{
    margin:6,
    marginTop: 20,
    backgroundColor:'#ec9f4b',
    padding: 10,
    borderRadius: 12,
  },
  loud: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  loudBtn: {
    height: 45, 
    width: 150, 
    backgroundColor: 'green',
    margin: 10,
    justifyContent: 'center',
      alignItems: 'center'
  },

  heading: {
    marginVertical: 10,
    alignSelf: 'center',
    fontSize: 30,
    color:'#fff',
    fontFamily:'sans-serif-medium'
  },
  rtcviewlocal: {
    height:'20%',
     width:'20%',
    marginBottom: 5,
  },
  rtcviewRemote: {
    height:'100%',
    
    marginBottom: 2,
  },
  rtclocal: {
    width: '100%',
    height: '100%',
    
   
  },
  rtcRemote: {
    width: '100%',
    height: '82%',
    borderColor:'red'
   
  },

  toggleButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  callButtons: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    margin: 5,
  }
});