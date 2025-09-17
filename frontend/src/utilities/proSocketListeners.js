import updateCallStatus from '../redux-elements/actions/updateCallStatus';

const proDashboardSocketListeners = (socket, setApptInfo,dispatch) => {

    socket.on('apptData', apptData => {
        console.log("appt data from socket",apptData);
            setApptInfo(apptData)
    });

    socket.on('newOfferWaiting',offerData => {
        dispatch(updateCallStatus('offer',offerData.offer));
        console.log("offer data from frontend socket",offerData);    
        dispatch(updateCallStatus('myRole','answerer'));

    })

}

const proVideoSocketListeners = (socket,addIceCandidateToPc) => {

    socket.on('iceToClient', iceC => {
        addIceCandidateToPc(iceC);
    })




}




export default { proDashboardSocketListeners, proVideoSocketListeners };
















