function Book(title, author, isAvailable = true) {
    this.title = title;
    this.author = author;
    this.isAvailable = isAvailable;
}
// Member constructor function
function Member(name, borrowedBooks = []) {
    this.name = name;
    this.borrowedBooks = borrowedBooks;
    this.maxBooks = 3; // Regular members can borrow up to 3 books
}

// Borrow book method for Member
Member.prototype.borrowBook = function(book) {
    if (!book.isAvailable) {
        console.log(`Sorry, "${book.title}" is already borrowed.`);
        return false;
    }
    
    if (this.borrowedBooks.length >= this.maxBooks) {
        console.log(`${this.name} has reached the maximum borrowing limit (${this.maxBooks} books).`);
        return false;
    }
    
    book.isAvailable = false;
    this.borrowedBooks.push(book.title);
    console.log(`${this.name} successfully borrowed "${book.title}".`);
    return true;
};


// PremiumMember constructor function (inherits from Member)
function PremiumMember(name, borrowedBooks = []) {
    // Call the parent constructor
    Member.call(this, name, borrowedBooks);
    this.specialCollectionAccess = true;
    this.maxBooks = 5; // Premium members can borrow up to 5 books
}

// Set up inheritance
PremiumMember.prototype = Object.create(Member.prototype);
PremiumMember.prototype.constructor = PremiumMember;

// Override borrowBook method for PremiumMember
PremiumMember.prototype.borrowBook = function(book, isSpecial = false) {
    if (isSpecial && !this.specialCollectionAccess) {
        console.log(`${this.name} doesn't have access to special collections.`);
        return false;
    }
    
    // Call the parent borrowBook method using apply
    if (isSpecial) {
        console.log(`${this.name} is borrowing from special collection.`);
    }
    return Member.prototype.borrowBook.apply(this, [book]);
};


// Create some books
const books = [
    new Book("The Hobbit", "J.R.R. Tolkien"),
    new Book("1984", "George Orwell"),
    new Book("Pride and Prejudice", "Jane Austen"),
    new Book("Special: Rare Manuscript", "Ancient Author"),
    new Book("The Great Gatsby", "F. Scott Fitzgerald"),
    new Book("Special: Limited Edition", "Famous Author")
];

// Create members
const regularMember = new Member("Alice");
const premiumMember = new PremiumMember("Bob");

// Demonstrate borrowing
console.log("--- Regular Member ---");
regularMember.borrowBook(books[0]); // Success
regularMember.borrowBook(books[1]); // Success
regularMember.borrowBook(books[2]); // Success
regularMember.borrowBook(books[3]); // Should fail (limit reached)
regularMember.borrowBook(books[4]); // Should fail (limit reached)

console.log("\n--- Premium Member ---");
premiumMember.borrowBook(books[0]); // Success (regular book)
premiumMember.borrowBook(books[1]); // Success
premiumMember.borrowBook(books[2]); // Success
premiumMember.borrowBook(books[3], true); // Success (special collection)
premiumMember.borrowBook(books[4]); // Success
premiumMember.borrowBook(books[5], true); // Should fail (limit reached)

// Demonstrate using bind
console.log("\n--- Using bind ---");
const borrowForAlice = Member.prototype.borrowBook.bind(regularMember);
borrowForAlice(new Book("New Book", "New Author")); // Should fail (Alice still at limit)

const borrowSpecialForBob = PremiumMember.prototype.borrowBook.bind(premiumMember);
borrowSpecialForBob(new Book("Another Special", "Special Author"), true); // Should fail (Bob at limit)
