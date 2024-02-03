 
import { makeFromTemplate, Component } from "../../utils/html.js";

export default class NotificationMessage extends Component {
    static lastInstance = null;

    constructor(message, {
      duration = 2000, 
      type = 'success'} = {}) {
        
      super();

      this._message = message;
      this._duration = duration;
      this._type = type;
        
      this.render();
    }

    get duration() {
      return this._duration;
    }

    template() {
      return makeFromTemplate(TEMPLATE_NOTIFICATION,
        {
          '[message]': this._message,
          '[duration]': this._duration + 'ms',
          '[class]': this._type == 'success' ? 'success' : 'error'
        });
    }

    show(target) {
      NotificationMessage.lastInstance?.remove();

      target ??= document.body;
      target.append(this._element);

      NotificationMessage.lastInstance = this;

      setTimeout(() => this.remove(), this._duration);
    }
}

const TEMPLATE_NOTIFICATION = `
  <div class="notification [class]" style="--value:[duration]">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">success</div>
      <div class="notification-body">
        [message]
      </div>
    </div>
  </div>
`;