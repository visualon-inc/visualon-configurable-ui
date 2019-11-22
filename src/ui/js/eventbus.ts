
const EVENT_PRIORITY_LOW = 0;
const EVENT_PRIORITY_HIGH = 5000;

class EventBus {
  private context_: any;
  private handlers_: any;
  constructor (context) {
    this.context_ = context;
    this.handlers_ = {};
  }

  on(evType, listener, scope, priority = EVENT_PRIORITY_LOW) {
    if (!evType) {
      throw ('event evType cannot be null or undefined');
    }
    if (!listener || typeof(listener) !== 'function') {
      throw ('listener must be a function: ' + listener);
    }

    if (this.getHandlerIdx(evType, listener, scope) >= 0) return;

    this.handlers_[evType] = this.handlers_[evType] || [];

    const handler = {
      callback: listener,
      scope: scope,
      priority: priority
    };

    const inserted = this.handlers_[evType].some((item, idx) => {
      if (priority > item.priority) {
        this.handlers_[evType].splice(idx, 0, handler);
        return true;
      }
    });

    if (!inserted) {
      this.handlers_[evType].push(handler);
    }
  }

  off(evType, listener, scope) {
    if (!evType || !listener || !this.handlers_[evType]) return;
    const idx = this.getHandlerIdx(evType, listener, scope);
    if (idx < 0) return;
    this.handlers_[evType].splice(idx, 1);
  }

  emit(evType, payload) {
    if (!evType || !this.handlers_[evType]) {
      return;
    }

    payload = payload || {};

    if (payload.hasOwnProperty('evType')) {
      throw ('\'evType\' is a reserved word for event dispatching');
    }

    payload.evType = evType;

    this.handlers_[evType].forEach(handler => handler.callback.call(handler.scope, payload));
  }

  getHandlerIdx(evType, listener, scope) {
    let idx = -1;

    if (!this.handlers_[evType]) return idx;

    this.handlers_[evType].some((item, index) => {
      if (item.callback === listener && (!scope || scope === item.scope)) {
        idx = index;
        return true;
      }
    });
    return idx;
  }

  reset() {
    this.handlers_ = {};
  }
}

export default EventBus;