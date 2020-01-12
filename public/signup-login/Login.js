import Component from '../Component.js';

class Login extends Component {
  onRender(form) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const user = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
        .then(res => res.json())
        .then(user => {
          if(user._id) {
            console.log(`You are logged in as ${user.userName}`);
            //window.location.href = '';
          } else if(form.children.length === 1) {
            const error = document.createElement('div');
            error.innerHTML = '<p>Wrongs creds or user does not exist<p>';
            form.appendChild(error);
          }
        });
    });
  }

  renderHTML() {
    return /*html*/`
      <div id="main">
        <form>
          <fieldset>
            <legend>Login</legend>
            <input name="email" type="text" placeholder="email">
            <input name="password" type="password" placeholder="password">
            </fieldset>
            <button>Login</button>
        </form>
      </div>
    `;
  }
}

export default Login;
