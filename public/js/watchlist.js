function watchlist(id) {
  let split_id = id.split('_');
  let db = split_id[2];
  let movie_id = parseInt(split_id[1]);
  let type = split_id[0];
  let watchlistStatus = document.getElementById(id).innerHTML;

  $.ajax({
    url: '/users/movies/watchlist/',
    type: 'post',
    data: { movie_id, db, watchlistStatus },
    dataType: 'json',
    success: (data) => {
      alert(data.message);
      if(data.status === 'add') {
        document.getElementById(id).innerHTML = 'Add to watchlist';
      } else {
        document.getElementById(id).innerHTML = 'Delete from watchlist';
      }
    },
    error: (err) => {
      alert('Error happened');
    },
  });
}
