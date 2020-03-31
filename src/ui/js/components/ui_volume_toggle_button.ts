import UIButton from './ui_button';
import DOM from '../dom';

class UIVolumeToggleButton extends UIButton {
  private vopVolumeBtnStyle_: string;
  private onMediaVolumeChanged_: any;
  constructor(context) {
    super(context, false);
    this.vopVolumeBtnStyle_ = 'icon-up';

    this.initElement('vop-button vop-volume-button', 'mute');

    this.vopVolumeBtnStyle_ = this.getNewVolumeBtnStyle();
    DOM.addClass(this.element_, this.vopVolumeBtnStyle_);

    this.addPlayerListeners();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onMediaVolumeChanged_ = this.onMediaVolumeChanged.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_VOLUME_CHANGED, this.onMediaVolumeChanged_);
    this.player_.addEventListener((window as any).voPlayer.events.AD_VOLUME_CHANGED, this.onMediaVolumeChanged_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    if (this.player_) {
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_VOLUME_CHANGED, this.onMediaVolumeChanged_);
      this.player_.removeEventListener((window as any).voPlayer.events.AD_VOLUME_CHANGED, this.onMediaVolumeChanged_);
      this.onMediaVolumeChanged_ = null;
    }
  }

  getNewVolumeBtnStyle() {
    let newVolumeBtnStyle = '';

    let muted = this.player_.isMuted();
    let volume = this.player_.getVolume();
    if (volume === 0 || muted) {
      newVolumeBtnStyle = 'icon-off';
    } else {
      if (volume >= 0.5) {
        newVolumeBtnStyle = 'icon-up';
      } else {
        newVolumeBtnStyle = 'icon-down';
      }
    }

    return newVolumeBtnStyle;
  }

  onMediaVolumeChanged() {
    let oldVolumeBtnStyle = this.vopVolumeBtnStyle_;
    this.vopVolumeBtnStyle_ = this.getNewVolumeBtnStyle();

    // update volume button
    DOM.removeClass(this.element_, oldVolumeBtnStyle);
    DOM.addClass(this.element_, this.vopVolumeBtnStyle_);
  }

  onHandleClick() {
    let muted = this.player_.isMuted();
    let volume = this.player_.getVolume();

    if (volume === 0) {
      if (muted) {
        this.player_.unmute();
        muted = false;
      }

      // If the this.player_ is muted, and volume is 0,
      // in this situation, we will restore volume to 0.2
      volume = 0.1;
      this.player_.setVolume(volume);
    } else {
      if (muted) {
        this.player_.unmute();
        muted = false;
      } else {
        this.player_.mute();
        muted = true;
      }
    }
  }
}

export default UIVolumeToggleButton;