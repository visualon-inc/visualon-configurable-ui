import UIButton from './ui_button';

class UIAirplayToggleButton extends UIButton {
  constructor(context) {
    super(context);

    this.initElement('vop-airplay-button', 'airplay');
  }

  destroy() {
    super.destroy();
  }

  onHandleClick() {
    this.player_.showPlaybackTargetPicker();
  }

  onPlayerOpenFinished() {
    this.flagAdBreakStart_ = false;
    this.show();
  }
}

export default UIAirplayToggleButton;