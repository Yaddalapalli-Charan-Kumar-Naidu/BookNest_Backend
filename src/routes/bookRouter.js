import express from 'express';
import { createBook, getAllBooks, getBookById, updateBook, deleteBook, userBooks } from '../controllers/bookController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();


// Apply authMiddleware to all routes
router.use(authMiddleware);

// Create a new book (with image upload)
router.post('/', createBook);

// Get all books
router.get('/', getAllBooks);

//get particular user recommendations
router.get("/user",userBooks)

// Get a single book by ID
router.get('/:id', getBookById);

// Update a book (with optional image upload)
router.put('/:id', updateBook);

// Delete a book
router.delete('/:id', deleteBook);

export default router;