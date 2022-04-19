$(document).ready(()=>{
    $("#subscribeBtn").click(()=>{
        console.log(123);
        var amount = $("#planPrice").val();
        var planName = $("#planName").val();
        var userName = $("#userName").val();
        var userId = $("#userId").val();
        var userEmail = $("#userEmail").val();
        var userPhone = $("#userPhone").val();
        var planId = $("#planId").val();
        var uid = 'CUST-' + Math.floor((Math.random() * 1000000000) + 1);
        var handler = PaystackPop.setup({
            key: 'pk_test_0c79398dba746ce329d163885dd3fe5bc7e1f243',
            email:userEmail,
            amount: Number(amount) * 100, //multiply each amount by 100 to get kobo equivalent
            currency: "NGN",
            metadata: {
                custom_fields: [
                    {
                    display_name: "Mobile Number",
                    variable_name: "mobile_number",
                    value: userPhone
                    },
                    {
                        display_name: "Customer Email",
                        variable_name: "email",
                        value: userEmail
                    },
                    {
                        display_name: "Customer Name",
                        variable_name: "name",
                        value: userName
                    },
                    {
                        display_name: "Plan Name",
                        variable_name: "plan_name",
                        value: planName
                    },
                    {
                        display_name: "Plan Price",
                        variable_name: "plan_price",
                        value: amount
                    },
                    
                ]
            },
            callback: function (response) {
                let reference = response.reference;
                console.log(response);
                $.ajax({
                    type: 'POST',
                    url: '/subscribe',
                    data: {
                        userId,
                        amount,
                        planId,
                        reference,
                        channel: "PAYSTACK",
                        uid,
                        payment_category: "Subscription"
                    },
                    success: function(data) {
                        if (data.success === true) {
                            iziToast.success({
                                title: 'Success!',
                                message: 'Subscription made successfully',
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
    })
})


function payWithPaystack() {
    var amount = $("#planPrice").val();
    var planName = $("#planName").val();
    var userName = $("#userName").val();
    var userId = $("#userId").val();
    var email = $("#userEmail").val();
    var userPhone = $("#userPhone").val();
    var planId = $("#planId").val();
    var handler = PaystackPop.setup({
        key: 'pk_test_0c79398dba746ce329d163885dd3fe5bc7e1f243',
        email: email,
        amount: Number(amount) * 100 , //multiply each amount by 100 to get kobo equivalent
        currency: "NGN",
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        metadata: {
            custom_fields: [
                {
                display_name: "Mobile Number",
                variable_name: "mobile_number",
                value: userPhone
                },
                {
                    display_name: "Customer Email",
                    variable_name: "email",
                    value: userEmail
                },
                {
                    display_name: "Customer Name",
                    variable_name: "name",
                    value: userName
                },
                {
                    display_name: "Plan Name",
                    variable_name: "plan_name",
                    value: planName
                },
                {
                    display_name: "Plan Price",
                    variable_name: "plan_price",
                    value: amount
                },
                
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
                    channel: "PAYSTACK"
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

