import '../css/ui_skin_visualon.scss';
import Events from './events';
import * as EventEmitter from 'events';
import DOM from './dom';
import UAParser from './uaparser';

import UIContainer from './components/ui_container';

import UITitleBar from './components/ui_title_bar';
import UIPopupMenu from './components/ui_popup_menu';

import UIGradientBottom from './components/ui_gradient_bottom';

import UICaptionOverlay from './components/ui_caption_overlay';
import UIHugeButtonOverlay from './components/ui_hugebutton_overlay';
import UIBufferingOverlay from './components/ui_buffering_overlay';
import UIPlayOverlay from './components/ui_play_overlay';
import UIErrorMsgOverlay from './components/ui_error_msg_overlay';
import UIChromecastOverlay from './components/ui_chromecast_overlay';
import UIToolTip from './components/ui_tooltip';
import UIProgressBar from './components/ui_progress_bar';
import UIControlBar from './components/ui_control_bar';
import UIBottomBar from './components/ui_bottom_bar';

import UIAdsPlayToggleButton from './components/ui_ads_play_toggle_button';
import UIPlayToggleButton from './components/ui_play_toggle_button';
import UIVolumeToggleButton from './components/ui_volume_toggle_button';
import UIVolumeBar from './components/ui_volume_bar';
import { UITimeLabelMode, UITimeLabel } from './components/ui_time_label';
import UISpacer from './components/ui_spacer';
import UIPipToggleButton from './components/ui_pip_toggle_button';
import UIAirplayToggleButton from './components/ui_airplay_toggle_button';
import UIChromecastToggleButton from './components/ui_chromecast_toggle_button';
import UISubtitlesToggleButton from './components/ui_subtitles_toggle_button';
import UISettingsToggleButton from './components/ui_settings_toggle_button';
import UIFullscreenToggleButton from './components/ui_fullscreen_toggle_button';
import UIFastForwardToggleButton from './components/ui_fast_forward_toggle_button'
import UIFastRewindToggleButton from './components/ui_fast_rewind_toggle_button'
import UIVideoEnhancementToggleButton from './components/ui_video_enhancement_toggle_button';

import UIAdsContainer from './components/ui_ads_container';

class UISkinVisualOn extends UIContainer {
  constructor(context: any) {
    super(context, false);

    let uaInfo = UAParser();
    this.context_.uaInfo = uaInfo;

    // init ui structure
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-skin-visualon');

    let uiControlBar = new UIControlBar(this.context_);
    uiControlBar.addComponent(new UIAdsPlayToggleButton(this.context_));
    uiControlBar.addComponent(new UIPlayToggleButton(this.context_));
    uiControlBar.addComponent(new UIVolumeToggleButton(this.context_));
    if (this.context_.uaInfo.browser!="safari" || !this.context_.uaInfo.data.ios) {
      uiControlBar.addComponent(new UIVolumeBar(this.context_));
    }
    uiControlBar.addComponent(new UITimeLabel(this.context_, UITimeLabelMode.PositionAndDuration));
    uiControlBar.addComponent(new UIFastRewindToggleButton(this.context_))
    uiControlBar.addComponent(new UIFastForwardToggleButton(this.context_))
    uiControlBar.addComponent(new UISpacer(this.context_));

    let uiConfig = this.context_.uiConfig;
    if (uiConfig.PIP && this.player_.isPipSupported()) {
      uiControlBar.addComponent(new UIPipToggleButton(this.context_));
    }
    if (uiConfig.AIRPLAY && this.player_.isAirplaySupported()) {
      uiControlBar.addComponent(new UIAirplayToggleButton(this.context_));
    }

    if (uiConfig.CHROMECAST) {
      uiControlBar.addComponent(new UIChromecastToggleButton(this.context_));
    }

    uiControlBar.addComponent(new UISubtitlesToggleButton(this.context_));

    if (this.player_.isVideoEnhanceSupported()) {
      uiControlBar.addComponent(new UIVideoEnhancementToggleButton(this.context_));
    }

    uiControlBar.addComponent(new UISettingsToggleButton(this.context_));
    uiControlBar.addComponent(new UIFullscreenToggleButton(this.context_));

    let uiBottomBar_ = new UIBottomBar(this.context_);
    uiBottomBar_.addComponent(new UIProgressBar(this.context_));
    uiBottomBar_.addComponent(uiControlBar);

    if(uiConfig.CHROMECAST) {
      this.components_.push(new UIChromecastOverlay(this.context_));
    }

    this.components_.push(new UITitleBar(this.context_));
    // this.components_.push(new UICaptionOverlay(this.context_));
    this.components_.push(new UIPopupMenu(this.context_));
    this.components_.push(new UIToolTip(this.context_));
    this.components_.push(new UIGradientBottom(this.context_));
    this.components_.push(uiBottomBar_);
    this.components_.push(new UIBufferingOverlay(this.context_));
    this.components_.push(new UIHugeButtonOverlay(this.context_));
    this.components_.push(new UIPlayOverlay(this.context_));
    this.components_.push(new UIErrorMsgOverlay(this.context_));

    for (let i = 0; i < this.components_.length; i ++) {
      let component = this.components_[i];
      this.element_.appendChild(component.getElement());
    }
  }
}

class UIVisualOn extends UIContainer {
  private uiSkinVisualOn_: UISkinVisualOn;

  private playerState_: string;

  // ui components
  private uiAdsContainer_: UIAdsContainer;

  // flag
  private flagTimerHideControlBar_: any;
  private flagPlayerMouseDown_: any;

  // player functions
  private onPlayerSourceClosed_: Function;
  private onMediaEnded_: Function;
  private onMediaPaused_: Function;
  private onMediaPlaying_: Function;
  private onFullscreenChanged_: any;

  // ui events
  private onPlayerMouseEnter_: any;
  private onPlayerMouseLeave_: any;
  private onPlayerMouseMove_: any;
  private onPlayerMouseDown_: any;
  private onPlayerMouseUp_: any;

  private onProgressbarMouseEnter_: any;
  private onControlBarMouseMove_: any;

  constructor(context) {
    super(context);

    this.uiAdsContainer_ = new UIAdsContainer(this.context_);

    this.uiSkinVisualOn_ = new UISkinVisualOn(this.context_);
    this.vopSkinContainer_.appendChild(this.uiSkinVisualOn_.getElement());

    this.playerState_ = '';

    this.initUIEventListeners();
    this.initPlayerListeners();
    this.syncPlayerState();
  }

  destroy() {
    this.uninitUIEventListeners();
    this.uninitPlayerListeners();

    if (this.uiAdsContainer_) {
      this.uiAdsContainer_.destroy();
    }
    if (this.uiSkinVisualOn_) {
      this.uiSkinVisualOn_.destroy();
    }
  }

  ///////////////////////////////////////////////////////////////////////
  // Title: init part
  initUIEventListeners() {
    this.onPlayerMouseEnter_ = this.onPlayerMouseEnter.bind(this);
    this.onPlayerMouseLeave_ = this.onPlayerMouseLeave.bind(this);
    this.onPlayerMouseMove_ = this.onPlayerMouseMove.bind(this);
    this.onPlayerMouseDown_ = this.onPlayerMouseDown.bind(this);
    this.onPlayerMouseUp_ = this.onPlayerMouseUp.bind(this);
    this.vopSkinContainer_.addEventListener('mouseenter', this.onPlayerMouseEnter_);
    this.vopSkinContainer_.addEventListener('mouseleave', this.onPlayerMouseLeave_);
    this.vopSkinContainer_.addEventListener('mousemove', this.onPlayerMouseMove_);
    this.vopSkinContainer_.addEventListener('mousedown', this.onPlayerMouseDown_);
    this.vopSkinContainer_.addEventListener('mouseup', this.onPlayerMouseUp_);

    this.onProgressbarMouseEnter_ = this.onProgressbarMouseEnter.bind(this);
    this.onControlBarMouseMove_ = this.onControlBarMouseMove.bind(this);
    this.eventbus_.on(Events.PROGRESSBAR_MOUSEENTER, this.onProgressbarMouseEnter_);
    this.eventbus_.on(Events.CONTROLBAR_MOUSEMOVE, this.onControlBarMouseMove_);
  }

  uninitUIEventListeners() {
    this.vopSkinContainer_.removeEventListener('mouseenter', this.onPlayerMouseEnter_);
    this.vopSkinContainer_.removeEventListener('mouseleave', this.onPlayerMouseLeave_);
    this.vopSkinContainer_.removeEventListener('mousemove', this.onPlayerMouseMove_);
    this.vopSkinContainer_.removeEventListener('mousedown', this.onPlayerMouseDown_);
    this.vopSkinContainer_.removeEventListener('mouseup', this.onPlayerMouseUp_);

    this.onPlayerMouseEnter_ = null;
    this.onPlayerMouseLeave_ = null;
    this.onPlayerMouseMove_ = null;
    this.onPlayerMouseDown_ = null;
    this.onPlayerMouseUp_ = null;

    this.eventbus_.off(Events.PROGRESSBAR_MOUSEENTER, this.onProgressbarMouseEnter_);
    this.eventbus_.off(Events.CONTROLBAR_MOUSEMOVE, this.onControlBarMouseMove_);
    this.onProgressbarMouseEnter_ = null;
    this.onControlBarMouseMove_ = null;
  }

  initPlayerListeners() {
    // content playback events
    this.onPlayerSourceClosed_ = this.onPlayerSourceClosed.bind(this);
    this.onMediaEnded_ = this.onMediaEnded.bind(this);
    this.onMediaPaused_ = this.onMediaPaused.bind(this);
    this.onMediaPlaying_ = this.onMediaPlaying.bind(this);
    this.onFullscreenChanged_ = this.onFullscreenChanged.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_CLOSED, this.onPlayerSourceClosed_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_COMPLETE, this.onMediaEnded_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PLAYING, this.onMediaPlaying_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PAUSED, this.onMediaPaused_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_FULLSCREEN_CHANGE, this.onFullscreenChanged_);
  }

  uninitPlayerListeners() {
    // content playback events
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_CLOSED, this.onPlayerSourceClosed_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_COMPLETE, this.onMediaEnded_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PLAYING, this.onMediaPlaying_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PAUSED, this.onMediaPaused_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_FULLSCREEN_CHANGE, this.onFullscreenChanged_);
    this.onPlayerSourceClosed_ = null;
    this.onMediaEnded_ = null;
    this.onMediaPaused_ = null;
    this.onMediaPlaying_ = null;
    this.onFullscreenChanged_ = null;
  }

  ///////////////////////////////////////////////////////////////////////////
  // This function is mainly focus on:
  // 1. Record the player state, and refect it to UI
  updateUIStateMachine(state) {
    this.debug_.log('updateUIStateMachine, state: ' + state);

    //
    DOM.removeClass(this.vopSkinContainer_, 'vop-player-' + this.playerState_);
    DOM.addClass(this.vopSkinContainer_, 'vop-player-' + state);

    // Update all child components.
    this.playerState_ = state;

    if (this.playerState_ === 'opening') {
      DOM.addClass(this.vopSkinContainer_, 'vop-buffering');
    } else if (this.playerState_ === 'opened') {
      DOM.removeClass(this.vopSkinContainer_, 'vop-buffering');
    }
  }

  ///////////////////////////////////////////////////////////////////////////
  // Title: Tool function
  addAutohideAction() {
    DOM.addClass(this.vopSkinContainer_, 'vop-autohide');
    this.eventbus_.emit(Events.AUTOHIDE_CHANGE, {
      autohide: true
    });
  }

  removeAutohideAction() {
    DOM.removeClass(this.vopSkinContainer_, 'vop-autohide');
    if (this.flagTimerHideControlBar_) {
      clearTimeout(this.flagTimerHideControlBar_);
      this.flagTimerHideControlBar_ = null;
    }
    this.eventbus_.emit(Events.AUTOHIDE_CHANGE, {
      autohide: false
    });
  }

  ///////////////////////////////////////////////////////////////////
  onPlayerMouseEnter(e) {
    if (this.playerState_ !== 'playing') {
      return;
    }
    // When mouse enter any elements in 'vop-skin-visualon', it needs to remove the 'vop-autohide' attribute.
    //(window as any).console.log('+onPlayerMouseEnter, element: ' + e.target.className);
    this.removeAutohideAction();
  }

  onPlayerMouseMove(e) {
    if (this.playerState_ !== 'playing') {
      return;
    }

    this.showUIForWhile();
  }

  showUIForWhile() {
    this.removeAutohideAction();
    this.flagTimerHideControlBar_ = setTimeout(() => {
      this.onPlayerMouseLeave();
    }, 3000);
  }

  onPlayerMouseLeave() {
    if (this.playerState_ !== 'playing') {
      return;
    }

    let paused = this.player_.isPaused();
    if (!paused) {
      this.addAutohideAction();
    }
  }

  onPlayerMouseDown(e) {
    // If playerState_ is 'opened', let ui_play_overlay components handle play action.
    if (this.playerState_ === 'opened') {
      return;
    }

    this.flagPlayerMouseDown_ = true;
  }

  onPlayerMouseUp(e) {
    if (this.context_.uiConfig.allowScreenControl) {
      if (this.flagPlayerMouseDown_) {
        this.flagPlayerMouseDown_ = false;
        this.eventbus_.emit(Events.PLAY_BUTTON_CLICK);
      }
    }
  }

  onProgressbarMouseEnter(e) {
    this.removeAutohideAction();
  }

  onControlBarMouseMove(e) {
    e.stopPropagation();
    this.removeAutohideAction();
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // player events callback
  onOmOpening() {
    this.updateUIStateMachine('opening');
  }

  onPlayerOpenFinished() {
    this.updateUIStateMachine('opened');
  }

  onPlayerSourceClosed() {
    this.updateUIStateMachine('idle');
  }

  onMediaEnded() {
    this.removeAutohideAction();
    this.updateUIStateMachine('ended');
  }

  onMediaPlaying() {
    this.updateUIStateMachine('playing');

    this.showUIForWhile();
  }

  onMediaPaused() {
    if (this.player_.isEnded()) {
      this.updateUIStateMachine('ended');
    } else {
      this.updateUIStateMachine('paused');
    }
    // when paused, show the control bar
    this.removeAutohideAction();
  }

  onFullscreenChanged() {
    this.showUIForWhile();
  }

  onAdBreakStarted() {
    this.updateUIStateMachine('playing');
  }

  onAdBreakComplete() {
    if (this.player_.isEnded()) {
      this.removeAutohideAction();
      this.updateUIStateMachine('ended');
    }
  }

  onAdStarted(e) {
  }

  onAdComplete() {
  }

  onAdCompanions(e) {
    let v = document.getElementById('idCompanionAd');
    for (let i = 0; i < e.companions.length; i++) {
      let companion = e.companions[i];
      if (v.clientWidth === companion.width && v.clientHeight === companion.height) {
        v.innerHTML = companion.content;
      }
    }
  }

  syncPlayerState() {
    this.updateUIStateMachine('idle');
  }
}

export default UIVisualOn;
