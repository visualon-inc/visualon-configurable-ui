import UIButton from './ui_button';

class UIFastRewindToggleButton extends UIButton {
  private trickPlayRate_: number;
  private onPlayerTrickModeChanged_: any;
  constructor(context) {
    super(context);
    this.trickPlayRate_ = 1;

    this.initElement('vop-fast-rewind-button', 'FR/-1X');

    this.addPlayerListeners();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onPlayerTrickModeChanged_ = this.onPlayerTrickModeChanged.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_TRICK_PLAY_RATE_CHANGED, this.onPlayerTrickModeChanged_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    if (this.player_) {
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_TRICK_PLAY_RATE_CHANGED, this.onPlayerTrickModeChanged_);
      this.onPlayerTrickModeChanged_ = null;
    }
  }

  onHandleClick() {
    this.trickPlayRate_ = (this.trickPlayRate_ > 0 || this.trickPlayRate_ < -8) ?
    -1 : this.trickPlayRate_ * 2;
    this.player_.setTrickPlayRate(this.trickPlayRate_);

    if (this.player_.isPaused()){
      let result = this.player_.play();
      if (result && (typeof Promise !== 'undefined') && (result instanceof Promise)) {
        result.then(function(){console.log('play successfully')}).catch(function(error){console.log(error)});
      }
    }
  }

  onPlayerOpenFinished() {
    this.trickPlayRate_ = 1;
    this.element_.title = 'FF/-1X';
    this.updateBtnState();
  }

  onPlayerTrickModeChanged(e) {
    this.trickPlayRate_ = e.rate;
    let showRate = this.trickPlayRate_ > 0 ? -1 : this.trickPlayRate_;
    this.element_.title = 'FR/' + showRate + 'X';
  }

  updateBtnState() {
    if (this.player_.isSupportTrickPlay()) {
      this.show();
    } else {
      this.hide();
    }
  }
}

export default UIFastRewindToggleButton;
