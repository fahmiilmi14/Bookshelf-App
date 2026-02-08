const books = [];
const RENDER_BUKU = 'render-book';
 
document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('bookForm');
    form.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
    });

    const search = document.getElementById('searchBook');
    search.addEventListener('submit', function(event){
        event.preventDefault();
        searchBook();
    })
    if(isStorageExists()){
        loadDataFromLocal();
    }
});
 
function addBook(){
    const bookTitle = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const date = Number(document.getElementById('bookFormYear').value);
    const idBook = generateId();
    const isSudah = document.getElementById('bookFormIsComplete').checked;
 
    const objectBook = generateBookObject(idBook, bookTitle, author, date, isSudah);
    books.push(objectBook);
    document.dispatchEvent(new Event(RENDER_BUKU));
    saveData();
    document.getElementById('bookForm').reset();
}
 
function generateId(){
    return +new Date();
}
 
function generateBookObject(id, title, author, year, isComplete){
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function searchBook(){
    const judulDicari = document.getElementById('searchBookTitle').value.toLowerCase();

    const filteredBooks = books.filter(function (book) {
        return book.title.toLowerCase().includes(judulDicari);
    });

    renderFilteredBooks(filteredBooks);
}

function renderFilteredBooks(filteredBooks) {
    const uncompletedBookList = document.getElementById('incompleteBookList');
    const completedBookList = document.getElementById('completeBookList');

    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';

    for (const bookItem of filteredBooks) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            uncompletedBookList.append(bookElement);
        } else {
            completedBookList.append(bookElement);
        }
    }
}
 
document.addEventListener(RENDER_BUKU, function(){
    const uncompletedBook = document.getElementById('incompleteBookList');
    uncompletedBook.innerHTML = '';
 
    const completedBook = document.getElementById('completeBookList');
    completedBook.innerHTML = '';
 
    for(const bookItem of books){
        const bookElement = makeBook(bookItem);
        if(!bookItem.isComplete){
            uncompletedBook.append(bookElement);
        }
        else {
            completedBook.append(bookElement);
        }
    }
});
 
function makeBook(bookObject) {
  const container = document.createElement('div');
  container.setAttribute('data-bookid', bookObject.id);
  container.setAttribute('data-testid', 'bookItem');

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.title;
  bookTitle.setAttribute('data-testid', 'bookItemTitle');

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = `Penulis: ${bookObject.author}`;
  bookAuthor.setAttribute('data-testid', 'bookItemAuthor');

  const bookYear = document.createElement('p');
  bookYear.innerText = `Tahun: ${bookObject.year}`;
  bookYear.setAttribute('data-testid', 'bookItemYear');

  const buttonContainer = document.createElement('div');

  const statusButton = document.createElement('button');
  statusButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  
  if (bookObject.isComplete) {
    statusButton.innerText = 'Belum selesai dibaca';
    statusButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });
  } else {
    statusButton.innerText = 'Selesai dibaca';
    statusButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });
  }

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus buku';
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.addEventListener('click', function () {
    removeBook(bookObject.id);
  });

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit buku';
  editButton.setAttribute('data-testid', 'bookItemEditButton');

  buttonContainer.append(statusButton, deleteButton, editButton);
  container.append(bookTitle, bookAuthor, bookYear, buttonContainer);

  return container;
}
 
function addBookToCompleted(bookId){
    const bookTarget = findBookId(bookId);
 
    if(bookTarget == null) return;
 
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_BUKU));
    saveData();
}
 
function findBookId(bookId){
    for(const bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}
 
function removeBook(bookId){
    const bookTarget = findBookIdbookId(bookId);
    if(bookTarget === -1) return;
 
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_BUKU));
    saveData();
}
 
function undoBookFromCompleted(bookId){
    const bookTarget = findBookId(bookId);
 
    if(bookTarget == null) return;
 
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_BUKU));
    saveData();
}
 
function findBookIdbookId(bookid){
    for(const index in books){
        if(books[index].id === bookid){
            return index;
        }
    }
 
    return -1;
}
 
function saveData(){
    if(isStorageExists()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_BOOK));
    }
}
 
const SAVED_BOOK = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';
 
function isStorageExists(){
    if(typeof (Storage) === 'undefined'){
        alert('Browser Unsupported');
        return false;
    }
    return true;
}
 
document.addEventListener(SAVED_BOOK, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});
 
function loadDataFromLocal(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
 
    if(data !== null){
        books.length = 0;
        for(const book of data){
            books.push(book);
        }
    }
 
    document.dispatchEvent(new Event(RENDER_BUKU));
}