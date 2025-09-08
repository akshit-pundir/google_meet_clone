import React from 'react'

const ActionButtonCaret = ({ defaultValue,deviceList,changeHandler,type }) => {


    // console.log(deviceList)


    let dropDownEl;
    
    if(type === "video"){
        dropDownEl = deviceList?.map( ( vd ) =>  <option key={vd.deviceId} value={vd.deviceId}> { vd.label } </option> ) 
    
    }else if(type === "audio"){
        const audioInputEl = [];
        const audioOutputEl = [];

        deviceList.forEach((d) => {
            if(d.kind === 'audioinput'){
                audioInputEl.push(<option key={`input${d.deviceId}`} value={`input${d.deviceId}`}> { d.label } </option>)
            }else if(d.kind === 'audiooutput'){
                // output spelling wrong intentional
                audioOutputEl.push(<option key={`outpt${d.deviceId}`} value={`outpt${d.deviceId}`}> { d.label } </option>)
            }
        });

        audioInputEl.unshift(<optgroup label='Input Devices'/>);
        audioOutputEl.unshift(<optgroup label='Output Devices'/>);

        dropDownEl = audioInputEl.concat(audioOutputEl);
    }



  return (
    
        <div className='caret-dropdown' style={{top:"-25px" }}>
                <select defaultValue={defaultValue} onChange={changeHandler}> 
                        { dropDownEl }
                </select>

        </div>
    
  )
}

export default ActionButtonCaret;
