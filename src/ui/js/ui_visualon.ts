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
import UICardBoardToggleButton from './components/ui_cardboard_toggle_button';
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

    if (this.player_.VideoEnhance && this.player_.VideoEnhance.isVideoEnhanceSupported()) {
      uiControlBar.addComponent(new UIVideoEnhancementToggleButton(this.context_));
    }

    if (this.player_.VR && this.player_.VR.isVRSupported()) {
        uiControlBar.addComponent(new UICardBoardToggleButton(this.context_));
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
  private flagShouldTogglePlay_: Boolean;
  private flagTouchMoveCount_: number;
  private flagMenuPopup_: Boolean;

  // player functions
  private onPlayerSourceClosed_: Function;
  private onMediaEnded_: Function;
  private onMediaPaused_: Function;
  private onMediaOpenStarted_: Function;
  private onMediaPlaying_: Function;
  private onMediaWaiting_: Function;
  private onMediaCanPlay_: Function;
  private onFullscreenChanged_: any;

  // ui events
  private onPlayerMouseEnter_: any;
  private onPlayerMouseLeave_: any;
  private onPlayerMouseMove_: any;
  private onPlayerMouseDown_: any;
  private onPlayerMouseUp_: any;

  private onProgressbarMouseEnter_: any;
  private onControlBarMouseMove_: any;
  private onPopupMenuChange_: any;

  constructor(context) {
    super(context);

    this.uiAdsContainer_ = new UIAdsContainer(this.context_);

    this.uiSkinVisualOn_ = new UISkinVisualOn(this.context_);
    this.vopSkinContainer_.appendChild(this.uiSkinVisualOn_.getElement());

    this.playerState_ = '';
    this.flagShouldTogglePlay_ = false;
    this.flagTouchMoveCount_ = 0;
    this.flagMenuPopup_ = false;

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
    this.onPopupMenuChange_ = this.onPopupMenuChange.bind(this);
    this.eventbus_.on(Events.PROGRESSBAR_MOUSEENTER, this.onProgressbarMouseEnter_);
    this.eventbus_.on(Events.CONTROLBAR_MOUSEMOVE, this.onControlBarMouseMove_);
    this.eventbus_.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
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
    this.eventbus_.off(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
    this.onProgressbarMouseEnter_ = null;
    this.onControlBarMouseMove_ = null;
    this.onPopupMenuChange_ = null;
  }

  initPlayerListeners() {
    // content playback events
    this.onPlayerSourceClosed_ = this.onPlayerSourceClosed.bind(this);
    this.onMediaEnded_ = this.onMediaEnded.bind(this);
    this.onMediaPaused_ = this.onMediaPaused.bind(this);
    this.onMediaOpenStarted_ = this.onMediaOpenStarted.bind(this);
    this.onMediaPlaying_ = this.onMediaPlaying.bind(this);
    this.onMediaWaiting_ = this.onMediaWaiting.bind(this);
    this.onMediaCanPlay_ = this.onMediaCanPlay.bind(this);
    this.onFullscreenChanged_ = this.onFullscreenChanged.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_CLOSED, this.onPlayerSourceClosed_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_COMPLETE, this.onMediaEnded_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_OPEN, this.onMediaOpenStarted_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PLAYING, this.onMediaPlaying_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PAUSED, this.onMediaPaused_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_WAITING, this.onMediaWaiting_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_CANPLAY, this.onMediaCanPlay_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_FULLSCREEN_CHANGE, this.onFullscreenChanged_);
  }

  uninitPlayerListeners() {
    // content playback events
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_CLOSED, this.onPlayerSourceClosed_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_COMPLETE, this.onMediaEnded_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_OPEN, this.onMediaOpenStarted_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PLAYING, this.onMediaPlaying_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PAUSED, this.onMediaPaused_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_WAITING, this.onMediaWaiting_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_CANPLAY, this.onMediaCanPlay_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_FULLSCREEN_CHANGE, this.onFullscreenChanged_);
    this.onPlayerSourceClosed_ = null;
    this.onMediaEnded_ = null;
    this.onMediaOpenStarted_ = null;
    this.onMediaPaused_ = null;
    this.onMediaPlaying_ = null;
    this.onMediaWaiting_ = null;
    this.onMediaCanPlay_ = null;
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
  }

  ///////////////////////////////////////////////////////////////////////////
  // Title: Tool function
  addAutohideAction() {
    DOM.addClass(this.vopSkinContainer_, 'vop-autohide');
    this.eventbus_.emit(Events.AUTOHIDE_CHANGE, {
      autohide: true
    });

    // should hide the menu of setting at the same time
    super.hideMenu();
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
    this.showUIForWhile();

    // its hard to tap without a touchmove, if there have been less than one, we should still toggle play
    if (e.type === 'mousemove' && this.flagTouchMoveCount_ < 1) {
        this.flagTouchMoveCount_++;
        return;
    }
    this.flagShouldTogglePlay_ = false;
  }

  showUIForWhile() {
    if(this.flagTimerHideControlBar_ != null)
        return;

    this.removeAutohideAction();
    this.flagTimerHideControlBar_ = setTimeout(() => {
      //if menu is popup, the controlbar will not do auto hide.
      if (this.flagMenuPopup_)
        return;

      this.onPlayerMouseLeave(null);
      this.flagTimerHideControlBar_ = null;
    }, 3000);
  }

  isMouseInVideoArea(e){
    if (!e) {
      return false;
    }

    let x=e.clientX;
    let y=e.clientY;
    let divx1 = this.vopSkinContainer_.getBoundingClientRect().left + 10;
    let divy1 = this.vopSkinContainer_.getBoundingClientRect().top + 10;
    let divx2 = this.vopSkinContainer_.getBoundingClientRect().right - 10;
    let divy2 = this.vopSkinContainer_.getBoundingClientRect().bottom - 10;
    if( x < divx1 || x > divx2 || y < divy1 || y > divy2){
      return false;
    }

    return true;
  }

  onPlayerMouseLeave(e) {
    if (this.playerState_ !== 'playing') {
      return;
    }else {
      if (!this.isMouseInVideoArea(e)) {
        this.addAutohideAction();
      }
    }
  }

  onPlayerMouseDown(e) {
    this.flagShouldTogglePlay_ = true;
    this.flagTouchMoveCount_ = 0;
  }

  onPlayerMouseUp(e) {
    if (this.context_.uiConfig.allowScreenControl) {
        if (this.flagShouldTogglePlay_)  {
        this.flagShouldTogglePlay_ = false;
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

  //get if the menu is popup
  onPopupMenuChange(e) {
    this.flagMenuPopup_ = (e.menu != 'none');
  }

  ////////////////////////////////////////////////////////////////////////////////////
  // player events callback
  onPlayerSourceClosed() {
    this.updateUIStateMachine('idle');
  }

  onMediaEnded() {
    this.removeAutohideAction();
    this.updateUIStateMachine('ended');
  }
  
  onMediaOpenStarted() {
    this.updateUIStateMachine('opening');
  }

  onMediaPlaying() {
    this.updateUIStateMachine('playing');
    this.showUIForWhile();
  }
  
  onMediaWaiting() {
    if (this.player_.isPaused()) {
        this.updateUIStateMachine('buffering_paused');
    }else {
        this.updateUIStateMachine('buffering');
    }
  }
  
  onMediaCanPlay() {
    if (this.player_.isPaused()) {
        this.updateUIStateMachine('paused');
    }
  }
  
  onMediaPaused() {
    if (this.player_.isEnded()) {
      this.updateUIStateMachine('ended');
    } else {
      if (this.playerState_ === 'buffering' || this.playerState_ === 'buffering_paused') {
        this.updateUIStateMachine('buffering_paused');
      }else {
        this.updateUIStateMachine('paused');
      }
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
