import React from 'react'
import socketConnection from './utilities/socketConnection.js';
import { Route, Routes } from 'react-router-dom';

import MainVideoPage from './videoComponents/mainVideoPage.jsx';

const Home = () => <h1>Hello Home</h1>



const App = () => {
  return (

    <div>
        <Routes>      

          <Route  exact path='/' element={<Home/>}/>
          <Route   path='/join-video' element={<MainVideoPage/>}/>

       </Routes>
 
      </div>

  )
}

export default App
