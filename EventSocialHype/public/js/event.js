let amountInput = document.getElementById("amount");
const digits_only = string => [...string].every(c => '0123456789'.includes(c));
let minimum = document.getElementById("minimumDeposit");
let eventId = document.getElementById("eventId").value;
let eventRate = document.getElementById("eventRate").value;
let eventTerm = document.getElementById("eventTerm").value;

$(document).ready(()=>{
    $("#investBtn").click(()=>{
        var method = $("#means").val();
        console.log(method);
        switch (method) {
            case "card":
                payWithPaystack()
                break;
            case "crypto":
                payWithCryptos()
                break;
        }
    });

    $("#means").change(()=>{
        $("#interestAmount").val('');
        $("#totalAmount").val('');
        $("#calculator").hide();
        $("#calculatorAmt").hide();
        $("#amount").val('');
    })

    $("#amount").keyup(()=>{
        var amt = $("#amount").val();
        var interestAmt =Number(amt) * (Number(eventRate)/100);
        var totalAmount = interestAmt + Number(amt)
        var method = $("#means").val();
        if (method === "card") {
            interestAmt = Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format((Number(interestAmt)));
            totalAmount = Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format((Number(totalAmount)));
        }
        if (method === "crypto") {
            interestAmt = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((Number(interestAmt)));
            totalAmount = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((Number(totalAmount)));
        }
        $("#calculator").show();
        $("#calculatorAmt").show();
        $("#interestAmount").val(interestAmt);
        $("#totalAmount").val(totalAmount);
        console.log(amt, interestAmt, totalAmount);
    })

    $("#donateBtn").click(()=>{
        var method = $("#donateMeans").val();
        console.log(method);
        switch (method) {
            case "card":
                donateWithPaystack()
                break;
            case "crypto":
                donateWithCryptos()
                $('#donateModal').modal('toggle');
                // $('#fundCrypto').modal('toggle');
                break;
        }
    })

    
    
})

function payWithPaystack() {
    var minimumDeposit = Number(minimum.value);
    let amount = amountInput.value;
    if (!digits_only(amount) || amount < minimumDeposit) {
        iziToast.warning({
            title: 'Warning!',
            message: 'Invalid amount for Investment',
            position: 'bottomRight'
        });
    } else {
        let email = document.getElementById("userEmail").value;
        let phone = document.getElementById('userPhone').value;
        let name = document.getElementById('userName').value;
        let userId = document.getElementById('userId').value;
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
                    url: '/make-investment',
                    data: {
                        userId,
                        eventId,
                        amount: amount,
                        reference: reference,
                        channel: "PAYSTACK",
                        payment_category: "Event Invest",
                    },
                    success: function(data) {
                        if (data.status == true) {
                            iziToast.success({
                                title: 'Success!',
                                message: 'Event joined successfully',
                                position: 'bottomRight'
                            });
                            setTimeout(function () {
                                window.location=window.location;
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

// Donation Function

function donateWithPaystack() {
    console.log(minimumDeposit);
    let amount = $("#donateAmount").val();
    if (!digits_only(amount)) {
        iziToast.warning({
            title: 'Warning!',
            message: 'Invalid amount',
            position: 'bottomRight'
        });
    } else {
        let email = document.getElementById("userEmail").value;
        let phone = document.getElementById('userPhone').value;
        let name = document.getElementById('userName').value;
        let userId = document.getElementById('userId').value;
        console.log(email, name, phone);
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


function payWithCryptos() {
    let amount = amountInput.value;
    if (!digits_only(amount) || amount.length < 2) {
        iziToast.warning({
            title: 'Warning!',
            message: 'Invalid amount',
            position: 'bottomRight'
        });
    } else {
        let email = document.getElementById("userEmail").value;
        let phone = document.getElementById('userPhone').value;
        let name = document.getElementById('userName').value;
        let userId = document.getElementById('userId').value;
        paylot({
            amount: amount,
            key: 'pyt_pk-07953fa1e6d5479aac5b8362e01936b0',
            reference: "TR-"+Date.now() + '' + Math.floor((Math.random() * 1000000000) + 1),
            currency: 'USD',
            payload: {
                type: 'payment',
                subject: 'Investment Payment',
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

                console.log(reference, currency, userId, amountSent, confirmed);
                $.ajax({
                    type: 'POST',
                    url: '/make-investment',
                    data: {
                        userId,
                        eventId,
                        amount: nairaValue,
                        reference: reference,
                        channel: "BTC",
                        payment_category: "Event Invest",
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
function donateWithCryptos() {
    let amount = $("#donateAmount").val();
    if (!digits_only(amount) ) {
        iziToast.warning({
            title: 'Warning!',
            message: 'Invalid amount',
            position: 'bottomRight'
        });
    } else {
        let email = document.getElementById("userEmail").value;
        let phone = document.getElementById('userPhone').value;
        let name = document.getElementById('userName').value;
        let userId = document.getElementById('userId').value;
        paylot({
            amount: amount,
            key: 'pyt_pk-07953fa1e6d5479aac5b8362e01936b0',
            reference: "TR-"+Date.now() + '' + Math.floor((Math.random() * 1000000000) + 1),
            currency: 'USD',
            payload: {
                type: 'payment',
                subject: 'Event Donation Funding',
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
