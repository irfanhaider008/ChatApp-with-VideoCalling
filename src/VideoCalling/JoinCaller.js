import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button, View,TouchableOpacity,ScrollView } from 'react-native';
import InCallManager from 'react-native-incall-manager';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';  
import { RTCPeerConnection, RTCView, mediaDevices, RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc';
import { useSelector } from 'react-redux'
import firestore from '@react-native-firebase/firestore'

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function JoinCaller({route,navigation}) {
  const currentUserName = useSelector(state => state.userReducer.currentUser[0]?.name)
  const currentUserOpen = useSelector(state => state.userReducer.user)
  const currentUser = useSelector(state => state.userReducer.user)
  const curUser = useSelector(state => state.userReducer.currentUser)
console.log("CURRENT",currentUser[0]?.name)

    const ID = route.params.ID
    const uidval = route.params.uidval;
console.log("UID",uidval)
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

  const [isloud, setIsloud] = useState(false);

  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // startLocalStream();
  }, []);

  const startLocalStream = async () => {
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

  const joinCall = async () => {

    const roomRef = await firestore().collection('rooms').doc(ID);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) return
    const localPC = new RTCPeerConnection(configuration);
  

    localPC.addStream(localStream);


    const CallJoiner = roomRef.collection('JoinMeetingPerson');
    localPC.onicecandidate = e => {
      if (!e.candidate) {
        console.log('Got final candidate!');
        return;
      }
      CallJoiner.add(e.candidate.toJSON());
      //     firestore().collection('chatroomsTest')
//     .doc(ID)
//     .collection('messages')
//     .add({
// message:'Call has been Joined by'+ " " + currentUserName,
//         sentBy:currentUserOpen.uid,
//         sentTo:ID,
//          createdAt:firestore.FieldValue.serverTimestamp(),
//     })
//     firestore().collection('users')
//     .doc(uidval)
//     .update({
//   lastmessage:'Call has been Joined by'+ " " + currentUserName,
//     })
    };

    

    localPC.onaddstream = e => {
      if (e.stream && remoteStream !== e.stream) {
        console.log('@nd Device received the stream join', e.stream);
        setRemoteStream(e.stream);
      }
    };

 

    const offer = roomSnapshot.data().offer;

    await localPC.setRemoteDescription(new RTCSessionDescription(offer));


    const answer = await localPC.createAnswer();

    await localPC.setLocalDescription(answer);


    const roomWithAnswer = { answer };
    await roomRef.update(roomWithAnswer);

    roomRef.collection('StartMeetingPerson').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          await localPC.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
   
    

    setCachedLocalPC(localPC);
    InCallManager.setSpeakerphoneOn(true);
    setIsloud(true)
    firestore().collection('chatroomsTest')
    .doc(ID)
    .collection('messages')
    .add({
message:'Call has been Joined by'+ " " + currentUser[0]?.name,

        sentBy:curUser,
        sentTo:ID,
         createdAt:firestore.FieldValue.serverTimestamp(),
    })
    firestore().collection('users')
    .doc(uidval)
    .update({
  lastmessage:'Call has been Joined by'+ " " + currentUser[0]?.name,
    })
  };

  const switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

   // Mutes the local's outgoing audio
  //  const toogleLoudVoice= ()=>{
  //   if (!remoteStream) {
  //     return;
  //   }
  //   InCallManager.setSpeakerphoneOn(true);
  //   setIsloud(true)


  // }

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
      {/* <Text style={styles.heading} >Join Call</Text> */}
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
             <TouchableOpacity style={styles.btnStyle} onPress={() => joinCall()} disabled={!!remoteStream}>
             <Text style={styles.textStyle}>Join Call</Text>
           </TouchableOpacity>

          // <Button title='Click to join call' onPress={() => joinCall(roomId)} disabled={!!remoteStream} color="green"/>
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
    <TouchableOpacity style={styles.btnStyle} onPress={switchCamera}>
             {/* <Text style={styles.textStyle}>Switch Camera</Text> */}
             <Icon style={[styles.image,{color:'#fff',}]} size={40} name={'camera'} />

           </TouchableOpacity>
           <TouchableOpacity onPress={() => toggleFunction()} style={styles.btnStyle}>
       {/* <Text style={{color:'#fff'}}>{toggle ? 'Onloud' : 'offLoud'}</Text> */}
        <Icon style={[styles.image,{color:'#fff',}]} size={40} name={toggle ? 'speaker-off' : 'speaker'} />

      </TouchableOpacity>

          {/* <Button title='Switch camera' onPress={switchCamera} color="green"/> */}
          {/* <TouchableOpacity style={styles.btnStyle} onPress={toggleMute} disabled={!remoteStream}>
             <Text style={styles.textStyle}>Loud Speaker</Text></TouchableOpacity> */}

          <TouchableOpacity style={styles.btnStyle} onPress={toggleMute} disabled={!remoteStream}>
             {/* <Text style={styles.textStyle}>{`${isMuted ? 'Unmute' : 'Mute'}`}</Text> */}
             <Icon style={[styles.image,{color:'#fff',}]} size={40} name={isMuted ? 'microphone-off' : 'microphone'} />

             
             </TouchableOpacity>
          {/* <Button title={`${isMuted ? 'Unmute' : 'Mute'} stream`} onPress={toggleMute} disabled={!remoteStream} color="green" /> */}
          {/* <TouchableOpacity style={styles.btnStyle} onPress={toogleLoudVoice} disabled={!remoteStream} >
            <Text style={styles.textStyle}>{`${isloud ? 'unloudSpeaker' : 'loudSpeaker'}`}</Text>
          </TouchableOpacity> */}
          
        </View>

      )}
      {/* <View style={styles.toggleButtons}>
<TouchableOpacity style={styles.btnStyle} onPress={OnloudSpeaker}>
         <Text style={styles.textStyle}>LoudSpeaker</Text>
       </TouchableOpacity>
       </View> */}

      {/* <View style={[{flexDirection:'row'},styles.toggleButtons]}>
      <TouchableOpacity style={styles.btnStyle} onPress={switchCamera}>
             <Text style={styles.textStyle}>Switch Camera</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.btnStyle} onPress={switchCamera}>
             <Text style={styles.textStyle}>Switch Camera</Text>
           </TouchableOpacity>
      </View> */}
     

      <View style={{ display: 'flex', flex: 1, padding: 10 }} >
        <View style={[styles.rtcviewlocal]}>
          {localStream && <RTCView style={[styles.rtclocal]} streamURL={localStream && localStream.toURL()} />}
        </View>
        <View style={styles.rtcviewRemote}>
          {remoteStream && <RTCView style={styles.rtcRemote} streamURL={remoteStream && remoteStream.toURL()} />}
        </View>

      </View>
    </View>
    
  )
}

const styles = StyleSheet.create({
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
  },
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
});
