import updateCallStatus from '../redux-elements/actions/updateCallStatus';

const proSocketListeners = (socket, setApptInfo,dispatch) => {

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

export default proSocketListeners;
















