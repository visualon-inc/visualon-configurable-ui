import UIButton from './ui_button';
import DOM from '../dom';

class UIFullscreenToggleButton extends UIButton {
  private onFullscreenChanged_: any;
  constructor(context) {
    super(context, false);

    this.initElement('vop-fullscreen-button icon-on', 'fullscreen');

    this.addPlayerListeners();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onFullscreenChanged_ = this.onFullscreenChanged.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_FULLSCREEN_CHANGE, this.onFullscreenChanged_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    if (this.player_) {
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_FULLSCREEN_CHANGE, this.onFullscreenChanged_);
      this.onFullscreenChanged_ = null;
    }
  }

  onHandleClick() {
    if (this.player_.isFullscreen()) {
      this.player_.exitFullscreen();
    } else {
      let ele = document.getElementById('fullscreen-Container');
      if (ele)
        this.player_.enterFullscreen(ele);
      else
        this.player_.enterFullscreen();
    }
  }

  onFullscreenChanged() {
    let flagIsFullscreen = this.player_.isFullscreen();

    if (flagIsFullscreen) {
      DOM.removeClass(this.element_, 'icon-on');
      DOM.addClass(this.element_, 'icon-off');
      this.element_.title = 'exit fullscreen';
    } else {
      DOM.removeClass(this.element_, 'icon-off');
      DOM.addClass(this.element_, 'icon-on');
      this.element_.title = 'fullscreen';
    }
  }
}

export default UIFullscreenToggleButton;