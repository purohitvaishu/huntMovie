import mongoose from 'mongoose';

const { Schema } = mongoose;

const Notifications = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  friend_emailId: {
    type: String,
    default: null,
  },
  message: {
    type: String,
  },
  read_notification: {
    type: Boolean,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model('notifications', Notifications);
