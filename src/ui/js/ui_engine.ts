import UIVisualOn from './ui_visualon';
import EventBus from './eventbus';
import UIDebug from './debug';

class UIEngine {
  private context_: any;
  private eventbus_: any;
  private debug_: any;
  private player_: any;
  private playerContainer_: HTMLElement;
  private html5VideoPlayer_: HTMLElement;
  private vopSkinContainer_: HTMLElement;
  private uiVisualOn_: UIVisualOn;
  private uiConfig_: any;

  constructor(player, mediaCfg) {
    this.context_ = {};
    this.context_.eventbus = this.eventbus_ = new EventBus(this.context_);
    this.context_.debug = this.debug_ = new UIDebug();
    this.context_.player = this.player_ = player;
    this.context_.playerContainer = this.playerContainer_ = this.player_.getContainer();
    this.debug_.log('+UIEngine, constructor');
  }

  destroy() {
    this.debug_.log('+UIEngine, destroy');
    this.releaseUI();
  }

  buildUI(uiConfig: any) {
    this.debug_.log('+UIEngine, buildUI');

    // build ui container
    if (!this.html5VideoPlayer_) {
      this.html5VideoPlayer_ = this.playerContainer_.querySelector('.html5-video-player');
    }

    this.vopSkinContainer_ = this.playerContainer_.querySelector('.vop-skin-container');
    if (!this.vopSkinContainer_) {
      this.vopSkinContainer_ = document.createElement('div');
      this.vopSkinContainer_.setAttribute('class', 'vop-skin-container');

      let adsContainer = this.playerContainer_.querySelector('.vop-ads-container');
      if (adsContainer) {
        this.html5VideoPlayer_.insertBefore(this.vopSkinContainer_, adsContainer);
      } else {
        this.html5VideoPlayer_.appendChild(this.vopSkinContainer_);
      }
    }

    this.context_.vopSkinContainer = this.vopSkinContainer_;
    this.uiConfig_ = {
      PIP: true,
      AIRPLAY: true,
      CHROMECAST: true,
      allowScreenControl: true
    };
    if (uiConfig) {
      (<any>Object).assign(this.uiConfig_,uiConfig);
    }
    this.context_.uiConfig = this.uiConfig_;

    // TODO: support one kind of skin for now.
    this.uiVisualOn_ = new UIVisualOn(this.context_);
  }

  hideUI() {
    this.debug_.log('+UIEngine, hideUI');
    if (this.html5VideoPlayer_ && this.vopSkinContainer_) {
      this.vopSkinContainer_.style.display = 'none';
    }
  }

  showUI() {
    this.debug_.log('+UIEngine, showUI');
    if (this.html5VideoPlayer_ && this.vopSkinContainer_) {
      this.vopSkinContainer_.style.display = 'block';
    }
  }

  releaseUI() {
    this.debug_.log('+UIEngine, releaseUI');
    if (this.html5VideoPlayer_ && this.vopSkinContainer_) {
      this.html5VideoPlayer_.removeChild(this.vopSkinContainer_);
      this.vopSkinContainer_ = null;
    }
    if (this.uiVisualOn_) {
      this.uiVisualOn_.destroy();
      this.uiVisualOn_ = null;
    }
  }

  voName(): String {
    return 'UIEngine';
  }
}

export default UIEngine;