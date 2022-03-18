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

posterBtn.addEventListener("click", () => {
    let heroUrl = posterInput.value;
    poster.setAttribute("src", heroUrl);
});

const blogImagesLinks = document.querySelector("#blog-images-links");
const addLinksBtn = document.querySelector("#blog-images-links-btn");
const linkDeleteBtn = document.querySelector(".delete-btn");
const BlogImagesPreview = document.querySelector("#blog-images-review-btn");
const previewedImages = document.querySelector(".previewed-images");
const publishBtn = document.querySelector("#publish-btn");

addLinksBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const parent = document.querySelector("#blog-images-links");
    const inputCont = document.createElement("div");
    const inputBox = document.createElement("input");
    const deleteBtn = document.createElement("button")

    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        deleteBtn.parentElement.remove();
    })

    inputCont.classList.add("link-cont");
    inputBox.classList.add("blog-posters");
    deleteBtn.classList.add("delete-btn");

    deleteBtn.innerText = "✕";

    inputCont.appendChild(inputBox);
    inputCont.appendChild(deleteBtn);
    parent.appendChild(inputCont);

    inputBox.setAttribute("placeholder", "E.g https://justcopyandpaste.com/img.jpg");
})

linkDeleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    linkDeleteBtn.parentElement.remove();
})

BlogImagesPreview.addEventListener("click", () => {
    const parent = document.querySelector("#blog-images-preview")
    let images = [];
    let imgUrls = Array.from(document.querySelectorAll(".blog-posters"))
    imgUrls.forEach(url => {
        images.push(url.value);
    });
    if(images.every(img => img === "")) {
        return
    };

    for(i = 0; i < imgUrls.length; i++) {
        imgUrls[i].setAttribute("name", `blogImage${i+1}`);
    };
    let text;
    images.length > 1 ? text = "Images" : text = "Image";
    images.length > 0 && ( previewedImages.innerText = `${imgUrls.length} ${text} Previewed`); 
    parent.innerHTML = "";
    images.forEach(imgUrl => {
        const image = document.createElement("img")
        image.classList.add("img-preview");
        image.setAttribute("src", imgUrl);
        parent.appendChild(image);
    });
})

publishBtn.addEventListener("click", () => {
    let imgUrls = Array.from(document.querySelectorAll(".blog-posters"));
    for(i = 0; i < imgUrls.length; i++) {
        imgUrls[i].setAttribute("name", `blogImage${i+1}`);
    };
});

//tag creator 
const tagsInputBox = document.querySelector("#tags");
const tagsDisplay = document.querySelector(".tags-display");
const tagBtn = document.querySelector(".add-tag");

tagBtn.addEventListener('click', () => {
    const tagValue = document.querySelector("#tags").value;
    const tagBox = document.createElement("div");
    const tag = document.createElement("input");
    const tagRemoveBtn = document.createElement("span");
        
    tagBox.classList.add("tag-box")
    tagRemoveBtn.classList.add("tag-remove-btn")

    tagRemoveBtn.innerText = "✕";

    if(tagValue.length < 1) return;

    tag.setAttribute("name", "tags");
    tag.setAttribute("readonly", "true");
    tag.classList.add("tag");
    tag.style.width = `calc((${(tagValue.length)}ch) + 20px)`
    tag.value = tagValue;
    tagBox.appendChild(tag)
    tagBox.appendChild(tagRemoveBtn)
    tagsDisplay.appendChild(tagBox);
    tagsInputBox.value = "";

    tagRemoveBtn.addEventListener('click', function () {
        this.parentElement.remove()
    })
})