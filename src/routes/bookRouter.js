import express from 'express';
import { createBook, getAllBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController.js';
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authMiddleware to protected routes
router.post('/', authMiddleware, upload.single('image'), createBook);
router.get('/', authMiddleware, getAllBooks);
router.get('/:id', authMiddleware, getBookById);
router.put('/:id', authMiddleware, upload.single('image'), updateBook);
router.delete('/:id', authMiddleware, deleteBook);

export default router;