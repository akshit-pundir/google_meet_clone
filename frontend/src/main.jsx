import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { legacy_createStore as createStore } from 'redux'
import App from './App.jsx'
import './index.css'
import rootReducer from './redux-elements/reducers/rootReducer.js'


const theStore = createStore(rootReducer);



createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <Provider store={theStore}>
      <App />
    </Provider>
   </BrowserRouter>
     
)
