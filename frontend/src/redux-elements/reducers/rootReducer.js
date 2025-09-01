import { combineReducers } from "redux";
import callstatusReducer from "./callstatusReducer";
import streamReducer from "./streamReducer";



const rootReducer = combineReducers({
    
    callStatus:callstatusReducer,
    streams:streamReducer

});


export default rootReducer;






