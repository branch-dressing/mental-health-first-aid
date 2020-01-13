import Component from '../Component.js';

class Avatar extends Component {
  renderHTML() {
    return /*html*/`
      <div>
        <img src="https://pbs.twimg.com/media/D1T3l2yXQAEnhCd.jpg:large">
      </div>
    `;
  }
};

export default Avatar;