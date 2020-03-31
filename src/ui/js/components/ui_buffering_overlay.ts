import UIComponent from './ui_component';
import DOM from '../dom';

class UIBufferingOverlay extends UIComponent {
  private vopSpinnerContainer_: HTMLElement;
  private vopSpinnerRotator_: HTMLElement;
  private vopSpinnerLeft_: HTMLElement;
  private vopSpinnerCircle1_: HTMLElement;
  private vopSpinnerRight_: HTMLElement;
  private vopSpinnerCircle2_: HTMLElement;
  private vopPlayer_: HTMLElement;
  private onMediaPlaying_: any;
  private onMediaWaiting_: any;
  private onMediaClosed_: any;
  constructor(context) {
    super(context, false);
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-spinner');

    this.vopSpinnerContainer_ = document.createElement('div');
    this.vopSpinnerContainer_.setAttribute('class', 'vop-spinner-container');

    this.vopSpinnerRotator_ = document.createElement('div');
    this.vopSpinnerRotator_.setAttribute('class', 'vop-spinner-rotator');

    this.vopSpinnerLeft_ = document.createElement('div');
    this.vopSpinnerLeft_.setAttribute('class', 'vop-spinner-left');

    this.vopSpinnerCircle1_ = document.createElement('div');
    this.vopSpinnerCircle1_.setAttribute('class', 'vop-spinner-circle');

    this.vopSpinnerRight_ = document.createElement('div');
    this.vopSpinnerRight_.setAttribute('class', 'vop-spinner-right');

    this.vopSpinnerCircle2_ = document.createElement('div');
    this.vopSpinnerCircle2_.setAttribute('class', 'vop-spinner-circle');

    this.vopSpinnerLeft_.appendChild(this.vopSpinnerCircle1_);
    this.vopSpinnerRight_.appendChild(this.vopSpinnerCircle2_);
    this.vopSpinnerRotator_.appendChild(this.vopSpinnerLeft_);
    this.vopSpinnerRotator_.appendChild(this.vopSpinnerRight_);
    this.vopSpinnerContainer_.appendChild(this.vopSpinnerRotator_);

    this.element_.appendChild(this.vopSpinnerContainer_);

    this.addPlayerListeners();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onMediaPlaying_ = this.onMediaPlaying.bind(this);
    this.onMediaWaiting_ = this.onMediaWaiting.bind(this);
    this.onMediaClosed_ = this.onMediaClosed.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_WAITING, this.onMediaWaiting_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PLAYING, this.onMediaPlaying_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_CLOSED, this.onMediaClosed_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_COMPLETE, this.onMediaClosed_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_WAITING, this.onMediaWaiting_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PLAYING, this.onMediaPlaying_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_CLOSED, this.onMediaClosed_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_COMPLETE, this.onMediaClosed_);
    this.onMediaPlaying_ = null;
    this.onMediaWaiting_ = null;
    this.onMediaClosed_ = null;
  }

  onMediaWaiting() {
    DOM.addClass(this.context_.vopSkinContainer, 'vop-buffering');
  }

  onMediaPlaying() {
    DOM.removeClass(this.context_.vopSkinContainer, 'vop-buffering');
  }

  onMediaClosed() {
    DOM.removeClass(this.context_.vopSkinContainer, 'vop-buffering');
  }
}

export default UIBufferingOverlay;



