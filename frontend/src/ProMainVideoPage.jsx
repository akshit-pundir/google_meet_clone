import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import addStream from './redux-elements/actions/addStream';
import createPeerConnection from './utilities/createPeerConnection';
import socketConnection from './utilities/socketConnection';
import axios from 'axios';
import ChatWindow from './videoComponents/ChatWindow';
import ActionButtons from './videoComponents/ActionButton';
import updateCallStatus from './redux-elements/actions/updateCallStatus';

const ProMainVideoPage = () => {
  
  const dispatch = useDispatch();
  const [searchParams,setSearchParams] = useSearchParams();
  const [apptInfo,setApptInfo] = React.useState({})
  const callStatus = useSelector(state => state.callStatus);
  const streams = useSelector(state => state.streams);

  const smallFeedEl = useRef(null);
  const largeFeedEl = useRef(null);


  React.useEffect(()=>{

    const fetchMedia = async()=>{
        
        const constraints = {
              video:true,
              audio:false
        }

        try{
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            dispatch(updateCallStatus('haveMedia',true))
            
            dispatch(addStream('localStream',stream));
            const { peerConnection ,remoteStream } =  await createPeerConnection();

            dispatch(addStream( 'remote1', remoteStream, peerConnection ))

        }catch(err){
            console.log(err.message);
        }

    }

    fetchMedia();

  },[]);


  React.useEffect(()=>{
        // console.log("inside setasync offer",callStatus)

    const setAsyncOffer = async() => {
        for(let s in streams){
            if(s !== "localStream" ){
                const pc = streams[s].peerConnection;
                await pc.setRemoteDescription(callStatus.offer);
                console.log("signaling state",pc.signalingState);
            }
        }


    }

    if(callStatus.offer && streams.remote1 && streams.remote1.peerConnection){
        // console.log("inside setasync offer",callStatus)
        setAsyncOffer()
    }

  },[callStatus.offer,streams.remote1])



  React.useEffect(()=>{

    const createAnswerAsync = async() => {
        
        for(let s in streams){
            if( s !== "localStream"){
                const pc = streams[s].peerConnection;
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                // console.log("signaling state",pc.signalingState) 
                dispatch(updateCallStatus('haveCreatedAnswer',true));
                dispatch(updateCallStatus('answer',answer));

                const token = searchParams.get('token');
                const uuid = searchParams.get('uuid');
                const socket = socketConnection(token);

                socket.emit('newAnswer',{answer,uuid});

            }
        }

    }
    if(callStatus.audio === "enabled" && callStatus.video === "enabled" && !callStatus.haveCreatedAnswer){
        createAnswerAsync();;
    }


  },[callStatus.audio,callStatus.video,callStatus.haveCreatedAnswer])



  React.useEffect(()=>{
      const token = searchParams.get('token')
      console.log("token came in ",token);

      const fetchDecodedToken =async()=>{
        
        const { data } = await axios.post(`https://localhost:8181/validate-link`,{token});
        
        setApptInfo(data);
        
        console.log(data);  

      }
      
      fetchDecodedToken();

    },[]);

 
  return (
      <div className='main-video-page'>

          <div className='video-chat-wrapper'>

              <video id='large-feed' ref={largeFeedEl}  autoPlay playsInline ></video>  
              <video id='own-feed' ref={smallFeedEl}  autoPlay playsInline ></video>  
              { callStatus.audio === "off" || callStatus.video === "off" ?  
              <div className="call-info">
                <h1>
                 {searchParams.get('client')} is in the waiting room.<br />
                 call will start when video and audio are enabled.
                </h1>
             </div>
             : <></>
            }     
              <ChatWindow/>
          </div>

            <ActionButtons  smallFeedEl={smallFeedEl}/>

          
      </div>
  )
}

export default ProMainVideoPage
