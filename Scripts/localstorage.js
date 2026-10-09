import { createBook } from "./Book.js";

export function storeBooks(books){
    localStorage.setItem("books" ,JSON.stringify(books))

}

export function loadBook(){
    let books = localStorage.getItem("books")
    const saveBooks = JSON.parse(books) || []
    return saveBooks.map(data=>createBook(data))
}