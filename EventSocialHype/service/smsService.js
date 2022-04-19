require('dotenv').config();
const axios = require("axios");

exports.sendSMS = async(phone, message)=>{
    try {
      const url1 = `https://novajii.com/sendsms`;
      const url2 = `https://novajii.com/ords/sms/api/sms`;
      const url3 = `https://novajii.com/api2/sms/send`;
      const url = `${url1}?username=${process.env.SMS_USER}&sender=${process.env.SMS_SENDER}&password=${process.env.SMS_PASSWORD}&destination=${phone}&message=${message}`;
      const response = await axios.get(url);
      console.log(response.data);
  
    } catch (error) {
      console.log(error);
    }
  }