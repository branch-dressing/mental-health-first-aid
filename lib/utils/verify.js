function verifyLogin() {
  fetch('/api/v1/auth/verify', {
    credentials: 'include'
  })
    .then(res => res.json())
    .then(user => {
      if(user._id) {
        console.log(`you are logged in as ${user.email}`);
      } else {
        window.location.href = '../index.html';
      }
    });
}

export default verifyLogin;
