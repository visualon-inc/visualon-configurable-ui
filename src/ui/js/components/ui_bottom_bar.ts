import DOM from '../dom';
import Events from '../events';
import UIContainer from './ui_container';

class UIBottomBar extends UIContainer {
  constructor(context) {
    super(context);
    // create element
    let properties = {
      'className': 'vop-bottom-bar'
    };
    this.element_ = DOM.createEl('div', properties);
    this.element_.addEventListener('mousedown', this.onUICmdControlBarMouseDown.bind(this));
    this.element_.addEventListener('mousemove', this.onUICmdControlBarMouseMove.bind(this));
  }

  destroy() {
    super.destroy();
  }

  onUICmdControlBarMouseDown(e) {
    e.stopPropagation();
  }

  onUICmdControlBarMouseMove(e) {
    this.eventbus_.emit(Events.CONTROLBAR_MOUSEMOVE, e);
  }

  onAdStarted(e) {
    this.element_.style.zIndex = '20';
  }

  onAdComplete() {
    this.element_.style.zIndex = '2';
  }
}

export default UIBottomBar;