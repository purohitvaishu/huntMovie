import WatchListModel from "../models/watchlist";

const watchList = async (req, res) => {
  try {
    if (req.body.watchlistStatus === "Add to watchlist") {
      const newWatchlist = new WatchListModel({
        watchlist_movie_id: req.body.movie_id,
        user_id: req.user._id,
        type: req.body.db
      });

      await newWatchlist.save();

      const message = "Added to watchlist Successfully";

      return res.send({ success: true, message, status: "delete" });
    }
    await WatchListModel.findOneAndDelete({
      watchlist_movie_id: req.body.movie_id,
      user_id: req.user._id
    });

    const message = "Deleted from watchlist successfully";
    return res.send({ success: true, message, status: "add" });
  } catch (err) {
    res.send({ err: true });
  }
};

export default watchList;
