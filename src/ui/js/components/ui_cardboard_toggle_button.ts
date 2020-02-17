import UIButton from './ui_button';

class UICardBoardToggleButton extends UIButton {
  private cardBoardMode_: boolean;
  constructor(context) {
    super(context);
    this.cardBoardMode_ = false;

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-button vop-cardboard-button');
    this.element_.addEventListener('click', this.onUICmdCardBoard.bind(this));
    this.element_.title = '';
  }

  destroy() {
    super.destroy();
  }

  onUICmdCardBoard() {
    this.cardBoardMode_ = !this.player_.isInCardBoardMode();
    this.player_.enableCardBoardVideo(this.cardBoardMode_);
  }

  updateBtnState() {
    if (this.player_.isVideo360vrSupported()) {
      this.show();
    } else {
      this.hide();
    }
  }

  onAdComplete() {
    this.updateBtnState();
  }

  onPlayerOpenFinished() {
    this.updateBtnState();
  }
}

export default UICardBoardToggleButton;
