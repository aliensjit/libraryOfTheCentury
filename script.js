//General
const library = document.getElementById("books");
const form = document.getElementById("newBook");
var myLibrary = [];
//Form elements
const newForm = document.getElementById("newForm");
const closeForm = document.getElementById("closeForm");
const btnAddBook = document.getElementById("btnAdd");
//New book inputs
const newTitle = document.getElementById("title");
const newAuthor = document.getElementById("author");
const newSummary = document.getElementById("summary");
const newPages = document.getElementById("pages");
const newStatus = document.getElementById("status");
const btnSubmit = document.getElementById("submitBtn");
//Book info elements
const closeBook = document.getElementById("closeBook");
const bookInfo = document.getElementById("bookInfo");
const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookSummary = document.getElementById("bookSummary");
const bookPages = document.getElementById("bookPages");
const bookStatus = document.getElementById("bookStatus");
const deleteBook = document.getElementById("deleteBook");
//Pop-ups
const showForm = e => { newForm.style.visibility = "visible"; library.style.filter = "blur(2px)"; }
const hideForm = e => { newForm.style.visibility = "hidden"; library.style.filter = "none"; }
const showBookInfo = e => { bookInfo.style.visibility = "visible"; library.style.filter = "blur(2px)"; }
const hideBookInfo = e => { bookInfo.style.visibility = "hidden"; library.style.filter = "none"; }

//Event listeners
function eventListeners() {
//Commands to create book
	btnSubmit.onclick = () => { createBook(newTitle.value, newAuthor.value, newSummary.value,  newPages.value, newStatus.value); };
//Opens new book form
	btnAddBook.addEventListener('click', showForm);
//Closes new book form
	closeForm.addEventListener('click', hideForm);
//Closes book info
	closeBook.addEventListener('click', hideBookInfo);

//Removes book from library
	deleteBook.onclick = e => {
		for(i = 0; i < myLibrary.length; i ++){
			if(e.target && e.target.className === "book" + i) {
				if (confirm("Are you really going to throw me away?")) {
					myLibrary.splice(i, 1);
					document.location.href="";
				}
			}
			saveToStorage();
		}
	}
//Toggles read status
	bookStatus.onclick = e => {
		for(i = 0; i < myLibrary.length; i ++){
			var currentBook = myLibrary[i];
			if(e.target.className === "book" + i && bookStatus.textContent === "Not Read") {
				currentBook.status = "1";
			} else if(bookStatus.textContent === "Read"){
				currentBook.status = "false";
			}
			saveToStorage();
		}
	}
}


let index = 1;

//Book constructor
function Book(title, author, summary, pages, status = false) {
	this.id = index ++;
	this.title = title;
	this.author = author;
	this.summary = summary;
	this.pages = pages;
	this.status = status;
}


document.onclick = e => {
//Shows book info
	for(i = 0; i < myLibrary.length; i ++){
		if(e.target && e.target.className === "book" + i) {
			hideBookInfo();
			showBookInfo();
			var currentBook = myLibrary[i];
			bookTitle.textContent = currentBook.title;
			bookAuthor.textContent = "by " + currentBook.author;
			bookSummary.textContent = currentBook.summary;
			bookSummary.className = "bookSummary"
			bookPages.textContent = currentBook.pages + " pages";
			if(currentBook.status === "false" || currentBook.status === false ){
				bookStatus.textContent = "Not Read";
			} else if(currentBook.status === "1"){
				bookStatus.textContent = "Read";
			}
//Sets book class
			bookStatus.className = "book" + i;
			deleteBook.className = "book" + i;
		}
	}
//Hides book info when opening new book form
	if(e.target === btnAddBook){
		hideBookInfo();
	}
//Hides new book form when opening book info
	if(bookInfo.style.visibility === "visible"){
		hideForm();
	}
}

//Creates book and adds it to myLibrary Array
function createBook(title, author, summary, pages, status) {
	if (title === "" || author === "") {
		alert("Adding book was unsuccessful. Please fill up all fields.")
	} else {
	var book = new Book(title, author, summary, pages, status);
	myLibrary.push(book);
	saveToStorage();
	form.reset();
	alert("Book added successfully.")
	}
}

//Creates book display on the page
function render() {
	for(i = myLibrary.length - 1; i >= 0; i -- ) {
		var libraryBook = document.createElement("p");
		libraryBook.className = "book" + i;
		libraryBook.innerHTML = `${myLibrary[i].title} <span style='float: right;'>${myLibrary[i].author}</span><br/>`;
		library.appendChild(libraryBook);
	}
}

//Checks for availablity of local storage -- code retrieved from MDN
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

//Saves library data to Storage 
function saveToStorage() {
	if (storageAvailable('localStorage')) {
		let dataString = JSON.stringify(myLibrary);
		localStorage.setItem("mylibrary.books", dataString);
		localStorage.setItem("mylibrary.index", index);
	} else {
	alert("No local storage available found. Any changes will be lost when page is refreshed.")
	}
}

//Adds books for default display
function defaultBooks() {
	createBook("Harry Potter and The Philosopher's Stone", "J.K. Rowling", "", "332");
	createBook("Harry Potter and The Chamber of Secrets", "J.K. Rowling", "", "332");
	createBook("Harry Potter and The Prisoner of Azkaban", "J.K. Rowling", "", "332");
	createBook("Harry Potter and The Goblet of Fire", "J.K. Rowling", "", "332");
	createBook("Harry Potter and The Order of the Phoenix", "J.K. Rowling", "", "332");
	createBook("Harry Potter and The Half-Blood Prince", "J.K. Rowling", "", "332");
	createBook("Harry Potter and The Deathly Hollows", "J.K. Rowling", "", "332");
	createBook("Harry Potter and The Children of Hogwarts", "J.K. Rowling", "", "332");
}

//Removes book data from local storage
const removeFromStorage = () => {
  if (storageAvailable('localStorage')) {
    localStorage.removeItem("mylibrary.books")
    localStorage.removeItem("mylibrary.index")
  }  
}

//Retrieves book data from storage
const reloadFromStorage = () => {
  if (storageAvailable('localStorage')) {
    let dataArray = localStorage.getItem("mylibrary.books")
    let storedIndex = localStorage.getItem("mylibrary.index")
    if (dataArray) {
      myLibrary = JSON.parse(dataArray)
      index = parseInt(storedIndex)
	}
	else defaultBooks();
  }
}


eventListeners();
reloadFromStorage();
render();
