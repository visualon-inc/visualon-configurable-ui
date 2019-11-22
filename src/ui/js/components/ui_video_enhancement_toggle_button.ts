import UIButton from './ui_button';
import Events from '../events';
import ID from '../id';

class UIVideoEnhancementToggleButton extends UIButton {
  constructor(context) {
    super(context);
    this.element_ = document.createElement('button');
    this.element_.setAttribute('class', 'vop-button vop-video-enhancement-button');
    this.element_.setAttribute('data-id', ID.VIDEO_ENHANCEMENT_BUTTON);
    this.element_.title = 'video enhancement';
    this.element_.addEventListener('click', (e) => {
      this.onHandleClick(e);
    }, true);
  }

  destroy() {
    super.destroy();
  }

  onHandleClick(e) {
    this.eventbus_.emit(Events.VIDEO_ENHANCEMENT_BUTTON_CLICK);
  }
}

export default UIVideoEnhancementToggleButton;