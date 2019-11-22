class UIComponent {
  protected context_: any;
  protected player_: any;
  protected eventbus_: any;
  protected element_: HTMLElement;
  protected vopSkinContainer_: HTMLElement;
  protected components_: any[];
  protected debug_: any;
  protected uaInfo_: any;
  protected onPlayerOpenFinished_: Function;
  // ad callback event
  protected onAdBreakStarted_: Function;
  protected onAdBreakComplete_: Function;
  protected onAdStarted_: Function;
  protected onAdComplete_: Function; 
  protected bHandleAds_: boolean;
  protected dataAdClient_: string;
  protected flagAdBreakStart_: boolean;
  protected flagNonLinearAd_: boolean;
  constructor(context, bHandleAds = true) {
    this.context_ = context;
    this.player_ = this.context_.player;
    this.eventbus_ = this.context_.eventbus;
    this.vopSkinContainer_ = this.context_.vopSkinContainer;
    this.element_ = null;
    this.components_ = [];
    this.debug_ = this.context_.debug;
    this.uaInfo_ = this.context_.uaInfo;

    this.bHandleAds_ = bHandleAds;
    this.addPlayerListeners();
  }

  destroy() {
    for (let i = 0; i < this.components_.length; i ++) {
      let component = this.components_[i];
      if (component) {
        component.destroy();
      }
    }
    
    this.removePlayerListeners();
  }

  getElement() {
    return this.element_;
  }

  addPlayerListeners() {
    if (this.bHandleAds_) {
      this.onAdBreakStarted_ = this.onAdBreakStarted.bind(this);
      this.onAdBreakComplete_ = this.onAdBreakComplete.bind(this);
      this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_AD_BREAK_STARTED, this.onAdBreakStarted_);
      this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_AD_BREAK_COMPLETE, this.onAdBreakComplete_);

      this.onAdStarted_ = this.onAdStarted.bind(this);
      this.onAdComplete_ = this.onAdComplete.bind(this);
      this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_AD_STARTED, this.onAdStarted_);
      this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_AD_COMPLETE, this.onAdComplete_);
    }

    this.onPlayerOpenFinished_ = this.onPlayerOpenFinished.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_OPEN_FINISHED, this.onPlayerOpenFinished_);
  }

  removePlayerListeners() {
    if (this.player_) {
      if (this.bHandleAds_) {
        this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_AD_BREAK_STARTED, this.onAdBreakStarted_);
        this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_AD_BREAK_COMPLETE, this.onAdBreakComplete_);
        this.onAdBreakStarted_ = null;
        this.onAdBreakComplete_ = null;

        this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_AD_STARTED, this.onAdStarted_);
        this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_AD_COMPLETE, this.onAdComplete_);
        this.onAdStarted_ = null;
        this.onAdComplete_ = null;
      }

      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_OPEN_FINISHED, this.onPlayerOpenFinished_);
      this.onPlayerOpenFinished_ = null;
    }
  }

  onAdBreakStarted() {
    this.flagAdBreakStart_ = true;
  }

  onAdBreakComplete() {
    this.flagAdBreakStart_ = false;
  }

  onAdStarted(e) {
    this.dataAdClient_ = e.client;
    this.flagNonLinearAd_ = false;
    if (e.client === 'googleima' && (e.adType === 'nonlinear')) {
      this.flagNonLinearAd_ = true;
    }

    if (!this.flagNonLinearAd_) {
      this.hide();
    } else {
      this.show();
    }
  }

  onAdComplete() {
    this.show();
  }

  onPlayerOpenFinished() {
  }

  show(type?: string) {
    if (type) {
      this.element_.style.display = type;
    } else {
      this.element_.style.display = 'inline-block';
    }
  }

  hide() {
    this.element_.style.display = 'none';
  }
}

export default UIComponent;
