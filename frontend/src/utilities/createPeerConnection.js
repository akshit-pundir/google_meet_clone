import peerConfiguration from "./stunServers";



const createPeerConnection = () => {

    return new Promise( async(resolve,reject) => {

            const peerConnection = await new RTCPeerConnection(peerConfiguration);

            const remoteStream = new MediaStream();

            peerConnection.addEventListener('signalingstatechange',(e) => {
                console.log("signalling state change",e);
            });
            
            peerConnection.addEventListener('icecandidate',(e) => {
                  console.log("found ice candidates->>>", e );
                  
                  if(e.candidate){


                  }
            });

            resolve({
                peerConnection,
                remoteStream
            });

    })






}










export default createPeerConnection;