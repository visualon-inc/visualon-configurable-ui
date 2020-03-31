import UIButton from './ui_button';

class UICardBoardToggleButton extends UIButton {
  private cardBoardMode_: boolean;
  constructor(context) {
    super(context);
    this.cardBoardMode_ = false;

    this.initElement('vop-button vop-cardboard-button');
  }

  destroy() {
    super.destroy();
  }

  onHandleClick() {
    this.cardBoardMode_ = !this.cardBoardMode_;
    this.player_.enableCardBoardMode(this.cardBoardMode_);
  }

  updateBtnState() {
    if (this.player_.isVRMode()) {
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
