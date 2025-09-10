import React from 'react'
import socketConnection from './utilities/socketConnection.js';
import { Route, Routes } from 'react-router-dom';

import MainVideoPage from './videoComponents/MainVideoPage.jsx';
import ProDashboard from './siteComponents/ProDashboard.jsx';

const Home = () => <h1>Hello Home</h1>



const App = () => {
  return (

    <div>
        <Routes>      

          <Route  exact path='/' element={<Home/>}/>
          <Route  path='/join-video' element={<MainVideoPage/>}/>
          <Route  path='/dashboard' element={<ProDashboard/>} />

       </Routes>
 
      </div>

  )
}

export default App
