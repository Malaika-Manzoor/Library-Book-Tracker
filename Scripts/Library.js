export class Library {
    constructor() {
        this.books =[]
        
    }

    addBook(book){
        this.books.push(book)

        }

   *getBooks(books = this.books) {

   

    for (let book of books) {
        yield book
    }

    }

}


