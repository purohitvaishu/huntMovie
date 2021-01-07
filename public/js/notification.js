function read_status(id) {
  $.ajax({
    url: '/users/notification/',
    type: 'post',
    data: { id },
    dataType: 'json',
    success: (data) => {
      if (data) {
        document.getElementById(id).style.backgroundColor = "white";
      }
    },
    error: (err) => {
      alert(err);
    },
  });
}