function share(id, emailId) {
  var split_id = id.split('_');
  var db = split_id[1];
  var id = split_id[0];
  var title = split_id[2];
  $.ajax({
    url: '/users/movies/share',
    type: 'post',
    data: { id, db, title, emailId },
    dataType: 'json',
    success: (data) => {
      if (data.success)
        alert('Sucessfully Sent email to your friend');
      if (data.error)
        alert('Invalid Email id.');
    },
    error: (err) => {
      alert(err);
    },
  });
}
