function follow_unfollow(id) {
  let movieId = parseInt(id);
  let isFollowed = document.getElementById(id).innerHTML;
  $.ajax({
    url: '/users/upcoming/event',
    type: 'post',
    data: { movieId, isFollowed },
    dataType: 'json',
    success: (data) => {
      if (data.status === 'success') {
        alert(data.message);
        if (data.follow_status === 'Follow') {
          document.getElementById(id).innerHTML = 'Follow';
        } else {
          document.getElementById(id).innerHTML = 'Unfollow';
        }
        if (typeof data.redirect === 'string') {
          window.location.replace(data.redirect);
        }
      } else {
        alert(data.message);
      }
    },
    error: (error) => {
      alert(error);
    },
  });
}
