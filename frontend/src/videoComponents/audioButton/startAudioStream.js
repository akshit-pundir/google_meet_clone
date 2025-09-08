import React from 'react'
import updateCallStatus from '../../redux-elements/actions/updateCallStatus';

const StartAudioStream = (streams) => {

    const localStream = streams.localStream;

    for( let s in streams){

        if(s != "localStream"){
          const currentStream = streams[s];
          
          localStream.stream.getAudioTracks().forEach( trk => {

                currentStream.peerConnection.addTrack(trk,streams.localStream.stream);
              });
        }  
            
    }
  
}

export default StartAudioStream;