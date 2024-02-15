 
import { makeFromTemplate, createElementFromHTML } from "../../utils/html.js";

export default class NotificationMessage {
    static lastInstance = null;
    element = null;

    constructor(message, {
      duration = 2000, 
      type = 'success'} = {}) {

      this._message = message;
      this._duration = duration;
      this._type = type;

      this._timerId = null;
        
      this.createElement();
    }

    createElement() {
      this.element = createElementFromHTML(this.template());
    }
      
    remove() {
      this.element?.remove();
    }
         
    destroy() {
      this.remove();
      this.element = null;
      clearTimeout(this._timerId);
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
      target.append(this.element);

      NotificationMessage.lastInstance = this;

      this._timerId = setTimeout(() => this.remove(), this._duration);
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