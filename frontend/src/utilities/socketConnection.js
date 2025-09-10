import { io } from "socket.io-client";

let socket;
const socketConnection = (jwt) => {

    if(socket && socket.connected){
        return socket;

    }else{
           socket = io.connect('https://localhost:8181',{
                auth:{
                    jwt
                }
        });
    }
    
    return socket;
};
 







export default socketConnection;








