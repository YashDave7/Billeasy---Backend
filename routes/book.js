const express = require('express');
const Book = require('../models/Book');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ROUTE 1: Create a new Book:-   POST "/api/books".
router.post('/', fetchUser, [
    body('title').notEmpty(),
    body('author').notEmpty(),
    body('genre').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { title, author, genre } = req.body;
        const newBook = new Book({ title, author, genre });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 2: Get all Books with optional filters:-   GET "/api/books?author=&genre=&page=&limit="
router.get('/', async (req, res) => {
    try {
        let { page = 1, limit = 10, author, genre } = req.query;

        page = Math.max(1, parseInt(page) || 1);
        limit = Math.min(50, Math.max(1, parseInt(limit) || 10)); // max 50 per page


        // Build the filter object dynamically
        const filter = {};
        if (author) filter.author = new RegExp(author, 'i'); // Case-insensitive partial match
        if (genre) filter.genre = new RegExp(genre, 'i');

        // Fetch total count for pagination info
        const totalBooks = await Book.countDocuments(filter);

        // Fetch paginated books
        const books = await Book.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .select('title author genre averageRating') // Select only necessary fields
            .exec();

        res.json({
            page,
            limit,
            totalBooks,
            books,
        });
    } catch (error) {
        console.error('Error fetching books:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


// ROUTE 3: Search books by author, title:-   GET /api/books/search?query=searchTerm
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const regex = new RegExp(query, 'i'); // case-insensitive

        const books = await Book.find({
            $or: [
                { title: regex },
                { author: regex }
            ]
        }).select('title author genre averageRating');

        res.json({ results: books });
    } catch (error) {
        console.error('Error searching books:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


// ROUTE 4: Get a single Book by ID:-  GET "/api/books/:id"
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: "Book not found" });
        res.json(book);
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).send("Internal Server Error");
    }
});


// ROUTE 5: Add a review to a book:-   POST "/api/books/:id/reviews"
router.post('/:id/reviews', fetchUser, [
    body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1.0 and 5.0'),
    body('comment').optional().isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { rating, comment } = req.body;
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });

        // 🔒 Check if user already reviewed the book
        const alreadyReviewed = book.reviews.find(r => r.user.toString() === req.user.id);
        if (alreadyReviewed) {
            return res.status(400).json({ error: 'You have already reviewed this book' });
        }

        const review = {
            user: req.user.id,
            rating,
            comment
        };

        book.reviews.push(review);

        // 📊 Recalculate average rating
        book.averageRating = parseFloat((book.reviews.reduce((acc, cur) => acc + cur.rating, 0) / book.reviews.length).toFixed(2));

        await book.save();
        res.json({ message: 'Review added successfully', book });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 6: Update a review by ID:-   PUT "/api/books/reviews/:id"
router.put('/reviews/:id', fetchUser, [
    body('rating').isInt({ min: 1, max: 5 }).withMessage("Rating must be an integer between 1 and 5"),
    body('comment').optional().isString()
], async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const books = await Book.find({ "reviews._id": req.params.id });

        if (!books.length) return res.status(404).json({ error: 'Review not found' });

        const book = books[0];
        const review = book.reviews.id(req.params.id);

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not allowed to update this review' });
        }

        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        book.averageRating = parseFloat((book.reviews.reduce((acc, cur) => acc + cur.rating, 0) / book.reviews.length).toFixed(2));


        await book.save();
        res.json(book);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 7: Delete a review by ID:-   DELETE "/api/books/reviews/:id"
router.delete('/reviews/:id', fetchUser, async (req, res) => {
    try {
        const books = await Book.find({ "reviews._id": req.params.id });

        // CHECK IF THE REVIEW EXIST.
        if (!books.length) return res.status(404).json({ error: 'Review not found' });

        const book = books[0];
        const review = book.reviews.id(req.params.id);

        // CHECK IF THE REVIEW BELONG TO THIS USER.
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not allowed to delete this review' });
        }

        review.deleteOne();
        book.averageRating = book.reviews.length
            ? book.reviews.reduce((acc, cur) => acc + cur.rating, 0) / book.reviews.length
            : 0;

        await book.save();
        res.json({ success: 'Review deleted', book });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});




module.exports = router;