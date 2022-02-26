const WebSocket = require('ws');
const ws = new WebSocket("wss://mwp2s3uoui.execute-api.us-east-2.amazonaws.com/dev/");


/*exports.Response = async (req, res) => {

    ws.addEventListener('message', e => {
        const result = JSON.parse(e.data)
        return result
      });
}*/
exports.Subscribe = async (req, res) => {
    const { msg } = req.body;
        if(msg === "subscribe"){
            const payload = {
                action: "subscribe_device",
                data: {
                    deviceId: "deviceId1"
                }
            }
            ws.addEventListener('message', e => { 
                var result = JSON.stringify(e.data)
                res.statusCode = 200;
                res.end(JSON.parse(result)); 
                return;
               
              });
            return ws.send(JSON.stringify(payload))
            //res.status(200).json("successfully subscribe")
            
           
        }
        
      
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
            ws.addEventListener('message', e => { 
                var result = JSON.stringify(e.data)
                res.statusCode = 200;
                res.end(JSON.parse(result)); 
                return;
               
              });
           return ws.send(JSON.stringify(payload))
            //res.status(200).json("successfully unsubscribed")
        
            
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
            ws.addEventListener('message', e => { 
                var result = JSON.stringify(e.data)
                res.statusCode = 200;
                res.end(JSON.parse(result)); 
                return;
               
              });
            return ws.send(JSON.stringify(payload))
            //res.status(200).json(`successfully ${instruction}`)

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
    ws.addEventListener('message', e => { 
        var result = JSON.stringify(e.data)
        res.statusCode = 200;
        res.end(JSON.parse(result)); 
        return;
       
      });
    return ws.send(JSON.stringify(payload))
    //res.status(200).json(`successfully ${payload.data.instruction}`)

}

exports.Control_Off = (req, res) => {
    const payload = {
        action: "control_device",
        data: {
            instruction: "off"
        }
    }
    ws.addEventListener('message', e => { 
        var result = JSON.stringify(e.data)
        res.statusCode = 200;
        res.end(JSON.parse(result)); 
        return;
       
      });
    return ws.send(JSON.stringify(payload))
    //res.status(200).json(`successfully ${payload.data.instruction}`)

}

exports.Control_AlarmOn = (req, res) => {
    const payload = {
        action: "control_device",
        data: {
            instruction: "alarm on"
        }
    }
    ws.addEventListener('message', e => { 
        var result = JSON.stringify(e.data)
        res.statusCode = 200;
        res.end(JSON.parse(result)); 
        return;
       
      });
    return ws.send(JSON.stringify(payload))
    //res.status(200).json(`successfully ${payload.data.instruction}`)

}

exports.Control_AlarmOff = (req, res) => {
    const payload = {
        action: "control_device",
        data: {
            instruction: "alarm off"
        }
    }
    ws.addEventListener('message', e => { 
        var result = JSON.stringify(e.data)
        res.statusCode = 200;
        res.end(JSON.parse(result)); 
        return;
       
      });
    return ws.send(JSON.stringify(payload))
    //res.status(200).json(`successfully ${payload.data.instruction}`)

}

exports.Control_Lock = (req, res) => {
        const payload = {
            action: "control_device",
            data: {
                instruction: "lock"
            }
        } 
       ws.addEventListener('message', e => {
            var result = JSON.stringify(e.data);
            res.statusCode = 200;
            //res.write(result);
           // res.setHeader('Content-Type', 'application/json');
            res.end(JSON.parse(result)); 
            return;
           
        });
        return ws.send(JSON.stringify(payload))
 
}

exports.Control_Unlock = async (req, res) => {
        const payload = {
            action: "control_device",
            data: {
                instruction: "unlock"
            }
        }
        ws.addEventListener('message', e => { 
            var result = JSON.stringify(e.data)
            res.statusCode = 200;
            res.end(JSON.parse(result)); 
            return;
           
          });
        return ws.send(JSON.stringify(payload))
    
}

exports.Readings = async (req, res) => {
    const payload = {
        event: "new_data", 
        data: {
            deviceId: "string",
            timeStamp: "number",
            deviceData: {
                solarVolt: "number",
                inverter_sataus: "number",
                powerConsumption: "double",
                temperature: "number",
                inverterState: "number",
                acVoltage: "string",
                inverter_mode: "string",
                battery: "string"
            }
        }
    }
    ws.send(JSON.stringify(payload))
    ws.addEventListener('message', e => { 
        var result = JSON.parse(e.data)
        //res.statusCode = 200;
        //res.end(JSON.parse(result)); 
        return res.status(200).send(result);
      });


}
