exports.generateCode = () => Math.floor(Math.random()*90000) + 10000;

exports.getRole = (role) =>{
    let account;
    if (role === "socialite") {
        account = "Socialite"
    }else if (role === "event_organizer") {
        account = "Event Organizer"
    }else if (role === "event_vendor") {
        account = 'Event Vendor'
    }
    return account;
}

exports.getEventType = (type) =>{
    let event;
    if (type === "open") {
        event = "Open Event"
    }else if (type === "invitation") {
        event = "Strictly by Invitaion"
    }else if (type === "ticket") {
        event = 'Event Ticketing'
    }
    return event;
}

exports.numFormatter = (num) => {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    }else if(num >= 1000000){
        return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    }else if(num < 900){
        return num; // if value < 1000, nothing to do
    }
}

exports.ucfirst = (str) =>{
    var firstLetter = str.slice(0,1);
    return firstLetter.toUpperCase() + str.substring(1);
}

exports.stripHtml = (str)=> {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
}

exports.isNumeric = (str) =>{
    return !isNaN(str) && !isNaN(parseFloat(str));
}
  