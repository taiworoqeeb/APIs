/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
const fs = require("fs");
const Movie = require('./../models/movieModel');

/*const movies = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);*/

/*const movies = [
  { id: 1, name: "avenger" },
  { id: 2, name: "god of war" },
  { id: 3, name: "mk11" },
];*/


exports.getAllMovies = async(req, res) => {
try{
 const movies = await Movie.find();

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: movies.length,
    data: {
      movies,
    },
  });
} catch(err){
  res.status(404).json({
    status: 'fail',
    message: err
  });
}
};

exports.getMovie = async (req, res) => {
try{
   const movie = await Movie.findById(req.params.id);
  //Movie.findOne({_id: req.param.id});

   res.status(200).json({
      status: "success",
      data: {
          movie
      }
  });
  } catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createMovie = async (req, res) => {
try{
  const newMovie = await Movie.create(req.body);

      res.status(201).json({
      status: 'success',
      data: {
        movie: newMovie
      }
});
} catch (err) {
  res.status(400).json({
    status: 'failed',
    message: err
  })
}
};

exports.updateMovie = async (req, res) => {
 /* const id = req.params.id * 1;
    const movie = movies.find((el) => el.id === id);
    if (!movie) res.status(404).send('The User not found or Not given ID');
    movie.name =req.body.name;
    res.send(movie);*/
  try{
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }); 

    res.status(200).json({
      status: "success",
      data: {
        movie
      },
    });
  } catch(err){
    es.status(400).json({
      status: 'failed',
      message: err
    })
  }
};

exports.deleteMovie = async (req, res) => {
  /*const id = req.params.id * 1;
  const movie = movies.find((el) => el.id === id);
  if (!movie) res.status(404).send('The User not found or Not given ID');
  const index = movies.indexOf(movie);
  movies.splice(index, 1)
  res.send(movie);*/
try{
const movie = await Movie.findByIdAndDelete(req.params.id);

res.status(200).json({
  status: "success",
  data: {
    movie: `${movie.name} deleted`
  }
});

} catch(err){
  es.status(400).json({
    status: 'failed',
    message: err
  })
}
};
