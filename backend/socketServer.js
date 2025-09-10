const { io } = require('./server');


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
    
    const fullName = socket.handshake.auth.fullname;
    
    connectedProfessionals.push({
        socektId:socket.id,
        fullName:fullName    
    })

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









