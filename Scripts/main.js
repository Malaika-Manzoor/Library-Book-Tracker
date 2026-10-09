import { createBook } from "./Book.js";
import {ISBN_Validation} from "./validator.js"
import { Library } from "./Library.js";
import { storeBooks,loadBook } from "./localstorage.js";

const bookTitle = document.querySelector("#title");
const bookAuthor = document.querySelector("#author")
const isbn = document.querySelector("#ISBN")
const form = document.querySelector("#BookForm")
const error = document.querySelector(".error")
const success = document.querySelector(".success")
const bookLists = document.querySelector("#BookLists")
const search = document.querySelector("#searchText")

const library = new Library()
const savebooks = loadBook()

savebooks.forEach(book => {
    book.subscribe(()=>{
        renderBooks()
    })
    library.addBook(book)
});
renderBooks()


function renderBooks(books = library.books){
     
    bookLists.innerHTML = ""
    const bookGenerator = library.getBooks(books)
    let result = bookGenerator.next()
    while(!result.done){
        const book = result.value

        const list = document.createElement("li")
        list.textContent = book.getDetails()
     
        list.classList.add("book-card");
        list.dataset.isbn = book.ISBN;

        const borrowBtn = document.createElement("button")
        if(book.isBorrowed == true){
            borrowBtn.textContent = "Borrowed"
            borrowBtn.classList.add("borrowed")
        } else {
            borrowBtn.textContent = "Borrow"
        } 
        borrowBtn.classList.add("show-borrow")

        const returnBtn = document.createElement("button")
        if(book.isBorrowed == false){
            returnBtn.textContent = "Available"
            returnBtn.classList.add("available")
        } else {
            returnBtn.textContent = "Return"
        }
        returnBtn.classList.add("show-return")
       
        list.appendChild(borrowBtn)
        list.appendChild(returnBtn)
        bookLists.appendChild(list)
        result = bookGenerator.next()

    }
}

form.addEventListener("submit",(event)=>{
    event.preventDefault()
    
    // if(title.value.trim() === "" ||
    //     author.value.trim() === "" ||
    //     isbn.value.trim() === ""){
    //     error.textContent = "Field are empty !!!"
    //     error.classList.add("show-error")
    //     return;
    // } I comment this logic because I used now required 
    
    if(ISBN_Validation(isbn.value)== false){
        error.textContent = "Invalid ISBN"
        setTimeout(()=>{
            error.textContent = ""
            error.classList.remove("show-error") 
        },3000)
        error.classList.add("show-error")
        return;
    }
    
     
    
    const myBook = createBook({
        title:bookTitle.value,
        author:bookAuthor.value,
        ISBN:isbn.value,
       
    })

    myBook.subscribe(()=>{
        renderBooks()
    })

    const duplicate = library.books.some(book => book.ISBN === myBook.ISBN);

    if(duplicate){
        error.textContent = "Duplicate ISBN"
        setTimeout(()=>{
            error.textContent = ""
            error.classList.remove("show-error")
        },3000)
        error.classList.add("show-error")
        return;
    }
    
     
    library.addBook(myBook) 
    storeBooks(library.books)
    success.textContent = "Sucessfully book added"
    setTimeout(()=>{
        success.textContent = ""
        success.classList.remove("show-success")
    },3000)
    success.classList.add("show-success")
   
     
})


search.addEventListener("input" ,(event)=>{
    const text = event.target.value.trim()
    const regex = new RegExp(text,"i")
    const filterBooks = library.books.filter(book =>{
        return regex.test(book.title)||
                regex.test(book.author) ||
                regex.test(book.ISBN)
    })

    renderBooks(filterBooks)
    console.log("SEARCH:", text)
    console.log("FILTERED:", filterBooks)
    
})

bookLists.addEventListener("click",(event)=>{
    if(event.target.classList.contains("show-borrow")){
        const card = event.target.closest(".book-card")
        const isbn = card.dataset.isbn
        const book = library.books.find(book=>book.ISBN === isbn)
        if(!book){
            return
        }
        const borrowed = book.borrow()
       if(borrowed){
            // event.target.textContent = "borrowed"
            // event.target.classList.add("borrowed")
            // const returnBtn = card.querySelector(".show-return")
            // returnBtn.textContent = "Return"
            storeBooks(library.books)
        }
       
        
    }
    if(event.target.classList.contains("show-return")){
        const card = event.target.closest(".book-card")
        const isbn = card.dataset.isbn
        const book = library.books.find(book=>book.ISBN === isbn)
        if(!book){
            return
        }
       if(book.isBorrowed ===false){
            return
       }    

       book.returnBook()
    //When Update UI without the Observer
    //    event.target.textContent = "Available"
    //    event.target.classList.add("available")   
    //    const borrowBtn = card.querySelector(".show-borrow")
    //    borrowBtn.textContent = "Borrow"
    //    borrowBtn.classList.remove("borrowed")
        storeBooks(library.books)
       
        
    }
})


