import UIButton from './ui_button';

class UIPipToggleButton extends UIButton {
  private pipMode_: boolean;
  constructor(context) {
    super(context);
    this.pipMode_ = false;

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-button vop-pip-button');
    this.element_.addEventListener('click', this.onUICmdPip.bind(this));
    this.element_.title = 'picture in picture';
  }

  destroy() {
    super.destroy();
  }

  onUICmdPip() {
    this.pipMode_ = !this.player_.isInPipMode();
    this.player_.setPipPresentation(this.pipMode_);
  }

  onPlayerOpenFinished() {
    this.flagAdBreakStart_ = false;
    this.show();
  }
}

export default UIPipToggleButton;
