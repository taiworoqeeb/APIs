let amountInput = document.getElementById("amount");
const digits_only = string => [...string].every(c => '0123456789'.includes(c));

function payWithPaystack() {
    console.log(123);
    let amount = amountInput.value;
    if (!digits_only(amount) || amount.length < 2) {
        iziToast.warning({
            title: 'Warning!',
            message: 'Invalid amount',
            position: 'bottomRight'
        });
    } else {
        let email = document.getElementById("user_email").value;
        let phone = document.getElementById('user_phone').value;
        let name = document.getElementById('user_name').value;
        // let conversionRate = document.getElementById("dollar_rate").innerHTML;
        var uid = 'CUST-' + Math.floor((Math.random() * 1000000000) + 1);
        console.log(email);
        var handler = PaystackPop.setup({
            key: 'pk_test_0c79398dba746ce329d163885dd3fe5bc7e1f243',
            email: email,
            amount: amount * 100 , //multiply each amount by 100 to get kobo equivalent
            currency: "NGN", // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
            metadata: {
                custom_fields: [
                    {
                    display_name: "Mobile Number",
                    variable_name: "mobile_number",
                    value: phone
                    },
                    {
                        display_name: "Customer Email",
                        variable_name: "email",
                        value: email
                    },
                    {
                        display_name: "Customer Name",
                        variable_name: "name",
                        value: name
                    }
                ]
            },
            callback: function (response) {
                let reference = response.reference;
                $.ajax({
                    type: 'POST',
                    url: '/fundwallet',
                    data: {
                        email: email,
                        amount: amount,
                        reference: reference,
                        channel: "PAYSTACK",
                        payment_category: "Fund Wallet",
                        uid
                    },
                    success: function(data) {
                        if (data.status == true) {
                            iziToast.success({
                                title: 'Success!',
                                message: 'Wallet funded successfully',
                                position: 'bottomRight'
                            });
                            setTimeout(function () {
                                window.location=window.location;
                            }, 5000); 
                        } else {
                            iziToast.error({
                                title: 'Error!',
                                message: 'Something went wrong',
                                position: 'bottomRight'
                            });    
                        }
                    },
                    error: function () {
                        iziToast.error({
                            title: 'Error!',
                            message: 'Something went wrong',
                            position: 'bottomRight'
                        });
                    }
                });
            },
            onClose: function () {
                iziToast.warning({
                    title: 'Warning!',
                    message: 'Payment closed',
                    position: 'bottomRight'
                });
            }
        });
        handler.openIframe();
    }
}

function payWithCryptos() {
    let amount = amountInput.value;
    if (!digits_only(amount) || amount.length < 2) {
        iziToast.warning({
            title: 'Warning!',
            message: 'Invalid amount',
            position: 'bottomRight'
        });
    } else {
        let email = document.getElementById("user_email").value;
        let phone = document.getElementById('user_phone').value;
        let name = document.getElementById('user_name').value;
        paylot({
            amount: amount,
            key: 'pyt_sk-efffc3adeadd4eaba023a78e0acdea64',
            reference: Date.now() + '' + Math.floor((Math.random() * 1000000000) + 1),
            currency: 'USD',
            payload: {
                type: 'payment',
                subject: 'Cryptedge Wallet Funding',
                email: email,
                sendMail: true
            },
            onClose: function(){
                iziToast.warning({
                    title: 'Warning!',
                    message: 'PAYLOT CRYPTO channel closed',
                    position: 'bottomRight'
                });
            }
        }, (err, tx) => {
            if(err){
                iziToast.warning({
                    title: 'Warning!',
                    message: 'PAYLOT CRYPTO channel encountered an error',
                    position: 'bottomRight'
                });
            }else{
                //Transaction was successful
                let reference = tx.reference;
                let confirmed = tx.confirmed;
                let nairaValue = tx.nairaValue;
                let wallet_address = tx.address;
                let quantity = tx.amount;
                let amountSent = tx.realValue.amount;
                let currency = tx.realValue.currency;
                $.ajax({
                    type: 'POST',
                    url: '/fundbtcwallet',
                    data: {
                        email: email,
                        amount: quantity,
                        reference: reference,
                        channel: "PAYLOT CRYPTO",
                        payment_category: "Fund BTC Wallet",
                    },
                    success: function(data) {
                        if (data.status == true) {
                            iziToast.success({
                                title: 'Success!',
                                message: 'Wallet funded successfully',
                                position: 'bottomRight'
                            });
                            setTimeout(function () {
                                window.location=window.location;
                            }, 5000); 
                        } else {
                            iziToast.error({
                                title: 'Error!',
                                message: 'Something went wrong',
                                position: 'bottomRight'
                            });    
                        }
                    },
                    error: function () {
                        iziToast.error({
                            title: 'Error!',
                            message: 'Something went wrong',
                            position: 'bottomRight'
                        });
                    }
                });
            }
        });  
    }
}

function payWithCryptos2() {
    let amount = amountInput.value;
    if (!digits_only(amount) || amount.length < 2) {
        iziToast.warning({
            title: 'Warning!',
            message: 'Invalid amount',
            position: 'bottomRight'
        });
    } else {
        $.ajax({
            type: 'POST',
            url: '/createcheckout',
            data: {
                amount: amount,
            },
            success: function(data) {
                if (data.status == true) {
                    iziToast.success({
                        title: 'Success!',
                        message: "Processing checkout",
                        position: 'bottomRight'
                    });
                    //console.log(data);
                    setTimeout(function () {
                        window.location= data.url;
                    }, 5000); 
                    
                } else {
                    iziToast.error({
                        title: 'Error!',
                        message: data.message,
                        position: 'bottomRight'
                    });    
                }
            },
            error: function () {
                iziToast.error({
                    title: 'Error!',
                    message: 'Something went wrong',
                    position: 'bottomRight'
                });
            }
        });     
    }
}