import React from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import ChatWindow from './ChatWindow';
import CallInfo from './CallInfo';
import './videoComp.css';


const MainVideoPage = () => {

  const [searchParams,setSearchParams] = useSearchParams();
  const [apptInfo,setApptInfo] = React.useState({})



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

              <video id='large-feed' autoPlay playsInline ></video>  
              <video id='own-feed' autoPlay playsInline ></video>  

              {apptInfo.professionalsFullName ? <CallInfo apptInfo={apptInfo}/> : <>User</> }  

              <ChatWindow/>
          </div>


          
      </div>
  )
}

export default MainVideoPage;