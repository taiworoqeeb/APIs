const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');
const authorController = require('../controllers/authorController');
const genreController = require('../controllers/genreController');
const reviewController = require('../controllers/reviewController');
const auth = require('../auth/authorize');
const role = require('../auth/role')

router
.route('/signup/')
.post(userController.signup);

router
.route('/login/')
.post(userController.login);

router
.route('/users/:Id')
.get(auth(role.Admin), userController.getUser)
.patch(auth(role.Admin), userController.updateUser)
.delete(auth(role.Admin), userController.deleteUser);

router
.route('/users/')
.get(auth(role.Admin),userController.getUsers);

router
.route('/books/:id')
.get(auth(role.Admin), bookController.GetBook)
.patch(auth(role.Admin), bookController.UpdateBook)
.delete(auth(role.Admin), bookController.DeleteBook);

router
.route('/books/')
.post(auth(role.Admin), bookController.CreateBook)
.get(auth([role.Admin, role.Basic]), bookController.GetAllBooks); //books/index

router
.route('/authors/:id')
.get(auth(role.Admin), authorController.GetAuthor)
.patch(auth(role.Admin), authorController.UpdateAuthor)
.delete(auth(role.Admin), authorController.DeleteAuthor);

router
.route('/authors/')
.post(auth(role.Admin), authorController.CreateAuthor)
.get(auth(role.Admin), authorController.GetAllAuthors);

router
.route('/genres/:id')
.get(auth(role.Admin), genreController.Getgenre)
.patch(auth(role.Admin), genreController.Updategenre)
.delete(auth(role.Admin), genreController.Deletegenre);

router
.route('/genres/')
.post(auth(role.Admin), genreController.Creategenre)
.get(auth(role.Admin), genreController.GetAllgenres);


router
.route('/reviews/:id')
.get(auth([role.Admin, role.Basic]), reviewController.Getreview)
.patch(auth([role.Admin, role.Basic]), reviewController.Updatereview)
.delete(auth([role.Admin, role.Basic]), reviewController.Deletereview);

router
.route('/reviews/')
.post(auth([role.Admin, role.Basic]), reviewController.Createreview)
.get(auth(role.Admin),reviewController.GetAllreviews);

//For search only
router
.route('/books/search/')
.get(auth([role.Admin, role.Basic]), bookController.searchBook)

module.exports = router;