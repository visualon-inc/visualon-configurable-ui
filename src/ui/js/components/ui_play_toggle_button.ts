import UIButton from './ui_button';
import DOM from '../dom';
import Events from '../events';

class UIPlayToggleButton extends UIButton {
  private onPlayButtonClick_: any;
  constructor(context) {
    super(context);

    // ui properties
    let properties = {
      'className': 'vop-button vop-play-button',
      'title': 'play'
    };

    // create html element
    this.element_ = DOM.createEl('button', properties);

    // bind element events
    this.element_.addEventListener('click', () => {
      this.onHandleClick();
    }, true);

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
    let currEnded = this.player_.isEnded();
    let isTrickPlay = this.player_.getTrickPlayRate() != 1;

    if(isTrickPlay) {
      this.player_.setTrickPlayRate(1);
    }

    let newPaused;
    // compute new play/pause state and apply it to player.
    if (currEnded) {
      // call play method when video is ended will trigger 'seeking' event and the target position is 0.
      newPaused = false;
    } else {
      // execute ui cmd
      if (currPaused) {
        newPaused = false;
      } else {
        newPaused = true;
      }
    }

    if (newPaused) {
      this.player_.pause();
    } else {
      this.player_.play();
    }
  }

  onPlayButtonClick() {
    if (this.flagAdBreakStart_) {
      if (this.dataAdClient_ === 'awsmediatailor') {
      } else if (this.dataAdClient_ === 'googleima') {
        if (this.flagNonLinearAd_) {
          this.onHandleClick();
        }
      }
    } else {
      this.onHandleClick();
    }
  }

  onPlayerOpenFinished() {
    this.flagAdBreakStart_ = false;
    this.show();
  }
}

export default UIPlayToggleButton;

