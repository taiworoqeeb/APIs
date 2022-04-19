    const twoFaTag = document.getElementById('twofa');
    twoFaTag.addEventListener("click", function () {
        //This input has changed
        // check if the previous value is 0
        // if it is change it to 1 else change to 0
        $.ajax({
            type: 'POST',
            url: '/updatetwoway',
            data: {

            },
            success: function (data) {
                if (data.status == true) {
                    iziToast.success({
                        title: 'Success!',
                        message: data.message,
                        position: 'bottomRight'
                    });
                    setTimeout(function () {
                        window.location = window.location;
                    }, 4000);
                } else {
                    if (data.message != null || data.message != undefined) {
                        iziToast.error({
                            title: 'Error!',
                            message: data.message,
                            position: 'bottomRight'
                        });
                    } else {
                        iziToast.error({
                            title: 'Error!',
                            message: 'Something went wrong',
                            position: 'bottomRight'
                        });
                    }
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
    });

    const emailFaTag = document.getElementById('emailfa');
    emailFaTag.addEventListener("click", function () {
        //This input has changed
        // check if the previous value is 0
        // if it is change it to 1 else change to 0
        $.ajax({
            type: 'POST',
            url: '/emailtwoway',
            data: {

            },
            success: function (data) {
                if (data.status == true) {
                    iziToast.success({
                        title: 'Success!',
                        message: data.message,
                        position: 'bottomRight'
                    });
                    setTimeout(function () {
                        window.location = window.location;
                    }, 4000);
                } else {
                    if (data.message != null || data.message != undefined) {
                        iziToast.error({
                            title: 'Error!',
                            message: data.message,
                            position: 'bottomRight'
                        });
                    } else {
                        iziToast.error({
                            title: 'Error!',
                            message: 'Something went wrong',
                            position: 'bottomRight'
                        });
                    }
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
    });
