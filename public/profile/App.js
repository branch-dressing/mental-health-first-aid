import Component from '../Component.js';
import verifyLogin from '../utils/verify.js';

import Avatar from './Avatar.js';
import UserInfo from './UserInfo.js';


class App extends Component {
  onRender(el) {
    verifyLogin();

    const avatar = new Avatar();
    el.appendChild(avatar.renderDOM());

    const userInfo = new UserInfo({ positives: [] });
    el.appendChild(userInfo.renderDOM());

    async function loadUserInfo() {
      await fetch('/api/v1/positives', {
        credentials: 'include'
      })
        .then(res => res.json())
        .then(positives => {
          if(positives) userInfo.update({ positives: positives });
        });
    }
    loadUserInfo();
  }

  renderHTML() {
    return /*html*/`
      <div>
      </div>
      `;
  }
}

export default App;
