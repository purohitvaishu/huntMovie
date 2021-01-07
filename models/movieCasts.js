import mongoose from 'mongoose';

const { Schema } = mongoose;

const movieCasts = new Schema({
  movie_id: {
    type: Number,
    required: true,
  },
  cast: {
    type: Object,
    required: true,
  },
});
export default mongoose.model('movie_casts', movieCasts);
