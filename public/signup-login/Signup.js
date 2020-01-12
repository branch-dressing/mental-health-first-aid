import Component from '../Component.js';

class Signup extends Component {
  onRender(form) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const user = {
        email: formData.get('email'),
        userName: formData.get('username'),
        password: formData.get('password')
      };

      fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
        .then(res => res.json())
        .then(user => {
          console.log(user);
          if(user._id) {
            console.log(`You are logged in as ${user.userName}`);
            //window.location.href = '';
          } else if(form.children.length === 1) {
            const error = document.createElement('div');
            error.innerHTML = '<p>User or Password invalid<p>';
            form.appendChild(error);
          }
        });
    });

  }

  renderHTML() {
    return /*html*/`
      <div>
        <form>
          <fieldset>
            <legend>Signup</legend>
            <input name="email" type="text" placeholder="email">
            <input name="username" type="text" placeholder="username">
            <input name="password" type="password" placeholder="password">
          </fieldset>
          <button>Signup</button>
        </form>
      </div>
    `;
  }

}

export default Signup;
