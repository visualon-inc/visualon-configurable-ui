import UIContainer from './ui_container';
import Events from '../events';
import DOM from '../dom';
import UITools from '../ui_tools';

class UIToolTip extends UIContainer {
  private onProgressBarMouseMove_: any;
  private onProgressBarMouseLeave_: any;
  private vopTooltipBg_: HTMLElement;
  private vopTooltipTextWrapper_: HTMLElement;
  private vopTooltipText_: HTMLElement;
  private vopProgressBar_: HTMLElement;
  constructor(context) {
    super(context, false);
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-tooltip');

    this.initChildren();
    this.addEventBusListeners();
  }

  destroy() {
    super.destroy();
    this.removeEventBusListeners();
  }

  addEventBusListeners() {
    this.onProgressBarMouseMove_ = this.onProgressBarMouseMove.bind(this);
    this.onProgressBarMouseLeave_ = this.onProgressBarMouseLeave.bind(this);
    this.eventbus_.on(Events.PROGRESSBAR_MOUSEMOVE, this.onProgressBarMouseMove_);
    this.eventbus_.on(Events.PROGRESSBAR_MOUSELEAVE, this.onProgressBarMouseLeave_);
  }
  
  removeEventBusListeners() {
    this.eventbus_.off(Events.PROGRESSBAR_MOUSEMOVE, this.onProgressBarMouseMove_);
    this.eventbus_.off(Events.PROGRESSBAR_MOUSELEAVE, this.onProgressBarMouseLeave_);
    this.onProgressBarMouseMove_ = null;
    this.onProgressBarMouseLeave_ = null;
  }

  initChildren() {
    this.vopTooltipBg_ = document.createElement('div');
    this.vopTooltipBg_.setAttribute('class', 'vop-tooltip-bg');

    this.vopTooltipTextWrapper_ = document.createElement('div');
    this.vopTooltipTextWrapper_.setAttribute('class', 'vop-tooltip-text-wrapper');

    this.vopTooltipText_ = document.createElement('span');
    this.vopTooltipText_.setAttribute('class', 'vop-tooltip-text');

    this.vopTooltipTextWrapper_.appendChild(this.vopTooltipText_);
    this.element_.appendChild(this.vopTooltipBg_);
    this.element_.appendChild(this.vopTooltipTextWrapper_);
  }

  getTooltipOffsetX(progressInfo, currMovePos, tooltipWidth) {
    // part - input
    // bounding client rect can return the progress bar's rect relative to current page.
    let rect = this.vopProgressBar_.getBoundingClientRect();
    let leftMin = 12 + this.vopProgressBar_.offsetLeft;
    let rightMax = leftMin + rect.width;

    let currPosWidth = (currMovePos / progressInfo.duration) * rect.width;
    let tooltipLeft_RelativeToVideo = leftMin + currPosWidth - tooltipWidth / 2;
    let tooltipRight_RelativeToVideo = leftMin + currPosWidth + tooltipWidth / 2;

    if (tooltipLeft_RelativeToVideo < leftMin) {
      tooltipLeft_RelativeToVideo = leftMin;
    } else if (tooltipRight_RelativeToVideo > rightMax) {
      tooltipLeft_RelativeToVideo = rightMax - tooltipWidth;
    }

    //console.log('tooltipLeft_RelativeToVideo: ' + tooltipLeft_RelativeToVideo);

    return tooltipLeft_RelativeToVideo;
  }

  updateTooltipUI(show, currMovePos, progressInfo) {
    if (!show) {
      this.element_.style.display = 'none';
      return;
    }

    if (!this.vopProgressBar_) {
      this.vopProgressBar_ = this.context_.vopSkinContainer.querySelector('.vop-progress-bar');
    }

    // update tooltip offset
    let strTime = '';
    if (progressInfo.live) {
      currMovePos -= progressInfo.range.start;
      strTime = UITools.TimeToString(progressInfo.duration - currMovePos);
      if (strTime !== '00:00' && strTime !== '00:00:00') {
        strTime = '-' + strTime;
      }
    } else {
      strTime = UITools.TimeToString(currMovePos);
    }
    this.vopTooltipText_.innerText = strTime;

    // Don't show thumbnail if it's a live stream.
    if (!progressInfo.live) {
      let thumbnailInfo = this.player_.findNearestThumbnail(currMovePos);

      if (thumbnailInfo) {
        DOM.addClass(this.element_, 'vop-tooltip-preview');
        //console.log('thumbnailInfo info: ', thumbnailInfo);
        let isSprite = (thumbnailInfo.w && thumbnailInfo.h);
        if (isSprite) {
          this.vopTooltipBg_.style.width = thumbnailInfo.w.toString() + 'px';
          this.vopTooltipBg_.style.height = thumbnailInfo.h.toString() + 'px';
          this.vopTooltipBg_.style.background = 'url(' + thumbnailInfo.url + ')' +
            ' -' + thumbnailInfo.x.toString() + 'px' +
            ' -' + thumbnailInfo.y.toString() + 'px';
        } else {
          this.vopTooltipBg_.style.width = '158px';
          this.vopTooltipBg_.style.height = '90px';
          this.vopTooltipBg_.style.background = 'url(' + thumbnailInfo.url + ') no-repeat';
          this.vopTooltipBg_.style.backgroundSize = '100% 100%';
        }
      } else {
        DOM.removeClass(this.element_, 'vop-tooltip-preview');
      }
    }

    // calculate metrics first
    // A very large offset to hide tooltip.
    this.element_.style.left = '10000px';
    this.element_.style.display = 'block';

    // set the correct offset of tooltip.
    let offsetX = this.getTooltipOffsetX(progressInfo, currMovePos, this.element_.clientWidth);
    this.element_.style.left = offsetX.toString() + 'px';
  }

  onProgressBarMouseMove(e) {
    this.updateTooltipUI(true, e.movePos, e.progressInfo);
  }

  onProgressBarMouseLeave() {
    this.updateTooltipUI(false, null, null);
  }
}

export default UIToolTip;