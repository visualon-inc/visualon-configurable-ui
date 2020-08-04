import UIButton from './ui_button';

class UICardBoardToggleButton extends UIButton {
  private cardBoardMode_: boolean;
  constructor(context) {
    super(context);
    this.cardBoardMode_ = false;

    this.initElement('vop-cardboard-button');
  }

  destroy() {
    super.destroy();
  }

  onHandleClick() {
    this.cardBoardMode_ = !this.cardBoardMode_;
    if (this.player_.VR) {
      this.player_.VR.enableCardBoardMode(this.cardBoardMode_);
    }
  }

  updateBtnState() {
    if (this.player_.VR && this.player_.VR.isVRMode()) {
      this.show();
    } else {
      this.hide();
    }
  }

  onPlayerOpenFinished() {
    this.updateBtnState();
  }
}

export default UICardBoardToggleButton;
