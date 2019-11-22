import UIButton from './ui_button';

class UIAirplayToggleButton extends UIButton {
  constructor(context) {
    super(context);
    this.element_ = document.createElement('button');
    this.element_.setAttribute('class', 'vop-button vop-airplay-button');
    this.element_.addEventListener('click', this.onUICmdAirplay.bind(this));
    this.element_.title = 'airplay';
  }

  destroy() {
    super.destroy();
  }

  onUICmdAirplay() {
    this.player_.showPlaybackTargetPicker();
  }

  onPlayerOpenFinished() {
    this.flagAdBreakStart_ = false;
    this.show();
  }
}

export default UIAirplayToggleButton;