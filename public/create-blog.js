// custom dropdown
const form =  document.querySelector("form");
const dropDownCont = document.querySelector("#bc-form .dropdown");
const dropDown = document.querySelector("#bc-form .dropdown #input");
const dropDownValue = document.querySelector("#bc-form .dropdown #input input");
const dropDownOpts = document.querySelector("#bc-form .dropdown #options");

dropDown.addEventListener('click', () => {
    dropDownCont.classList.toggle('show');
});
dropDownOpts.addEventListener('click', (e) => {
    dropDownCont.classList.toggle('show');
    dropDownValue.value = e.target.innerText;
});

// poster input
const poster = document.querySelector("#poster");
const posterInput = document.querySelector("#hero-img");
const posterBtn = document.querySelector("#hero-text label");

posterInput.addEventListener('change', () => {
    const reader = new FileReader();
    const file = posterInput.files[0];
    if (file) {
        posterBtn.innerText = "change poster";
    }
    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
        const src = reader.result;
        poster.src = src;
    })
})

// blog images input
const blogImgCont = document.querySelector("#blog-images-preview");
const blogImages = document.querySelector("#blog-posters");
const blogImgBtn = document.querySelector("#blog-images-text label");
let previewedImages = document.querySelector(".previewed-images");

blogImages.addEventListener('change', async (event) => {
    // empty blog image container first
    blogImgCont.innerHTML = "";
    // Convert the FileList into an array and iterate
    let files = Array.from(event.target.files).map(file => {
    
        // Define a new file reader
            let reader = new FileReader();
    
        // Create a new promise
        return new Promise(resolve => {
    
            // Resolve the promise after reading file
            reader.onload = () => resolve(reader.result);
    
            // Read the file as a DataURL
            reader.readAsDataURL(file);
    
        });
    
    });
    
        // At this point you'll have an array of results
        let images = await Promise.all(files);
        images.forEach((img) => {
            let imgPreview = document.createElement('img');
            imgPreview.setAttribute('src', img);
            imgPreview.classList.add('img-preview');
            blogImgCont.appendChild(imgPreview);
        });
        let numOfImages = images.length;
        let previewText;
        (numOfImages < 2) ? previewText = "Image" : previewText = "Images" 
        previewedImages.innerText = `${numOfImages} ${previewText} Previewed`;
})