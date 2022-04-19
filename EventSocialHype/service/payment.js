require("dotenv").config();
const axios = require('axios');
const auth = require("./auth");

const Service = {
    
    Paystack: {
      url: process.env.PAYSTACK_BASEURL,
      async createTransferReceipt(accountName, accountNumber, bankCode) {
            try {
                const createUserUrl = `${this.url}/transferrecipient`;
                const result = await axios({
                    method: 'post',
                    url: createUserUrl,
                    data: {
                        "type": "nuban",
                        "name": accountName,
                        "account_number": accountNumber,
                        "bank_code": bankCode,
                        "currency": "NGN"
                    },
                    headers: auth.header,
                });
                console.log(result.data);
                const resp = result.data;
                return resp;
            } catch (error) {
                console.log(error);
            }
        },

      async finalizeTransfer(transfer_code, token) {
            try {
                const createUserUrl = `${this.url}/transfer/finalize_transfer`;
                const result = await axios({
                    method: 'post',
                    url: createUserUrl,
                    data: {
                        "transfer_code": transfer_code,
                        "otp": token
                    },
                    headers: auth.header,
                });
                // console.log(result.data);
                const resp = result.data;
                return resp;
            } catch (error) {
                console.log(error);
            }
        },
      async resolveAccount(accountNumber, bankCode) {
            try {
                const createUserUrl = `${this.url}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;
                const result = await axios({
                    method: 'get',
                    url: createUserUrl,
                    headers: auth.header,
                });
                // console.log(result.data);
                const resp = result.data;
                return resp;
            } catch (error) {
                console.log(error);
            }
        },
      async getbanks() {
            try {
                const createUserUrl = `${this.url}/bank`;
                const result = await axios({
                    method: 'get',
                    url: createUserUrl,
                    headers: auth.header,
                });
                // console.log(result.data);
                const resp = result.data;
                return resp;
            } catch (error) {
                console.log(error);
            }
        },
        async payout({amount, recipient_code, type}) {
            try {
                const createUserUrl = `${this.url}/transfer`;
                const data = {
                    "source": "balance",
                    "amount": amount *100,
                    "recipient": recipient_code,
                    "reason": `${process.env.APP_NAME} ${type} PAYOUT`
                };
                const result = await axios({
                    method: 'post',
                    url: createUserUrl,
                    data,
                    headers: auth.header,
                });
                // console.log(result.data);
                const resp = result.data;
                return resp;
            } catch (error) {
                console.log(error);
            }
        },
    },
    Paylot: {
        url: "https://api.paylot.co/transactions",
        async initializePayment(payload) {
            try {
                const createUserUrl = `${this.url}/initialize`;
                const result = await axios({
                    method: 'post',
                    url: createUserUrl,
                    data: payload
                });
                // console.log(result.data);
                const resp = result.data;
                return resp;
            } catch (error) {
                console.log(error);
                const err = error.response.data
                return err;
            }
        },
        async verifyPayment(reference) {
            try {
                const createUserUrl = `${this.url}/verify/${reference}`;
                const result = await axios({
                    method: 'get',
                    url: createUserUrl,
                    headers: auth.paylot,
                });
                // console.log(result.data);
                const resp = result.data;
                return resp;
            } catch (error) {
                console.log(error);
                const err = error.response.data
                return err;
            }
        },
    },

    GoogleCaptcha: {
        
        async verifyCaptcha(captcha, conn) {
            try {
                console.log(process.env.GOOGLE_CAPTCHA_SECRET);
                const createUserUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA_SECRET}&response=${captcha}&remoteip=${conn}`;
                const result = await axios({
                    method: 'post',
                    url: createUserUrl
                });
                // console.log(result.data);
                const resp = result.data;
                return resp;
            } catch (error) {
                console.log(error);
                const err = error.response.data
                return err;
            }
        },
        
    },

    IdentityVerification: {
        
        async verifyIdentity(payload) {
            try {
                
                const createUserUrl = `https://api.myidentitypay.com/api/v1/biometrics/merchant/data/verification/bvn`;
                const result = await axios({
                    method: 'post',
                    url: createUserUrl,
                    data: payload,
                    headers: auth.identity
                });
                // console.log(result.data);
                const resp = result.data;
                return resp;
            } catch (error) {
                console.log(error);
                const err = error.response.data
                return err;
            }
        },
        async ninVerify(payload) {
            try {
                
                const createUserUrl = `https://api.myidentitypay.com/api/v1/biometrics/merchant/data/verification/nin_wo_face`;
                const result = await axios({
                    method: 'post',
                    url: createUserUrl,
                    data: payload,
                    headers: auth.identity
                });
                // console.log(result.data);
                const resp = result.data;
                return resp;
            } catch (error) {
                console.log(error);
                const err = error.response.data
                return err;
            }
        },
        
    },
    
  };

  module.exports = { Service };