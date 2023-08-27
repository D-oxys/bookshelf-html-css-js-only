let searchResults = [];

function searchBooks(query) {
  searchResults = [];

  const existingBooks = JSON.parse(localStorage.getItem("books")) || [];

  if (query.trim() === "") {
    searchResults = existingBooks;
  } else {
    searchResults = existingBooks.filter((book) => {
      const titleMatch = book.title.toLowerCase().includes(query.toLowerCase());
      const authorMatch = book.author.toLowerCase().includes(query.toLowerCase());
      return titleMatch || authorMatch;
    });
  }

  refreshBookshelves();
}

addBookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = parseInt(document.getElementById("year").value);
  const isComplete = document.getElementById("isComplete").checked;
  const id = +new Date();

  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  const existingBooks = JSON.parse(localStorage.getItem("books")) || [];

  existingBooks.push(newBook);

  localStorage.setItem("books", JSON.stringify(existingBooks));

  alert("Selamat Buku Behasil di Tambahkan!");
  addBookForm.reset();

  // Refresh display
  refreshBookshelves();
});

// Function to refresh bookshelves
function refreshBookshelves() {
  const existingBooks = JSON.parse(localStorage.getItem("books")) || [];

  const unreadShelf = document.getElementById("unreadShelf");
  const readShelf = document.getElementById("readShelf");

  // Memisahkan buku berdasarkan status
  const unreadBooks = existingBooks.filter((book) => !book.isComplete);
  const readBooks = existingBooks.filter((book) => book.isComplete);

  // Menampilkan buku pada rak yang sesuai
  displayBooksOnShelf(unreadBooks, unreadShelf);
  displayBooksOnShelf(readBooks, readShelf);
}

function displayBooksOnShelf(books, shelf) {
  shelf.innerHTML = "";

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
            <div class="book-info">
              <p><span>Nama Buku :</span> ${book.title}</p>
              <p><span>Author :</span> ${book.author}</p>
              <p><span>Year :</span> ${book.year}</p>
            </div>
            <div class="button-container">
              ${
                window.innerWidth >= 768
                  ? `<button class="read-button">${book.isComplete ? '<i class="fas fa-times"></i> Belum Dibaca' : '<i class="fas fa-check"></i> Sudah Dibaca'}</button>
                     <button class="delete-button"><i class="fas fa-trash-alt"></i> Hapus Buku</button>`
                  : `
                    <button class="read-button icon-only">${book.isComplete ? '<i class="fas fa-times"></i>' : '<i class="fas fa-check"></i>'}</button>
                    <button class="delete-button icon-only"><i class="fas fa-trash-alt"></i></button>`
              }
            </div>
          `;

    shelf.appendChild(bookCard);

    const readButton = bookCard.querySelector(".read-button");
    readButton?.addEventListener("click", () => toggleReadStatus(book));

    const deleteButton = bookCard.querySelector(".delete-button");
    deleteButton?.addEventListener("click", () => deleteBook(book));
  });
}

// Event listener untuk mendeteksi perubahan lebar layar
window.addEventListener("resize", () => {
  refreshBookshelves();
});

// Fungsi untuk mengubah status buku menjadi "Sudah Dibaca" atau sebaliknya
function toggleReadStatus(book) {
  const confirmMessage = `Apakah Anda yakin ingin mengubah status buku "${book.title}" menjadi ${book.isComplete ? "belum dibaca" : "sudah dibaca"}?`;
  const isConfirmed = confirm(confirmMessage);

  if (isConfirmed) {
    book.isComplete = !book.isComplete;

    const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
    const bookIndex = existingBooks.findIndex((b) => b.id === book.id);
    existingBooks[bookIndex] = book;
    localStorage.setItem("books", JSON.stringify(existingBooks));

    refreshBookshelves();
  }
}

// Fungsi untuk menghapus buku dari daftar
function deleteBook(book) {
  const confirmMessage = `Apakah Anda yakin ingin menghapus buku "${book.title}" dari daftar?`;
  const isConfirmed = confirm(confirmMessage);

  if (isConfirmed) {
    const existingBooks = JSON.parse(localStorage.getItem("books")) || [];
    const updatedBooks = existingBooks.filter((b) => b.id !== book.id);
    localStorage.setItem("books", JSON.stringify(updatedBooks));

    refreshBookshelves();
  }
}

// Initial load of bookshelves
refreshBookshelves();
// style
document.getElementById("hamburger").addEventListener("click", function () {
  document.body.classList.toggle("show-sidebar");

  const container = document.querySelector(".container");
  if (window.innerWidth < 768) {
    if (document.body.classList.contains("show-sidebar")) {
      container.style.gridTemplateColumns = "50% 100%";
    } else {
      container.style.gridTemplateColumns = "100%";
    }
  }
});

function updateLayout() {
  const container = document.querySelector(".container");
  const screenWidth = window.innerWidth;

  if (screenWidth >= 768) {
    container.style.gridTemplateColumns = "0.69fr 3.31fr";
  } else {
    container.style.gridTemplateColumns = "100%";
  }
}

window.addEventListener("load", updateLayout);
window.addEventListener("resize", updateLayout);

// end style
