import UIContainer from './ui_container';
import DOM from '../dom';
import UITools from '../ui_tools';
import { ProgressInfo, ProgressInfoObj } from '../common';

export enum UITimeLabelMode {
  Position,
  Duration,  // or live
  PositionAndDuration,
}

export class UITimeLabel extends UIContainer {
  private mode_: UITimeLabelMode;
  private vopTimeLabel_: HTMLElement;
  private onMediaTimeupdated_: any;
  private onMediaPaused_: any;
  private onMediaSeekStart_: any;
  private onAllAdsCompleted_: any;
  constructor(context, mode) {
    super(context);
    this.mode_ = mode;

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-time-display');
    this.element_.addEventListener('click', this.onUICmdLiveEdge.bind(this));

    this.initChildren();
    this.addPlayerListeners();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onMediaTimeupdated_ = this.onMediaTimeupdated.bind(this);
    this.onMediaPaused_ = this.onMediaPaused.bind(this);
    this.onMediaSeekStart_ = this.onMediaSeekStart.bind(this);
    this.onAllAdsCompleted_ = this.onAllAdsCompleted.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_TIME_UPDATED, this.onMediaTimeupdated_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PAUSED, this.onMediaPaused_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_SEEK_START, this.onMediaSeekStart_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_AD_ALL_ADS_COMPLETED, this.onAllAdsCompleted_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    if (this.player_) {
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_TIME_UPDATED, this.onMediaTimeupdated_);
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PAUSED, this.onMediaPaused_);
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_SEEK_START, this.onMediaSeekStart_);
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_AD_ALL_ADS_COMPLETED, this.onAllAdsCompleted_);
      this.onMediaTimeupdated_ = null;
      this.onMediaPaused_ = null;
      this.onMediaSeekStart_ = null;
      this.onAllAdsCompleted_ = null;
    }
  }


  initChildren() {
    this.vopTimeLabel_ = document.createElement('span');
    this.vopTimeLabel_.setAttribute('class', 'vop-time-text notranslate');
    this.element_.appendChild(this.vopTimeLabel_);
  }

  onMediaTimeupdated(info) {
    if (info.live) {
      info.position = info.position - info.range.start;
      if (info.position < 0) info.position = 0;
      info.duration = info.range.end - info.range.start;
    }

    this.updateTimeLabel(info);
  }

  onAllAdsCompleted() {
  }

  onMediaPaused() {
  }

  onMediaSeekStart() {
  }

  isInLiveEdge(info) {
    let liveEdge = false;
    let defaultTimeShift = 10;
    if (info.duration - info.position < defaultTimeShift) {
      liveEdge = true;
    }
    return liveEdge;
  }

  onUICmdLiveEdge() {
    super.hideMenu();

    // seek to live point if click the 'live' button
    let info: any = UITools.getProgressInfo(this.player_);
    if (info.live && !this.isInLiveEdge(info)) {
      this.player_.setPosition(info.range.end);
    }
  }

  onAdStarted() {
    let info: ProgressInfo = UITools.getProgressInfo(this.player_);
    this.updateTimeLabel(info);
  }

  onAdComplete() {
    let info: ProgressInfo = UITools.getProgressInfo(this.player_);
    this.updateTimeLabel(info);
  }

  updateTimeLabel(info) {
    let timeText = '';
    if (this.mode_ === UITimeLabelMode.PositionAndDuration) {
      // update time display label
      if (info.live) {
        timeText = 'Live';
      } else {
        let c = UITools.TimeToString(info.position);
        let d = UITools.TimeToString(info.duration);
        timeText = c + ' / ' + d;
      }
      this.vopTimeLabel_.innerText = timeText;

      if (info.live) {
        if (this.isInLiveEdge(info)) {
          DOM.addClass(this.vopTimeLabel_, 'vop-time-text-live');
          DOM.removeClass(this.vopTimeLabel_, 'vop-time-text-live-gray');
        } else {
          DOM.removeClass(this.vopTimeLabel_, 'vop-time-text-live');
          DOM.addClass(this.vopTimeLabel_, 'vop-time-text-live-gray');
        }
      } else {
        DOM.removeClass(this.vopTimeLabel_, 'vop-time-text-live');
        DOM.removeClass(this.vopTimeLabel_, 'vop-time-text-live-gray');
      }
    } else if (this.mode_ === UITimeLabelMode.Position) {
      if (info.live) {
        this.element_.style.display = 'none';
      } else {
        this.vopTimeLabel_.innerText = UITools.TimeToString(info.position);
      }
    } else if (this.mode_ === UITimeLabelMode.Duration) {
      if (info.live) {
        timeText = 'Live';
      } else {
        timeText = UITools.TimeToString(info.duration);
      }
      this.vopTimeLabel_.innerText = timeText;

      if (info.live) {
        if (this.isInLiveEdge(info)) {
          DOM.addClass(this.vopTimeLabel_, 'vop-time-text-live');
          DOM.removeClass(this.vopTimeLabel_, 'vop-time-text-live-gray');
        } else {
          DOM.removeClass(this.vopTimeLabel_, 'vop-time-text-live');
          DOM.addClass(this.vopTimeLabel_, 'vop-time-text-live-gray');
        }
      }
    }
  }
}
