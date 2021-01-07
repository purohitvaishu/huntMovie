import mongoose from 'mongoose';

const { Schema } = mongoose;

const movieGenre = new Schema({
  movie_id: {
    type: Number,
  },
  genre: {
    type: Number,
  },
});

export default mongoose.model('movies_genres', movieGenre);
