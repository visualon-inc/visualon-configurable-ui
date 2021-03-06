import UIComponent from './ui_component';
import DOM from '../dom';
import Events from '../events';
import UITools from '../ui_tools';

import { ProgressInfo, ProgressInfoObj } from '../common';

class UIProgressBar extends UIComponent {
  private progressBarContext_: any;
  private progressBarMoveContext_: any;
  private flagThumbnailMode_: boolean;
  private isSeekStart_: boolean;
  private onProgressBarMouseDown_: any;
  private onProgressBarMouseMove_: any;
  private onProgressBarMouseEnter_: any;
  private onProgressBarMouseLeave_: any;

  private newProgressBarMouseMove_: any;
  private newProgressBarMouseUp_: any;

  private vopLoadProgress_: HTMLElement;
  private vopHoverProgress_: HTMLElement;
  private vopPlayProgress_: HTMLElement;
  private vopScrubberContainer_: HTMLElement;

  private onMediaTimeupdated_: any;
  private onMediaProgress_: any;
  private onMediaSeeked_: any;
  private onFullScreenChange_: any;

  private supportsTouches_: boolean;
  private startEvent_: string;
  private moveEvent_: string;
  private endEvent_: string;
  private progressInfo_: ProgressInfo;
  constructor(context) {
    super(context);
    // flags reference variable of progress bar
    this.progressBarContext_ = null;
    this.progressBarMoveContext_ = {
      movePos: 0
    };
    this.flagThumbnailMode_ = false;
    this.isSeekStart_ = false;
    this.progressInfo_ = ProgressInfoObj;

    this.supportsTouches_ = ('createTouch' in document);
    this.startEvent_ = this.supportsTouches_ ? 'touchstart' : 'mousedown';
    this.moveEvent_ = this.supportsTouches_ ? 'touchmove' : 'mousemove';
    this.endEvent_ = this.supportsTouches_ ? 'touchend' : 'mouseup';

    this.initListeners();

    // create element
    let properties = {
      'className': 'vop-progress-bar'
    };
    this.element_ = DOM.createEl('div', properties);
    this.onProgressBarMouseDown_ = this.onProgressBarMouseDown.bind(this);
    this.onProgressBarMouseMove_ = this.onProgressBarMouseMove.bind(this);
    this.onProgressBarMouseEnter_ = this.onProgressBarMouseEnter.bind(this);
    this.onProgressBarMouseLeave_ = this.onProgressBarMouseLeave.bind(this);
    this.element_.addEventListener(this.startEvent_, this.onProgressBarMouseDown_);
    this.element_.addEventListener(this.moveEvent_, this.onProgressBarMouseMove_);
    this.element_.addEventListener('mouseenter', this.onProgressBarMouseEnter_);
    this.element_.addEventListener('mouseleave', this.onProgressBarMouseLeave_);

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
    this.onMediaProgress_ = this.onMediaProgress.bind(this);
    this.onMediaSeeked_ = this.onMediaSeeked.bind(this);
    this.onFullScreenChange_ = this.onFullScreenChange.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_TIME_UPDATED, this.onMediaTimeupdated_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PROGRESS, this.onMediaProgress_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_SEEK_COMPLETE, this.onMediaSeeked_);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_FULLSCREEN_CHANGE, this.onFullScreenChange_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_TIME_UPDATED, this.onMediaTimeupdated_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_PROGRESS, this.onMediaProgress_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_SEEK_COMPLETE, this.onMediaSeeked_);
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_FULLSCREEN_CHANGE, this.onFullScreenChange_);
    this.onMediaTimeupdated_ = null;
    this.onMediaProgress_ = null;
    this.onMediaSeeked_ = null;
    this.onFullScreenChange_ = null;
  }

  initListeners() {
    this.newProgressBarMouseMove_ = this.docProgressBarMouseMove.bind(this);
    this.newProgressBarMouseUp_ = this.docProgressBarMouseUp.bind(this);
  }

  initChildren() {
    let uiProgressList = document.createElement('div');

    this.vopLoadProgress_ = document.createElement('div');
    this.vopLoadProgress_.setAttribute('class', 'vop-load-progress');
    this.vopHoverProgress_ = document.createElement('div');
    this.vopHoverProgress_.setAttribute('class', 'vop-hover-progress');
    this.vopPlayProgress_ = document.createElement('div');
    this.vopPlayProgress_.setAttribute('class', 'vop-play-progress');

    uiProgressList.appendChild(this.vopLoadProgress_);
    uiProgressList.appendChild(this.vopHoverProgress_);
    uiProgressList.appendChild(this.vopPlayProgress_);

    this.vopScrubberContainer_ = document.createElement('div');
    this.vopScrubberContainer_.setAttribute('class', 'vop-scrubber-container');

    this.element_.appendChild(uiProgressList);
    this.element_.appendChild(this.vopScrubberContainer_);
  }

  onMediaOpenFinished() {
    this.updateProgressBarUI();
  }

  onMediaTimeupdated(info) {
    // Sometime, the timeupdate will trigger after we mouse down on the progress bar,
    // in this situation, we won't update progress bar ui.

    if (info.live) {
      info.position = info.position - info.range.start;
      if (info.position < 0) info.position = 0;
      info.duration = info.range.end - info.range.start;
    }
    this.updateProgressInfo(info);
    this.updateProgressBarUI();
    // this.updateProgressBarHoverUI();
  }
  
  onMediaProgress(info) {
    this.updateProgressInfo(info);
    this.updateProgressBarUI();
  }
  
  updateProgressInfo(info) {
    if (info.live !== undefined) {
      this.progressInfo_.live = info.live;
    }
    if (info.position !== undefined) {
      this.progressInfo_.position = info.position;
    }
    if (info.duration !== undefined) {
      this.progressInfo_.duration = info.duration;
    }
    if (info.range !== undefined) {
      this.progressInfo_.range = info.range;
    }
    if (info.validBufferLength !== undefined) {
      this.progressInfo_.validBufferLength = info.validBufferLength;
    }
  }

  onMediaSeeked() {
    if (this.isSeekStart_ && this.progressBarContext_) {
      this.isSeekStart_ = false;
      this.progressBarContext_ = null;
    }
  }

  onFullScreenChange() {
    this.updateProgressBarUI();
  }

  onAdStarted(e) {
    //for return directly in fuction "onProgressBarMouseMove", this value do not been updated, it will cause error.
    this.progressBarMoveContext_.movePos = 0;

    this.flagNonLinearAd_ = false;
    if (e.client === 'googleima' && (e.adType === 'nonlinear')) {
      this.flagNonLinearAd_ = true;
    }

    this.onAdTimeUpdate();
  }

  onAdComplete() {
    this.onAdTimeUpdate();
  }

  onAdTimeUpdate() {
    this.updateProgressBarUI();
  }

  onProgressBarMouseDown(e) {
    super.hideMenu();

    e.preventDefault();
    e.stopPropagation();

    if (this.flagAdBreakStart_ && !this.flagNonLinearAd_) {
      return;
    }

    this.captureProgressBarMouseEvents();

    this.progressBarContext_ = {};
    this.progressBarContext_.endedBeforeMousedown = this.player_.isEnded();
    this.progressBarContext_.posBeforeMousedown = this.player_.getPosition();
    this.flagThumbnailMode_ = false;
    this.progressBarContext_.timer = setTimeout(() => {
      this.doEnterThumbnailMode();
    }, 200);

    // update progress bar ui
    this.progressBarContext_.movePos = this.getProgressMovePosition(e);

    this.updateProgressBarUI();
    this.updateProgressBarHoverUI();
  }

  onProgressBarMouseEnter(e) {
    this.eventbus_.emit(Events.PROGRESSBAR_MOUSEENTER);
  }

  onProgressBarMouseMove(e) {
    // let x = this.supportsTouches_ ? e.pageX : e.clientX;
    // let y = this.supportsTouches_ ? e.pageY : e.clientY;
    // console.log('+onProgressBarMouseMove, clientX: ' + x + ', clientY: ' + y);

    if (this.flagAdBreakStart_ && !this.flagNonLinearAd_) {
      return;
    }

    // if mouse down just return
    if (this.progressBarContext_) {
      return;
    }

    // update progress bar ui
    let movePos = this.getProgressMovePosition(e);
    this.progressBarMoveContext_.movePos = movePos;
    this.updateProgressBarHoverUI();

    this.eventbus_.emit(Events.PROGRESSBAR_MOUSEMOVE, {
      movePos: movePos,
      progressInfo: this.progressInfo_
    });
    this.vopScrubberContainer_.style.display = 'block';
  }

  onProgressBarMouseLeave(e) {
    this.eventbus_.emit(Events.PROGRESSBAR_MOUSELEAVE);
    this.vopScrubberContainer_.style.display = 'none';
  }

  captureProgressBarMouseEvents() {
    document.addEventListener(this.moveEvent_, this.newProgressBarMouseMove_, true);
    document.addEventListener(this.endEvent_, this.newProgressBarMouseUp_, true);
    // Don't process mouse move/leave event when mouse is down, since we delegate it to document mouse move/up event.
    this.element_.removeEventListener(this.moveEvent_, this.onProgressBarMouseMove_);
    this.element_.removeEventListener('mouseleave', this.onProgressBarMouseLeave_);
  }

  releaseProgressBarMouseEvents() {
    document.removeEventListener(this.moveEvent_, this.newProgressBarMouseMove_, true);
    document.removeEventListener(this.endEvent_, this.newProgressBarMouseUp_, true);

    this.element_.addEventListener(this.moveEvent_, this.onProgressBarMouseMove_);
    this.element_.addEventListener('mouseleave', this.onProgressBarMouseLeave_);
  }

  docProgressBarMouseMove(e) {
    let movePos = this.getProgressMovePosition(e);
    if (this.progressBarContext_ && this.progressBarContext_.movePos === movePos) {
      return;
    }

    this.doEnterThumbnailMode();
    this.doProcessThumbnailMove();

    if (this.progressBarContext_) {
      this.progressBarContext_.movePos = movePos;
    }

    this.updateProgressBarHoverUI();

    this.eventbus_.emit(Events.PROGRESSBAR_MOUSEMOVE, {
      movePos: movePos,
      progressInfo: this.progressInfo_
    });
    this.vopScrubberContainer_.style.display = 'block';
  }

  docProgressBarMouseUp(e) {
    e.preventDefault();
    this.releaseProgressBarMouseEvents();

    if (this.flagThumbnailMode_) {
      // thumbnail mode click event
      this.doProcessThumbnailUp();
    } else {
      // plain click event
      if (this.progressBarContext_ && this.progressBarContext_.timer) {
        // it's quick click, don't need to pause
        clearTimeout(this.progressBarContext_.timer);
        this.progressBarContext_.timer = null;
      }
    }

    // update ui first
    if (this.progressBarContext_) {
      this.progressBarContext_.movePos = this.getProgressMovePosition(e);
    }
    this.updateProgressBarUI();
    // this.updateProgressBarHoverUI();

    this.eventbus_.emit(Events.PROGRESSBAR_MOUSELEAVE);
    let x = this.supportsTouches_ ? e.pageX : e.clientX;
    let y = this.supportsTouches_ ? e.pageY : e.clientY;
    if (!DOM.isPtInElement(this.element_, {x, y})) {
      this.vopScrubberContainer_.style.display = 'none';
    }

    // player seeking
    if (this.progressBarContext_ && this.progressBarContext_.posBeforeMousedown != this.progressBarContext_.movePos) {
      this.isSeekStart_ = true;
      this.eventbus_.emit(Events.SEEK, {pos: this.progressBarContext_.movePos});
      this.player_.setPosition(this.progressBarContext_.movePos);
    } else {
      this.progressBarContext_ = null;
    }
  }

  doEnterThumbnailMode() {
    if (!this.flagThumbnailMode_) {
      if (this.progressBarContext_)
        this.progressBarContext_.timer = null;
      this.flagThumbnailMode_ = true;
    }
  }

  doProcessThumbnailMove() {
    // for further action, you can add thumbnail popup here.
  }

  doProcessThumbnailUp() {
    // for further action, you can add thumbnail ended event here.
  }

  getProgressMovePosition(e) {
    let rect = this.element_.getBoundingClientRect();

    let x = this.supportsTouches_ ? e.pageX : e.clientX;
    let offsetX = x - rect.left;
    if (offsetX < 0) {
      offsetX = 0;
    } else if (offsetX > rect.width) {
      offsetX = rect.width;
    }

    // update time progress scrubber button
    let info = this.progressInfo_;
    let targetPosition = (offsetX / rect.width) * info.duration;

    if (info.live) {
      targetPosition += info.range.start;
    }
    return targetPosition;
  }

  getProgressBarUIStyle(info) {
    let uiPosition = 0;
    let loadProgressTransform = '';
    let playProgressTransform = '';
    let scrubberContainerTransform = '';

    let uiBufferedPos;
    if (this.progressBarContext_) {
      if (info.live) {
        uiPosition = this.progressBarContext_.movePos - info.range.start;
      } else {
        uiPosition = this.progressBarContext_.movePos;
      }
      uiBufferedPos = uiPosition;
    } else {
      uiPosition = info.position;
      // update time progress bar
      let validBufferLength = info.validBufferLength
      uiBufferedPos = uiPosition + validBufferLength;
    }

    // make a check for position
    uiBufferedPos = (uiBufferedPos <= info.duration) ? uiBufferedPos: info.duration;
    uiPosition = (uiPosition <= info.duration) ? uiPosition : info.duration;

    loadProgressTransform = 'scaleX(' + (info.duration === 0 ? 1 : uiBufferedPos / info.duration) + ')';
    playProgressTransform = 'scaleX(' + (info.duration === 0 ? 1 : uiPosition / info.duration) + ')';

    // update time progress scrubber button
    scrubberContainerTransform = 'translateX(' + ((info.duration === 0 ? 1 : uiPosition / info.duration) * this.element_.clientWidth).toString() + 'px)';

    let ret = {
      loadProgressTransform,
      playProgressTransform,
      scrubberContainerTransform,
      uiPosition
    };

    return ret;
  }

  updateProgressBarUI() {
    // part - input
    let ret = this.getProgressBarUIStyle(this.progressInfo_);

    // part - logic process
    this.vopLoadProgress_.style.transform = ret.loadProgressTransform;
    this.vopPlayProgress_.style.transform = ret.playProgressTransform;

    // update time progress scrubber button
    this.vopScrubberContainer_.style.transform = ret.scrubberContainerTransform;
  }

  updateProgressBarHoverUI() {
    // do not update hover process bar on IE
    // for IE only:playready: no video only audio was outputed after playing for more than 20s
    if (!!(window as any).ActiveXObject || 'ActiveXObject' in window) {
      return;
    }
    let info = this.progressInfo_;
    let movePos = 0;
    if (this.progressBarContext_) {
      movePos = this.progressBarContext_.movePos;
    } else if (this.progressBarMoveContext_) {
      movePos = this.progressBarMoveContext_.movePos;
    }

    if (movePos <= info.position || (info.range && movePos <= (info.range.start + info.position))) {
      this.vopHoverProgress_.style.transform = 'scaleX(0)';
    } else {
      let rect = this.element_.getBoundingClientRect();
      let offsetX = (info.position / info.duration) * rect.width;
      this.vopHoverProgress_.style.left = offsetX + 'px';
      if (info.live) {
        movePos -= info.range.start;
      }
      this.vopHoverProgress_.style.transform = 'scaleX(' + (movePos - info.position) / info.duration + ')';
    }
  }

  onPlayerOpenFinished() {
    // reset variables
    this.flagAdBreakStart_ = false;
    this.progressBarContext_ = null;
    // reset ui
    this.vopLoadProgress_.style.transform = 'scaleX(0)';
    this.vopPlayProgress_.style.transform = 'scaleX(0)';
    this.vopScrubberContainer_.style.transform = 'translateX(0px)';
    this.vopHoverProgress_.style.transform = 'scaleX(0)';
    this.vopHoverProgress_.style.left = '0px';
  }
}

export default UIProgressBar;
