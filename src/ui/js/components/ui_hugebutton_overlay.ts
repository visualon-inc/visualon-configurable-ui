import UIContainer from './ui_container';
import DOM from '../dom';

class UIHugeButtonOverlay extends UIContainer {
  private vopHugeButton_: HTMLElement;
  private onMediaPlay_: Function;
  private onMediaPaused_: Function;
  private onMediaEnded_: Function;
  constructor(context) {
    super(context, false);
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-huge-button-container');
    this.element_.addEventListener('animationend', this.onGiantAnimationEnd.bind(this));
    this.element_.style.display = 'none';
    this.initChildren();
    this.addPlayerListeners();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onMediaEnded_ = this.onMediaEnded.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_COMPLETE, this.onMediaEnded_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    if (this.player_) {
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_COMPLETE, this.onMediaEnded_);
      this.onMediaEnded_ = null;
    }
  }

  initChildren() {
    this.vopHugeButton_ = document.createElement('div');
    this.vopHugeButton_.setAttribute('class', 'vop-huge-button');
    this.element_.appendChild(this.vopHugeButton_);
  }

  onGiantAnimationEnd(e) {
    this.element_.style.display = 'none';
  }

  onMediaEnded() {
    this.element_.style.display = 'none';
  }
}

export default UIHugeButtonOverlay;