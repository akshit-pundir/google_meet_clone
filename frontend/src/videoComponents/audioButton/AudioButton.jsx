import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ActionButtonCaret from '../ActionButtonCaret';
import getDevices from '../../utilities/getDevices';
import updateCallStatus from '../../redux-elements/actions/updateCallStatus';
import addStream from '../../redux-elements/actions/addStream';
import StartAudioStream from './startAudioStream';

const AudioButton = ({smallFeedEl}) => {

    const callStatus = useSelector(state => state.callStatus);
    const streams = useSelector(state => state.streams)
    const [ caretOpen ,setCaretOpen ] = React.useState(false);
    const [ audioDeviceList, setAudioDeviceList ]=React.useState([]);
    const dispatch = useDispatch()


    let micText;
        if(callStatus.audio === "off"){
            micText = "Join Audio"
        }else if(callStatus.audio === "enabled"){
            micText = "Mute"
        }else{
            micText = "Unmute"
        }
    



    React.useEffect(()=>{

      const getDevicesAsync =async()=>{
            if(caretOpen){
              const devices = await getDevices();  
              console.log(devices.audioInputDevices); 
              setAudioDeviceList(devices.audioInputDevices.concat(devices.audioOutputDevices));
            
          }
      }
        
      getDevicesAsync();

    },[caretOpen]);

    

    async function changeAudioDevice(e){

       const deviceId = e.target.value.slice(5);
       const audioType = e.target.value.slice(0,5);
       
       console.log("device id is -->",deviceId);

       if(audioType === "outpt"){
           smallFeedEl.current.setSinkId(deviceId);
       
        }else if(audioType === "input"){

            const newConstraints = {
                audio: {deviceId: {exact: deviceId } } ,
                video: callStatus.audioDevice ==="default" ? true : {deviceId: {exact:callStatus.videoDevice } }  
            };

            const newStream = await navigator.mediaDevices.getUserMedia(newConstraints);
            
            dispatch(updateCallStatus('audioDevice',deviceId));
            dispatch(updateCallStatus('audio','enabled'));

            dispatch(addStream('localStream',newStream));

            
            
            setCaretOpen(false)

            const tracks = newStream.getAudioTracks()
            
        
        }


    } 
    
    function startStopAudio(){

        if(callStatus.audio === "enabled"){

          dispatch(updateCallStatus('audio','disabled'));
          const tracks = streams.localStream.stream.getAudioTracks();
          tracks.forEach(trk => trk.enabled = false);

        }else if(callStatus.audio === "disabled"){
         
          dispatch(updateCallStatus('audio','enabled'));
          const tracks = streams.localStream.stream.getAudioTracks();
          tracks.forEach(trk => trk.enabled = true);
        }else{
          changeAudioDevice({target:{value:'inputdefault'}});

          StartAudioStream(streams);
        }
    }    




  return (
           <div className="button-wrapper d-inline-block">
                <i className="fa fa-caret-up choose-audio" onClick={()=>setCaretOpen(prev => ! prev)} ></i>
                <div className="button mic" onClick={startStopAudio}>
                    <i className="fa fa-microphone"></i>
                    <div className="btn-text">{micText}</div>
                </div>

                { caretOpen && <ActionButtonCaret 
                                   defaultValue={callStatus.audioDevice}
                                   deviceList={audioDeviceList}
                                   changeHandler={changeAudioDevice}
                                   type="audio" /> }      

                </div>
  )
}

export default AudioButton