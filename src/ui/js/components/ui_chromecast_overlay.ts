import UIComponent from './ui_component';
import DOM from '../dom';

class UIChromecastOverlay extends UIComponent {
  private onCastConnected_: Function;
  private onCastDisconnected_: Function;
  private vopChromecastStatusInfo_: HTMLElement;
  private vopChromecastStatusTitle_: HTMLElement;
  constructor(context) {
    super(context, false);
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-cast-overlay');

    let vopChromecastStatus = document.createElement('div');
    vopChromecastStatus.setAttribute('class', 'vop-cast-status');

    let vopChromecastStatusIcon = document.createElement('div');
    vopChromecastStatusIcon.setAttribute('class', 'vop-cast-status-icon');

    this.vopChromecastStatusInfo_ = document.createElement('div');
    this.vopChromecastStatusInfo_.setAttribute('class', 'vop-cast-status-info');
    this.vopChromecastStatusInfo_.innerText = 'Playing on';

    this.vopChromecastStatusTitle_ = document.createElement('div');
    this.vopChromecastStatusTitle_.setAttribute('class', 'vop-cast-status-title');
    this.vopChromecastStatusTitle_.innerText = '';

    vopChromecastStatus.appendChild(vopChromecastStatusIcon);
    vopChromecastStatus.appendChild(this.vopChromecastStatusInfo_);
    vopChromecastStatus.appendChild(this.vopChromecastStatusTitle_);

    this.element_.appendChild(vopChromecastStatus);

    this.addPlayerListeners();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onCastConnected_ = this.onCastConnected.bind(this);
    this.onCastDisconnected_ = this.onCastDisconnected.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_CAST_CONNECTED, this.onCastConnected_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_CAST_DISCONNECTED, this.onCastDisconnected_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_CAST_CONNECTED, this.onCastConnected_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_CAST_DISCONNECTED, this.onCastDisconnected_);
    this.onCastConnected_ = null;
    this.onCastDisconnected_ = null;
  }

  onCastConnected(ev) {
    this.vopChromecastStatusInfo_.innerText = 'Playing on';
    this.vopChromecastStatusTitle_.innerText = ev.deviceName;

    if (!DOM.hasClass(this.element_, 'vop-cast-connected')) {
      DOM.addClass(this.element_, 'vop-cast-connected');
    }
  }

  onCastDisconnected() {
    if (DOM.hasClass(this.element_, 'vop-cast-connected')) {
      DOM.removeClass(this.element_, 'vop-cast-connected');
    }
  }
}

export default UIChromecastOverlay;