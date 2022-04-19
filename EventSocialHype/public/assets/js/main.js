// On scroll Navbar
$(window).scroll(function () {
    var sc = $(window).scrollTop()
    if (sc > 50) {
        $("#header-scroll").addClass("navbar-onscroll")
    } else {
        $("#header-scroll").removeClass("navbar-onscroll")
    }
});

document.addEventListener('contextmenu', event => event.preventDefault());