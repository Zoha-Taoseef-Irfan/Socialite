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
  let q = $('#emailCreate').val();
  let r = $('#cityCreate').val();
  $.get(
    '/account/create/' + u + '/' + encodeURIComponent(p) + '/' + encodeURIComponent(q) +'/'  + encodeURIComponent(r),
    (data, status) => {
        alert(data);
  });
}
