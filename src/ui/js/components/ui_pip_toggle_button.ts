import UIButton from './ui_button';

class UIPipToggleButton extends UIButton {
  private pipMode_: boolean;
  constructor(context) {
    super(context);
    this.pipMode_ = false;

    this.initElement('vop-pip-button', 'picture in picture');
  }

  destroy() {
    super.destroy();
  }

  onHandleClick() {
    this.pipMode_ = !this.player_.isInPipMode();
    this.player_.setPipPresentation(this.pipMode_);
  }

  updateBtnState() {
    // when in 360vr mode, pip will be hidden, 360vr only shows part of video
    if (this.player_.VR && this.player_.VR.isVRMode()) {
      this.hide();
    } else {
      this.show();
    }
  }

  onPlayerOpenFinished() {
    this.flagAdBreakStart_ = false;
    this.updateBtnState();
  }
}

export default UIPipToggleButton;
