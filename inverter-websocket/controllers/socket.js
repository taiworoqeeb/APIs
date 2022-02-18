const WebSocket = require('ws');
const ws = new WebSocket("wss://mwp2s3uoui.execute-api.us-east-2.amazonaws.com/dev/");

/*exports.Response = async (req, res) => {

   await ws.addEventListener('message', e => {
        return res.send(JSON.parse(e.data))
      });
}*/
exports.Subscribe = (req, res, next) => {
    const { msg } = req.body;
        if(msg === "subscribe"){
            const payload = {
                action: "subscribe_device",
                data: {
                    deviceId: "deviceId1"
                }
            }
            ws.send(JSON.stringify(payload))
            res.status(200).json("successfully subscribe")
            
        }
        next();
};

exports.Unsubscribe =  (req, res) => {
    const { msg } = req.body;
        if(msg === "unsubscribe"){
            const payload = {
                action: "unsubscribe_device",
                data: {
                    deviceId: "deviceId1"
                }
            }
            ws.send(JSON.stringify(payload))
            res.status(200).json("successfully unsubscribed")
        }
};

exports.Control = (req, res, next) => {
    const { msg, instruction } = req.body;
        if(msg === "control"){
            const payload = {
                action: "control_device",
                data: {
                    instruction: instruction
                }
            }
            ws.send(JSON.stringify(payload))
            res.status(200).json(`successfully ${instruction}`)

        }
        next();

}


exports.Control_On = (req, res) => {
    const payload = {
        action: "control_device",
        data: {
            instruction: "on"
        }
    }
    ws.send(JSON.stringify(payload))
    res.status(200).json(`successfully ${payload.data.instruction}`)

}

exports.Control_Off = (req, res) => {
    const payload = {
        action: "control_device",
        data: {
            instruction: "off"
        }
    }
    ws.send(JSON.stringify(payload))
    res.status(200).json(`successfully ${payload.data.instruction}`)

}

exports.Control_AlarmOn = (req, res) => {
    const payload = {
        action: "control_device",
        data: {
            instruction: "alarm on"
        }
    }
    ws.send(JSON.stringify(payload))
    res.status(200).json(`successfully ${payload.data.instruction}`)

}

exports.Control_AlarmOff = (req, res) => {
    const payload = {
        action: "control_device",
        data: {
            instruction: "alarm off"
        }
    }
    ws.send(JSON.stringify(payload))
    res.status(200).json(`successfully ${payload.data.instruction}`)

}

exports.Control_Lock = (req, res) => {
    const payload = {
        action: "control_device",
        data: {
            instruction: "lock"
        }
    }
    ws.send(JSON.stringify(payload))
    res.status(200).json(`successfully ${payload.data.instruction}`)

}

exports.Control_Unlock = (req, res) => {
    const payload = {
        action: "control_device",
        data: {
            instruction: "unlock"
        }
    }
    ws.send(JSON.stringify(payload))
    res.status(200).json(`successfully ${payload.data.instruction}`)

}
