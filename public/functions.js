const search = document.querySelector('ion-icon[name="search"]');
const searchDiv = document.querySelector('#search-div div ');
const inputBox = document.querySelector('#search-div div #search-form input')
let searchBox = false;
search.onclick = () => {
    if (searchBox === false) {
        inputBox.focus()
        searchDiv.style.width = "15em";
        searchBox = true;
    } else {
        inputBox.blur();
        searchDiv.style.width = "2em";
        searchBox = false;
    }
}