import UIContainer from './ui_container';
import Events from '../events';
import DOM from '../dom';
import UITools from '../ui_tools';
const  maxPercentageThumbnail = 0.15,
       maxScale = 2;

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

  updateTooltipUI(show, currMovePos, progressInfo) {
    if (!show) {
      this.element_.style.display = 'none';
      return;
    }

    if (!this.vopProgressBar_) {
      this.vopProgressBar_ = this.context_.vopSkinContainer.querySelector('.vop-progress-bar');
    }

    let vopPlayerContainer = this.context_.playerContainer;
    let vopTooltipText = this.vopTooltipText_;
    let vopTooltipContainer = this.element_;
    let vopTooltipBg = this.vopTooltipBg_;
    let vopProgressBar = this.vopProgressBar_;
    let skinContainer = this.context_.vopSkinContainer;

    this.player_.findNearestThumbnail(currMovePos, function (thumbnailInfo) {
        if (skinContainer.className.indexOf('vop-autohide') !== -1) {
          vopTooltipContainer.style.display = 'none';
          return;
        }
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
        vopTooltipText.innerText = strTime;

        let thumbnailWidth = 0;
        let playContainerRect = vopPlayerContainer.getBoundingClientRect();

        if (thumbnailInfo) {
          DOM.addClass(vopTooltipContainer, 'vop-tooltip-preview');
          let isSprite = (thumbnailInfo.width && thumbnailInfo.height);
          let maxHeight = playContainerRect.height * maxPercentageThumbnail;
          let maxWidth = playContainerRect.width * maxPercentageThumbnail
          if (isSprite) {
            let scale = maxHeight/thumbnailInfo.height;
            if (scale > maxScale) {
                scale = maxScale;
            }
            vopTooltipBg.style.width = thumbnailInfo.width.toString() + 'px';
            vopTooltipBg.style.height = thumbnailInfo.height.toString() + 'px';
            vopTooltipBg.style.background = 'url(' + thumbnailInfo.url + ')' +
              ' -' + thumbnailInfo.x.toString() + 'px' +
              ' -' + thumbnailInfo.y.toString() + 'px';
            vopTooltipBg.style.transform = 'scale(' + scale + ',' + scale + ')';
            thumbnailWidth = thumbnailInfo.width * scale;
          } else {
            vopTooltipBg.style.width = maxWidth + 'px';
            vopTooltipBg.style.height = maxHeight + 'px';
            vopTooltipBg.style.background = 'url(' + thumbnailInfo.url + ') no-repeat';
            vopTooltipBg.style.backgroundSize = '100% 100%';
            thumbnailWidth = maxWidth;
          }
        } else {
          DOM.removeClass(vopTooltipContainer, 'vop-tooltip-preview');
        }

        // calculate metrics first
        // A very large offset to hide tooltip.
        vopTooltipContainer.style.left = '10000px';
        vopTooltipContainer.style.display = 'block';

        // set the correct offset of tooltip.
        let tooltipWidth = vopTooltipContainer.clientWidth;
        let rect = vopProgressBar.getBoundingClientRect();
        let left = rect.left - playContainerRect.left;
        let currPosWidth = (currMovePos / progressInfo.duration) * rect.width;
        let offsetX = left + currPosWidth - tooltipWidth / 2;

        let leftMin = left + thumbnailWidth / 2 - tooltipWidth / 2;
        let leftMax = left + rect.width - thumbnailWidth / 2 - tooltipWidth / 2;
        if (offsetX < leftMin) {
          offsetX = leftMin;
        } else if (offsetX > leftMax) {
          offsetX = leftMax;
        }
        vopTooltipContainer.style.left = offsetX.toString() + 'px';
      });
  }

  onProgressBarMouseMove(e) {
    this.updateTooltipUI(true, e.movePos, e.progressInfo);
  }

  onProgressBarMouseLeave() {
    this.updateTooltipUI(false, null, null);
  }
}

export default UIToolTip;