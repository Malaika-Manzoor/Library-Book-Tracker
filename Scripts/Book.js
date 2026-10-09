const bookPrototype = {
  borrow() {
    if (this.isBorrowed === true) {
     
      return false;
    }
    this.isBorrowed = true;
    this.notify(this)
    return true;
  },
  returnBook() {
    this.isBorrowed = false;
    this.notify(this)
    
  },
  getDetails() {
    return `Title: ${this.title}\n Author: ${this.author} \n ISBN: ${this.ISBN}`;
  },
  subscribe(observer) {
    this.observer = observer;
  },
  notify(data) {
    if(this.observer){
      this.observer(data)
    }
  }
};

export function createBook({ title, author, ISBN, isBorrowed = false }) {
  const myBook = Object.create(bookPrototype);
  myBook.title = title;
  myBook.author = author;
  myBook.ISBN = ISBN;
  myBook.isBorrowed = isBorrowed;
  return myBook;
}