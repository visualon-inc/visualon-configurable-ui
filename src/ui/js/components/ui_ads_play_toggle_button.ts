import UIButton from './ui_button';
import DOM from '../dom';
import Events from '../events';

class UIAdsPlayToggleButton extends UIButton {
  private onPlayButtonClick_: any;
  constructor(context) {
    super(context);

    this.initElement('vop-button vop-ads-play-toggle-button', 'play');

    this.addEventBusListeners();
  }

  destroy() {
    super.destroy();
    this.removeEventBusListeners();
  }

  addEventBusListeners() {
    super.addPlayerListeners();
    this.onPlayButtonClick_ = this.onPlayButtonClick.bind(this);
    this.eventbus_.on(Events.PLAY_BUTTON_CLICK, this.onPlayButtonClick_);
  }
  
  removeEventBusListeners() {
    super.removePlayerListeners();
    this.eventbus_.off(Events.PLAY_BUTTON_CLICK, this.onPlayButtonClick_);
    this.onPlayButtonClick_ = null;
  }

  onHandleClick() {
    // Get current play/pause state from UI.
    let currPaused = this.player_.isPaused();
    let isTrickPlay = this.player_.getTrickPlayRate() != 1;

    if(isTrickPlay) {
      this.player_.setTrickPlayRate(1);
    }

    let newPaused;
    if (currPaused) {
        newPaused = false;
      } else {
        newPaused = true;
      }

    if (newPaused) {
      this.player_.pause();
    } else {
      this.player_.play();
    }
  }

  onAdStarted(e) {
    this.dataAdClient_ = e.client;
    this.flagNonLinearAd_ = false;
    if (e.client === 'googleima' && (e.adType === 'nonlinear')) {
      this.flagNonLinearAd_ = true;
    }

    if (this.flagNonLinearAd_) {
      this.hide();
    } else {
      this.show();
    }
  }

  onAdComplete() {
    this.hide();
  }

  onPlayButtonClick() {
    if (this.dataAdClient_ === 'awsmediatailor') {
      if (this.flagAdBreakStart_) {
        this.onHandleClick();
      }
    } else if (this.dataAdClient_ === 'googleima') {
      if (this.flagAdBreakStart_ && this.flagNonLinearAd_) {
        this.onHandleClick();
      }
    }
  }

  onPlayerOpenFinished() {
    this.flagAdBreakStart_ = false;
    this.hide();
  }
}

export default UIAdsPlayToggleButton;

