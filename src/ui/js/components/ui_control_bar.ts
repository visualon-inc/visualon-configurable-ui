import DOM from '../dom';
import Events from '../events';
import UIContainer from './ui_container';

class UIControlBar extends UIContainer {
  constructor(context) {
    super(context, false);
    // create element
    let properties = {
      'className': 'vop-control-bar'
    };
    this.element_ = DOM.createEl('div', properties);
    this.element_.addEventListener('mousedown', this.onUICmdControlBarMouseDown.bind(this));
    this.element_.addEventListener('mousemove', this.onUICmdControlBarMouseMove.bind(this));
  }

  onUICmdControlBarMouseDown(e) {
    e.stopPropagation();
  }

  onUICmdControlBarMouseMove(e) {
    this.eventbus_.emit(Events.CONTROLBAR_MOUSEMOVE, e);
  }
}

export default UIControlBar;