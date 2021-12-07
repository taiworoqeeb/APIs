const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');
const authorController = require('../controllers/authorController');
const genreController = require('../controllers/genreController');
const reviewController = require('../controllers/reviewController');
const role = require('../roles');

router
.route('/signup/')
.post(userController.signup);

router
.route('/login/')
.post(userController.login);

/*router
.route('/logout')
.get(userController.logout);*/

router
.route('/users/:Id')
.get( userController.getUser)
.patch( userController.grantAccess(role.Admin), userController.updateUser)
.delete( userController.grantAccess(role.Admin), userController.deleteUser);

router
.route('/users/')
.get( userController.grantAccess(role.Admin), userController.getUsers);

router
.route('/books/:id')
.get( bookController.GetBook)
.patch( userController.grantAccess(role.Admin),bookController.UpdateBook)
.delete( userController.grantAccess(role.Admin),bookController.DeleteBook);

router
.route('/books/')
.post( userController.grantAccess(role.Admin),bookController.CreateBook)
.get( bookController.GetAllBooks); //books/index

router
.route('/authors/:id')
.get( userController.grantAccess(role.Admin),authorController.GetAuthor)
.patch( userController.grantAccess(role.Admin),authorController.UpdateAuthor)
.delete( userController.grantAccess(role.Admin),authorController.DeleteAuthor);

router
.route('/authors/')
.post( userController.grantAccess(role.Admin),authorController.CreateAuthor)
.get( userController.grantAccess(role.Admin),authorController.GetAllAuthors);

router
.route('/genres/:id')
.get( userController.grantAccess(role.Admin),genreController.Getgenre)
.patch( userController.grantAccess(role.Admin),genreController.Updategenre)
.delete( userController.grantAccess(role.Admin),genreController.Deletegenre);

router
.route('/genres/')
.post( userController.grantAccess(role.Admin),genreController.Creategenre)
.get( userController.grantAccess(role.Admin),genreController.GetAllgenres);


router
.route('/reviews/:id')
.get( reviewController.Getreview)
.patch( reviewController.Updatereview)
.delete( reviewController.Deletereview);

router
.route('/reviews/')
.post( reviewController.Createreview)
.get( reviewController.GetAllreviews);

//For search only
router
.route('/books/search/')
.get( bookController.searchBook)

module.exports = router;