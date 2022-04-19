const cookieContainer = document.querySelector('.cookie-container');
const cookieButton = document.querySelector('.cookie-button');

cookieButton.addEventListener("click", ()=>{
  cookieContainer.classList.remove("active");
//   localStorage.setItem("cookieBannerDisplayed", "true")
});

setTimeout(()=>{
  if(!localStorage.getItem("cookieBannerDisplayed")){
  cookieContainer.classList.add("active");
  }
}, 2000);



$(document).ready(function(){

$('.itemm').slick({
dots: true,
infinite: true,
speed: 800,
autoplay: true,
autoplaySpeed: 2000,
slidesToShow: 3,
slidesToScroll: 4,
responsive: [
{
breakpoint: 1024,
settings: {
slidesToShow: 3,
slidesToScroll: 3,
infinite: true,
dots: true
}
},
{
breakpoint: 600,
settings: {
slidesToShow: 2,
slidesToScroll: 2
}
},
{
breakpoint: 480,
settings: {
slidesToShow: 1,
slidesToScroll: 1
}
}

]
});
});