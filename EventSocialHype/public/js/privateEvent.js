let amountInput = document.getElementById("donatorAmount");
const digits_only = string => [...string].every(c => '0123456789'.includes(c));
let eventId = document.getElementById("donatEventId").value;

$(document).ready(()=>{
    
    $("#privateDonateBtn").click(()=>{
        console.log(123);
        var method = $("#donatorMeans").val();
        console.log(method);
        switch (method) {
            case "card":
                donateWithPaystack()
                break;
            case "crypto":
                donateWithCryptos()
                $('#PrivateDonateModal').modal('toggle');
                // $('#fundCrypto').modal('toggle');
                break;
        }
    })

    
    
})

// Donation Function
function donateWithPaystack() {
    let amount = $("#donatorAmount").val();
    if (!digits_only(amount)) {
        iziToast.warning({
            title: 'Warning!',
            message: 'Invalid amount',
            position: 'bottomRight'
        });
    } else {
        let email = document.getElementById("donatorEmail").value;
        let name = document.getElementById('donatorName').value;
        console.log(email, name);
        // let conversionRate = document.getElementById("dollar_rate").innerHTML;
        var uid = 'TR-' + Math.floor((Math.random() * 1000000000) + 1);
        console.log(email);
        var handler = PaystackPop.setup({
            key: 'pk_test_0c79398dba746ce329d163885dd3fe5bc7e1f243',
            email: email,
            amount: amount * 100 , //multiply each amount by 100 to get kobo equivalent
            currency: "NGN", // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
            metadata: {
                custom_fields: [
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
                    url: '/make-donation',
                    data: {
                        name,
                        email,
                        eventId,
                        amount: amount,
                        reference: reference,
                        currency: "NGN",
                        type: "naira"
                    },
                    success: function(data) {
                        if (data.status == true) {
                            iziToast.success({
                                title: 'Success!',
                                message: 'Donation Made Successfully',
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

function donateWithCryptos() {
    let amount = $("#donatorAmount").val();
    if (!digits_only(amount) ) {
        iziToast.warning({
            title: 'Warning!',
            message: 'Invalid amount',
            position: 'bottomRight'
        });
    } else {
        let email = document.getElementById("donatorEmail").value;
        let name = document.getElementById('donatorName').value;
        paylot({
            amount: amount,
            key: 'pyt_pk-07953fa1e6d5479aac5b8362e01936b0',
            reference: "TR-"+Date.now() + '' + Math.floor((Math.random() * 1000000000) + 1),
            currency: 'USD',
            payload: {
                type: 'payment',
                subject: 'Donating To Event with Id:'+eventId,
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
                    url: '/make-donation',
                    data: {
                        name,
                        email,
                        eventId,
                        amount: nairaValue,
                        reference: reference,
                        currency: "USD",
                        type: "crypto"
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
                console.log(123);
            }
        });  
    }
}
