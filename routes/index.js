var express = require('express');
var router = express.Router();



const { Sequelize, Book } =  require('../models/');
const { Op } = Sequelize;

//Error handler handles errors
function asyncHandler(cb) {
	return async (req, res, next) => {
		try {
			await cb(req, res, next);
		} catch (error) {
			//render the error page with the error information
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


//Add new book 
router.get('/books/new', asyncHandler(async function(req, res, next) {
	//Send an empty book to evade errors
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


//delete book
router.post('/books/:id/delete', asyncHandler(async function(req, res, next) {
	//grab book by id and destroy it
	const book = await Book.findByPk(req.params.id);
	await book.destroy();
	res.redirect("/books");
}));

//Update book
router.get('/books/:id', asyncHandler(async function(req, res, next) {
	//grab book by id
	const book = await Book.findByPk(req.params.id);
	//If book id is out of scope, trhow an error. 
	if (book) {
		res.render('update-book', {book})
	} else {
		throw Error("Book not in library");
	}
}));
router.post('/books/:id', asyncHandler(async function(req, res, next) {
	try {
		//grab the book by id
		const book = await Book.findByPk(req.params.id);
		//update book
		await book.update(req.body);
		res.render('update-book', {book});
	} catch (error) {
		//Show user what is missing
		if (error.name === 'SequelizeValidationError') {
			res.render('update-book', { book:req.body, errors: error.errors });
		} else {
			throw Error("Error updating a new book");
		}
	}
}));


//View list of books
router.get('/books', asyncHandler(async function(req, res, next) {
	//grab the query from the url
	let query = req.query.query||"";
	
	//use query to select all fitting books
	const books = await Book.findAll({
		where: {
			[Op.or]: [
				{title: 
					{[Op.like]: `%${query}%`}
				},
				{author: 
					{[Op.like]: `%${query}%`}
				},
				{genre: 
					{[Op.like]: `%${query}%`}
				},
				{year: 
					{[Op.like]: `%${query}%`}
				}
			]
		}
	})
	
	res.render('index', {books, query});
}));


module.exports = router;
