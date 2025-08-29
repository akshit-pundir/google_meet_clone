import React from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'



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
    <div>
        <h1>{apptInfo.professionalsFullName} at {apptInfo.apptDate}</h1>

    </div>
  )
}

export default MainVideoPage