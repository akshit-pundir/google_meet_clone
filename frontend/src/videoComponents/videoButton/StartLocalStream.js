import React from 'react'
import updateCallStatus from '../../redux-elements/actions/updateCallStatus';

const StartLocalStream = (streams,dispatch) => {

    const localStream = streams.localStream;

    for( let s in streams){

        if(s != "localStream"){
          const currentStream = streams[s];
          
          localStream.stream.getVideoTracks().forEach( trk => {

                currentStream.peerConnection.addTrack(trk,currentStream.stream);
              });
          dispatch(updateCallStatus('video','enabled'))    
      }  
    }
  
}

export default StartLocalStream;