var express = require('express');
var router = express.Router();



const { Sequelize, Book } =  require('../models/');
const { Op } = Sequelize;

function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (error) {
			error.message = error.message || "Sorry! There was an unexpected error on the server.";
			error.status = (error.status || 500);
			console.log(error.status + ": " + res.locals.message); 
			res.render('error', {error});
		}
	}
}

/* GET home page. */
router.get('/', asyncHandler(async function(req, res, next) {
	res.redirect("/books");
}));


//NEW BOOK
router.get('/books/new', asyncHandler(async function(req, res, next) {
	res.render('new-book', { book: {} });
}));

router.post('/books/new', asyncHandler(async function(req, res, next) {
	//POST NEW BOOK TO DATABASE
	try {
		const book = await Book.create(req.body);
		res.redirect("/books");
	} catch (error) {
		if (error.name === 'SequelizeValidationError') {
			res.render('new-book', { book:req.body, errors: error.errors });
		} else {
			throw Error("Error creating a new book");
		}
	}
}));


//DELETE
router.post('/books/:id/delete', asyncHandler(async function(req, res, next) {
	const book = await Book.findByPk(req.params.id);
	book.destroy();
	res.redirect("/books");
}));

//BOOK ID
router.get('/books/:id', asyncHandler(async function(req, res, next) {
	const book = await Book.findByPk(req.params.id);
	console.log(book);
	if (book) {
		res.render('update-book', {book})
	} else {
		throw Error("Book not in library");
	}
}));


//Update Book
router.post('/books/:id', asyncHandler(async function(req, res, next) {
	try {
		const book = await Book.findByPk(req.params.id);
		await book.update(req.body);
		res.render('update-book', {book});
	} catch (error) {
		if (error.name === 'SequelizeValidationError') {
			res.render('update-book', { book:req.body, errors: error.errors });
		} else {
			throw Error("Error updating a new book");
		}
	}
}));


//BOOKS
router.get('/books', asyncHandler(async function(req, res, next) {
	const books = await Book.findAll({})
	res.render('index', {books});
}));



module.exports = router;
