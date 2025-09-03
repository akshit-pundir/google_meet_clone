import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StartLocalStream from './StartLocalStream.js';
import updateCallStatus from '../../redux-elements/actions/updateCallStatus.js';
import getDevices from '../../utilities/getDevices.js';
import addStream from '../../redux-elements/actions/addStream.js';

const VideoButton = ( { smallFeedlEl } ) => {

    const callStatus = useSelector(state => state.callStatus);
    const streams = useSelector(state => state.streams);  
    const [ pendingUpdate, setPendingUpdate ] = React.useState(false);
    const [ caretOpen ,setCaretOpen ] = React.useState(false);
    const [videoDeviceList ,setVideoDeviceList] = React.useState([]);
    const dispatch = useDispatch();

    const Dropdown = () => {
        return(
            <div className='caret-dropdown' style={{top:"-25px" }}>
                <select defaultValue={callStatus.deviceId} onChange={changeVideoDevice}> 
                        { videoDeviceList?.map( ( vd ) =>  <option key={vd.deviceId} value={vd.deviceId}> { vd.label } </option> )  }
                </select>

            </div>

        )

    }  



    React.useEffect(()=>{

      const getDevicesAsync =async()=>{
            if(caretOpen){
              const devices =  await getDevices();  
              // console.log(devices.videoDevices); 
              setVideoDeviceList(devices.videoDevices);
          }
      }
        
      getDevicesAsync();

    },[caretOpen])

    async function changeVideoDevice(e){

        const deviceId = e.target.value;

        const newConstraints = {
            audio: callStatus.audioDevice ==="default" ? true : {deviceId: {exact:callStatus.audioDevice } } ,
            video: {deviceId: {exact: deviceId } }
        }

        const newStream = await navigator.mediaDevices.getUserMedia(newConstraints)
        
        dispatch(updateCallStatus('videoDevice',deviceId));
        dispatch(updateCallStatus('video','enabled'));

        smallFeedlEl.current.srcObject = newStream;
        dispatch(addStream('localStream',newStream));

        const tracks = newStream.getVideoTracks();
        // come back to this later because if we modify track that means renegotiation


    }

    function startStopVideo(){

        if(callStatus.video === "enabled"){

          dispatch(updateCallStatus('video','disabled'));
          const tracks = streams.localStream.stream.getVideoTracks();
          tracks.forEach(trk => trk.enabled = false);

        }else if(callStatus.video === "disabled"){
         
          dispatch(updateCallStatus('video','enabled'));
          const tracks = streams.localStream.stream.getVideoTracks();
          tracks.forEach(trk => trk.enabled = true);

        }else if(callStatus.haveMedia){
          smallFeedlEl.current.srcObject = streams.localStream.stream;
          StartLocalStream(streams,dispatch);
        }else{
          setPendingUpdate(true);
        }
    }

    React.useEffect(()=>{

          if(pendingUpdate && callStatus.haveMedia){
              // console.log("pending updates success")
              setPendingUpdate(false);
              smallFeedlEl.current.srcObject = streams.localStream.stream;  
              StartLocalStream(streams,dispatch);
          }

    },[pendingUpdate,callStatus.haveMedia])

  return (

         <div className="button-wrapper video-button d-inline-block">

                    <i className="fa fa-caret-up choose-video" onClick={()=>setCaretOpen(prev => ! prev)}></i>
                    <div className="button camera" onClick={startStopVideo}>
                        <i className="fa fa-video"></i>
                        <div className="btn-text">{callStatus.video === "enabled" ? "Stop" : "Start"} Video</div>
                    </div>

                    { caretOpen && <Dropdown/> }      

                </div>
  )
}

export default VideoButton;