import peerConfiguration from "./stunServers";



const createPeerConnection = (addIce) => {

    return new Promise( async(resolve,reject) => {

            const peerConnection = await new RTCPeerConnection(peerConfiguration);

            const remoteStream = new MediaStream();

            peerConnection.addEventListener('signalingstatechange',(e) => {
                console.log("signalling state change",e);
            });
            
            peerConnection.addEventListener('icecandidate',(e) => {
                console.log("found ice candidates->>>", e );
                  
                if(e.candidate){
                   addIce(e.candidate); 
                }

            });

            peerConnection.addEventListener('track',(e) => {
                console.log("got a track from remote");
                e.streams[0].getTracks().forEach(track => {
                    remoteStream.addTrack(track,remoteStream);
                    console.log("hope it works........")
                })
            })


            resolve({
                peerConnection,
                remoteStream
            });

    })






}










export default createPeerConnection;