const search = document.querySelector('ion-icon[name="search"]');
const searchDiv = document.querySelector('#search-div div ');
let searchBox = false;
search.onclick = () => {
    if (searchBox === false) {
        searchDiv.style.width = "17em";
        searchBox = true;
    } else {
        searchDiv.style.width = "2em";
        searchBox = false;
    }
}

//carousel logic
const carouselSlider = document.querySelector(".carousel-slider");
const carouselSlides = Array.from(document.querySelectorAll(".carousel .carousel-slider .img"));
const prevBtn = document.querySelector("#previous-btn");
const nextBtn = document.querySelector("#next-btn");
const sliderDotsBox = document.querySelector(".slider-dots");
let current = 0;
let slideShowID;
let slideShowID2;

//create slider dots
for (let i = 0; i < carouselSlides.length; i++) {
    sliderDot = document.createElement('div');
    sliderDot.classList.add('slider-dot');
    sliderDot.setAttribute('data-index', `${i+1}`)
    sliderDotsBox.appendChild(sliderDot);
}

//carousel functions
function reset(arr, arr2) {
    for(let i = 0;i < arr.length; i++) {
        arr[i].style.visibility = "hidden";
        arr[i].style.transition = "all 2000ms cubic-bezier(1, 0.01, 0, 1)";
        arr2[i].classList.remove('active');
    }
}
function initSlides(arr, arr2) {
    reset(arr, arr2);
    arr[0].style.visibility = "visible";
    arr[0].style.transform = "translateX(0)";
    arr2[0].classList.add('active');
}

function nextSlide() {
    clearInterval(slideShowID);
    carouselSlides.forEach((slide) => {
        slide.style.transform = "translateX(-100%)";
    })
    if (current === (carouselSlides.length - 1)) {
        current = -1;
    }
    reset(carouselSlides, sliderDotsBox.children);
    carouselSlides[current + 1].style.visibility = "visible";
    carouselSlides[current + 1].style.transform = "translateX(0)";
    sliderDotsBox.children[current + 1].classList.add('active');
    current++;
    slideShowID = setInterval(slideShow, 7000);
}

function prevSlide() {
    clearInterval(slideShowID);
    reset(carouselSlides, sliderDotsBox.children);
    carouselSlides.forEach((slide) => {
        slide.style.transform = "translateX(100%)";
    })

    if (current === -1 || current === 0) {
        current = carouselSlides.length - 1;
        carouselSlides[current].style.visibility = "visible";
        carouselSlides[current].style.transform = "translateX(0)";
        sliderDotsBox.children[current].classList.add('active');
    }
    else {
        carouselSlides[current - 1].style.visibility = "visible";
        carouselSlides[current - 1].style.transform = "translateX(0)";
        sliderDotsBox.children[current - 1].classList.add('active');
        current--;
    }
    slideShowID = setInterval(slideShow, 7000);
}

function slideShow() {
    carouselSlides.forEach((slide) => {
        slide.style.transform = "translateX(-100%)";
    })
    if (current === (carouselSlides.length - 1)) {
        current = -1;
    }
    reset(carouselSlides, sliderDotsBox.children);
    carouselSlides[current + 1].style.visibility = "visible";
    carouselSlides[current + 1].style.transform = "translateX(0)";
    sliderDotsBox.children[current + 1].classList.add('active');
    current++;
}

// function resetSliderDots() {
//     for(let i = 0;i < sliderDotsBox.children.length;i++) {
//         sliderDotsBox.children[i].classList.remove('active');
//     }
// }

//carousel slideshow
slideShowID = setInterval(slideShow, 7000);


const sliderDots = [...sliderDotsBox.children];
sliderDots.forEach((sliderDot) => {
    sliderDot.addEventListener('click', (e) => {
        clearInterval(slideShowID);
        carouselSlides[current].style.transform = "translateX(-100%)";
        reset(carouselSlides, sliderDotsBox.children);
        current = ((e.target.dataset.index) - 1);
        carouselSlides[current].style.visibility = "visible";
        carouselSlides[current].style.transform = "translateX(0)";
        sliderDotsBox.children[current].classList.add('active');
        slideShowID = setInterval(slideShow, 7000);
    })
});

//carousel event listeners
initSlides(carouselSlides, sliderDotsBox.children);
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);