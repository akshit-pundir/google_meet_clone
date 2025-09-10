const { io } = require('./server');
const jwt = require("jsonwebtoken");

const linkSecret = "adasd##fase$asf5563GDS5%";

const connectedProfessionals = [];



const allKnownOffers = {
    /* 
       uuid --> key
       offer
       professionalFullName
       appointement date
       offerIceCandidates
       answer
       answerIceCandidates
    */

};

io.on('connection',(socket) => {

    console.log(socket.id + "has connected");
    
    const token = socket.handshake.auth.jwt ;
    
    let decodedToken;
    try{
       decodedToken = jwt.verify(token,linkSecret)
    }catch(err){
        console.log(err);
        socket.disconnect();
        return;
    }

    const { fullName, proId } = decodedToken;    

    if(proId){
        const connectedPro = connectedProfessionals.find( cp => cp.proId === proId);

        if(connectedPro){
            connectedPro.socektId = socket.id;
        }else{
            connectedProfessionals.push({
                socektId:socket.id,
                fullName,
                proId    
            })
        }
    }else{
        // this is a client
    }


    console.log(connectedProfessionals);

    socket.on('newOffer',({offer,apptInfo}) => {
        
       allKnownOffers[apptInfo.uuid] = {
          ...apptInfo,
          offer,
          offererIceCandidates:[],
          answer:null,
          answerIceCandidates:[]  
       }

       const p = connectedProfessionals.find( cp => cp.fullName === apptInfo.prfessionalFullName)
       
       if(p){
         const socketId = p.socketId;
         socket.to(socketId).emit('newOfferWaiting',allKnownOffers[apptInfo.uuid]);
       }

    });

});









