import Book from '../models/book.js';
import cloudinary from '../config/cloudinary.js';

const createBook = async (req, res) => {
    const { title, caption, rating,image } = req.body;

    // Input validation
    if (!title || !caption || !rating || !image) {
        return res.status(400).json({ message: "Title, caption, rating, and image are required." });
    }

    try {
        // Validate image file type and size
        
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'books', // Optional: Save images in a specific folder
        });

        // Create a new book with the authenticated user's ID
        const newBook = new Book({
            title,
            caption,
            image: result.secure_url, // Save the Cloudinary URL
            rating,
            user: req.user._id, // Attach the authenticated user's ID
        });

        // Save the new book to the database
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong while creating the book", error: error.message });
    }
};



// Get all books
const getAllBooks = async (req, res) => {
    try {
      const { page = 1, limit = 3 } = req.query;
  
      const books = await Book.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate('user', 'username email profileImage'); // 👈 added profileImage here
  
      const total = await Book.countDocuments();
  
      res.status(200).json({
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        books,
      });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
  
// Get a single book by ID
const getBookById = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id).populate('user', 'username email');
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Update a book
const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, caption, rating,image } = req.body;

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if the authenticated user is the owner of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this book" });
        }

        // If a new image is uploaded, update the image in Cloudinary
       
            const result = await cloudinary.uploader.upload(image, {
                folder: 'books',
            });
            book.image = result.secure_url;
        

        // Update other fields
        book.title = title || book.title;
        book.caption = caption || book.caption;
        book.rating = rating || book.rating;
        book.image=image||book.image;

        const updatedBook = await book.save();
        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

// Delete a book
const deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Check if the authenticated user is the owner of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this book" });
        }

        // Optional: Delete the image from Cloudinary
        const publicId = book.image.split('/').pop().split('.')[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(`books/${publicId}`);

        // Delete the book from the database
        await Book.findByIdAndDelete(id);

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};

export { createBook, getAllBooks, getBookById, updateBook, deleteBook };