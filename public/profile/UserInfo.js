import Component from '../Component.js';

class UserInfo extends Component {
  renderHTML() {
    const positives = this.props.positives;
    let message;
    positives.forEach(item => message = item.message);

    console.log(message);
    return /*html*/`
      <div>
        <h1>Positives</h1>
        <p>${message}</p>
      </div>
      `;
  }
};

export default UserInfo;
