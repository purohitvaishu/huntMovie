import mongoose from 'mongoose';

const { Schema } = mongoose;

const genres = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model('genres', genres);
