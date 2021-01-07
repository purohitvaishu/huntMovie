import mongoose from 'mongoose';

const { Schema } = mongoose;

const followSchema = new Schema({
  movie_id: {
    type: Number,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  event_id: {
    type: String,
    required: true,
  },
});

export default mongoose.model('follow_movies', followSchema);
