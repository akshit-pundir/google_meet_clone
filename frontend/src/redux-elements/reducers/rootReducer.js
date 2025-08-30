import { combineReducers } from "redux";
import callstatusReducer from "./callstatusReducer";



const rootReducer = combineReducers({
    
    callStatus:callstatusReducer

});


export default rootReducer;






