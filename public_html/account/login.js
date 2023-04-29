function login() {
  let u = $('#usernameLogin').val();
  let p = $('#passwordLogin').val();
  $.get(
    '/account/login/' + u + '/' + encodeURIComponent(p),
    (data, status) => {
      console.log(data);
        alert(data);
        if (data === 'SUCCESS') {
          window.location.href = '/app/index.html';
        }
  });
}

function createAccount() {
  let u = $('#usernameCreate').val();
  let p = $('#passwordCreate').val();
  $.get(
    '/account/create/' + u + '/' + encodeURIComponent(p),
    (data, status) => {
        alert(data);
  });
}
