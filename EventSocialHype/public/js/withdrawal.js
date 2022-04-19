$(document).ready(function() {
    
  
// getting bank list
$.ajax({
    type: 'GET',
    url: '/banklist',
    data: {},
    beforeSend: function () {

    },
    complete: function (data) {

    },
    success: function (data) {
        $("#bank").empty();
        for (let i = 0; i < data.data.length; i++) {
            let id = data.data[i].code;
            let name = data.data[i].name;
            $("#bank").append("<option value='" + id + "'>" + name + "</option>");

        }
    },
    error: function () {
    }
});

// verifying account number
$("#acc_number").keyup(function() {
    let accountNumberLength = $(this).val().length == null ? 0 : $(this).val().length;
    if(accountNumberLength > 9) {
        let bankCode = $("#bank").val();
        $.ajax({
            type: 'POST',
            url: '/verifyAccount',
            dataType: 'JSON',
            data: {
                bank_code: bankCode,
                account: $(this).val()
            },
            beforeSend: function () {
        
            },
            complete: function (data) {
        
            },
            success: function (data) {
                if(data.status) {
                    $("#acc_name").val(`${data.data.account_name}`);
                } else {
                    if(data.message != null || data.message != undefined) {
                        $("#acc_name").val(`${data.message}`);
                    } else {
                        $("#acc_name").val(`Account not valid`);
                    }
                    
                }
            },
            error: function () {
                $("#acc_name").val(`Error fetching name`);
            }
        });      
    }
  });
});


const withdrawForm = document.getElementById("withdarawForm");
withdrawForm.addEventListener("submit", e => {
    e.preventDefault();
    let bankCode =  e.target.elements.bank.value;
    let bankName = $("#bank option:selected").text();
    let accNumber = e.target.elements.acc_number.value;
    let accName = e.target.elements.acc_name.value;
    let amount = e.target.elements.amount.value;
    if(bankCode.length < 1 || bankName.length < 2  || accName.length < 3  || accNumber.length < 6 || amount.length < 1) {
        iziToast.error({
            title: 'Error!',
            message: 'Enter all fields',
            position: 'bottomRight'
        });        
    } else {
        $.ajax({
            type: 'POST',
            url: '/createwithdrawal',
            dataType: 'JSON',
            data: {
                bank_code: bankCode,
                bank_name: bankName,
                account_number: accNumber,
                account_name: accName,
                amount: amount,
            },
            beforeSend: function () {
        
            },
            complete: function (data) {
        
            },
            success: function (data) {
                if(data.status) {
                    iziToast.success({
                        title: 'Success!',
                        message: data.message,
                        position: 'bottomRight'
                    });
                    setTimeout(function () {
                        window.location=window.location;
                    }, 5000); 
                } else {
                    if(data.message != null || data.message != undefined) {
                        iziToast.error({
                            title: 'Error!',
                            message: data.message,
                            position: 'bottomRight'
                        });
                    } else {
                        iziToast.error({
                            title: 'Error!',
                            message: "Server Errord, try again",
                            position: 'bottomRight'
                        });
                    }
                    
                }
            },
            error: function () {
                iziToast.error({
                    title: 'Error!',
                    message: "Server Error, try again",
                    position: 'bottomRight'
                });
            }
        });   
    }
});
