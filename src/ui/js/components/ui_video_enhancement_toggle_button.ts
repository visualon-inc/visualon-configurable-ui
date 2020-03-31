import UIButton from './ui_button';
import Events from '../events';
import ID from '../id';

class UIVideoEnhancementToggleButton extends UIButton {
  constructor(context) {
    super(context);

    this.initElement('vop-button vop-video-enhancement-button', 'video enhancement');
    this.element_.setAttribute('data-id', ID.VIDEO_ENHANCEMENT_BUTTON);
  }

  destroy() {
    super.destroy();
  }

  onHandleClick() {
    this.eventbus_.emit(Events.VIDEO_ENHANCEMENT_BUTTON_CLICK);
  }

  updateBtnState() {
    // when in 360vr mode, enhancement will be hidden, canvas only can do one job.
    if (this.player_.isVRMode()) {
      this.hide();
    } else {
      this.show();
    }
  }

  onPlayerOpenFinished() {
    this.updateBtnState();
  }
  
  onMouseDown() {
  }
}

export default UIVideoEnhancementToggleButton;