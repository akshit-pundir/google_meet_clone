import React, { useRef } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import ChatWindow from './ChatWindow';
import CallInfo from './CallInfo';
import './videoComp.css';
import ActionButtons from './ActionButton';
import { useDispatch, useSelector } from 'react-redux';
import addStream from '../redux-elements/actions/addStream';
import createPeerConnection from '../utilities/createPeerConnection';
import socketConnection from '../utilities/socketConnection';
import updateCallStatus from '../redux-elements/actions/updateCallStatus';
import clientSocketListners from '../utilities/clientSocketListner';



const MainVideoPage = () => {

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

  },[])

  React.useEffect(()=>{
    
    const createOfferAsync = async() => {


        for(let s in streams){
          
          if(s !== "localStream"){

             try{
               const pc = streams[s].peerConnection;
               const offer = await pc.createOffer();
               pc.setLocalDescription(offer);

               const token = searchParams.get('token');

               const socket = socketConnection(token);
               socket.emit('newOffer',{offer,apptInfo});

               clientSocketListners(socket,dispatch);
            }catch(err){
              console.log(err.message)
            }

          
            }
          }
          dispatch(updateCallStatus('haveCreatedOffer',true));

        }


    
    if(callStatus.audio === "enabled" && callStatus.video === "enabled" && !callStatus.haveCreatedOffer){
      createOfferAsync();
    }
    

  },[callStatus.audio,callStatus.video,callStatus.haveCreatedOffer])  


  React.useEffect(()=>{

    // console.log(callStatus);

    async function addAsyncAnswer(){
  
      for(const s in streams){

        if(s !== 'localStream'){
          const pc = streams[s].peerConnection;
          await pc.setRemoteDescription(callStatus.answer);
          console.log(pc.signalingState);
          console.log("answer added");
        }
      
      }
      
    }
    

    if(callStatus.answer){
      addAsyncAnswer();
    }

  },[callStatus.answer])





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

              {apptInfo.professionalsFullName ? <CallInfo apptInfo={apptInfo}/> : <>User</> }  

              <ChatWindow/>
          </div>

            <ActionButtons  smallFeedEl={smallFeedEl}/>

          
      </div>
  )
}

export default MainVideoPage;