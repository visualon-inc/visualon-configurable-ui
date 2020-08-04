import UIButton from './ui_button';
import DOM from '../dom';

class UIChromecastToggleButton extends UIButton {
  private onCastAvailable_: any;
  private onCastConnected_: any;
  private onCastDisconnected_: any;
  constructor(context) {
    super(context);

    this.initElement('vop-cast-button', 'chromecast');

    this.addPlayerListeners();
    this.updateBtnState();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onCastAvailable_ = this.onCastAvailable.bind(this);
    this.onCastConnected_ = this.onCastConnected.bind(this);
    this.onCastDisconnected_ = this.onCastDisconnected.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_CAST_AVAILABLE, this.onCastAvailable_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_CAST_CONNECTED, this.onCastConnected_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_CAST_DISCONNECTED, this.onCastDisconnected_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    if (this.player_) {
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_CAST_AVAILABLE, this.onCastAvailable_);
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_CAST_CONNECTED, this.onCastConnected_);
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_CAST_DISCONNECTED, this.onCastDisconnected_);
      this.onCastAvailable_ = null;
      this.onCastConnected_ = null;
      this.onCastDisconnected_ = null;
    }
  }

  onHandleClick() {
    this.player_.startCast();
  }

  onCastAvailable() {
    this.updateBtnState();
  }

  onCastConnected() {
    if (!DOM.hasClass(this.element_, 'vop-cast-button-connected')) {
      DOM.addClass(this.element_, 'vop-cast-button-connected');
    }
  }

  onCastDisconnected() {
    if (DOM.hasClass(this.element_, 'vop-cast-button-connected')) {
      DOM.removeClass(this.element_, 'vop-cast-button-connected');
    }
  }

  updateBtnState() {
    let receiverAvailable = this.player_.isCastAvailable();
    if (receiverAvailable) {
      this.show('block');
    } else {
      this.hide();
    }
  }

  onPlayerOpenFinished() {
    this.flagAdBreakStart_ = false;
    this.updateBtnState();
  }
}

export default UIChromecastToggleButton;


