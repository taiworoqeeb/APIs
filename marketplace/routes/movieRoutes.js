const express = require("express");
const movieController = require("../controllers/moviesController");

const router = express.Router();

//router.param("id", movieController.checkID);

router
  .route("/")
  .get(movieController.getAllMovies)
  .post(movieController.createMovie);

router
  .route("/:id")
  .get(movieController.getMovie)
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;
