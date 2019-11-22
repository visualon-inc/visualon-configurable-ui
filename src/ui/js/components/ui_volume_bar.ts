import UIComponent from './ui_component';
import UITools from '../ui_tools';

class UIVolumeBar extends UIComponent {
  private colorListVolume_: any;
  private vopVolumeSliderWidth_: number;
  private vopVolumeSliderHandleWidth_: number;
  private vopVolumeSlider_: HTMLElement;
  private vopVolumeSliderHandle_: HTMLElement;

  private newVolumeSliderMousemove_: any;
  private newVolumeSliderMouseup_: any;

  private onMediaVolumeChanged_: any;

  constructor(context) {
    super(context, false);
    this.colorListVolume_ = ['#ccc', 'rgba(192,192,192,0.3)'];
    this.vopVolumeSliderWidth_ = 52;
    this.vopVolumeSliderHandleWidth_ = 10;

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-volume-panel');
    this.element_.style.display = 'inline-block';

    this.initChildren();
    this.addPlayerListeners();
    this.updateVolumeUI();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onMediaVolumeChanged_ = this.onMediaVolumeChanged.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_VOLUME_CHANGED, this.onMediaVolumeChanged_);
    this.player_.addEventListener((window as any).voPlayer.events.AD_VOLUME_CHANGED, this.onMediaVolumeChanged_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    if (this.player_) {
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_CB_PLAY_VOLUME_CHANGED, this.onMediaVolumeChanged_);
      this.player_.removeEventListener((window as any).voPlayer.events.AD_VOLUME_CHANGED, this.onMediaVolumeChanged_);
      this.onMediaVolumeChanged_ = null;
    }
  }

  initChildren() {
    this.vopVolumeSlider_ = document.createElement('div');
    this.vopVolumeSlider_.setAttribute('class', 'vop-volume-slider');
    this.vopVolumeSlider_.addEventListener('mousedown', this.onVolumeSliderMouseDown.bind(this));

    this.vopVolumeSliderHandle_ = document.createElement('div');
    this.vopVolumeSliderHandle_.setAttribute('class', 'vop-volume-slider-handle');

    this.vopVolumeSlider_.appendChild(this.vopVolumeSliderHandle_);
    this.element_.appendChild(this.vopVolumeSlider_);
  }

  getVolumeInfo() {
    let muted = this.player_.isMuted();
    let volume = this.player_.getVolume();

    // Process
    let uiVolumeList;
    let uiVolumeHandleLeft;

    if (volume === 0 || muted) {
      uiVolumeList = [0, 1];
      uiVolumeHandleLeft = '0px';
    } else {
      uiVolumeList = [volume, 1];

      let vLeft = (volume / 1) * this.vopVolumeSliderWidth_;
      if (vLeft + this.vopVolumeSliderHandleWidth_ > this.vopVolumeSliderWidth_) {
        vLeft = this.vopVolumeSliderWidth_ - this.vopVolumeSliderHandleWidth_;
      }

      uiVolumeHandleLeft = vLeft.toString() + 'px';
    }

    return {
      uiVolumeList: uiVolumeList,
      uiVolumeHandleLeft: uiVolumeHandleLeft
    };
  }

  onMediaVolumeChanged() {
    this.updateVolumeUI();
  }

  onPlayerOpenFinished() {
    this.updateVolumeUI();
  }

  updateVolumeUI() {
    let info = this.getVolumeInfo();

    // update volume slider background
    this.vopVolumeSlider_.style.background = UITools.genGradientColor(info.uiVolumeList, this.colorListVolume_);
    // update volume slider handle
    this.vopVolumeSliderHandle_.style.left = info.uiVolumeHandleLeft;
  }

  onVolumeSliderMouseDown(e) {
    this.captureVolumeSliderMouseEvents();
    e.preventDefault();
    e.stopPropagation();

    this.docVolumeSliderMousemove(e);
  }

  docVolumeSliderMousemove(e) {
    let valueVolumeMovePosition = this.getVolumeMovePosition(e);

    let muted = this.player_.isMuted();
    let volume = valueVolumeMovePosition;
    if (volume === 0) {
      // do nothing
    } else {
      if (muted === true) {
        this.player_.unmute();
      }

      muted = false;
    }

    this.player_.setVolume(valueVolumeMovePosition);
  }

  docVolumeSliderMouseup(e) {
    this.releaseVolumeSliderMouseEvents();
    e.preventDefault();
  }

  captureVolumeSliderMouseEvents() {
    this.newVolumeSliderMousemove_ = this.docVolumeSliderMousemove.bind(this);
    this.newVolumeSliderMouseup_ = this.docVolumeSliderMouseup.bind(this);

    document.addEventListener('mousemove', this.newVolumeSliderMousemove_, true);
    document.addEventListener('mouseup', this.newVolumeSliderMouseup_, true);
  }

  releaseVolumeSliderMouseEvents() {
    document.removeEventListener('mousemove', this.newVolumeSliderMousemove_, true);
    document.removeEventListener('mouseup', this.newVolumeSliderMouseup_, true);
  }

  getVolumeMovePosition(e) {
    // part - input
    let rect = this.vopVolumeSlider_.getBoundingClientRect();

    // part - logic process
    let offsetX = e.clientX - rect.left;
    if (offsetX < 0) {
      offsetX = 0;
    } else if (offsetX + this.vopVolumeSliderHandleWidth_ > rect.width) {
      offsetX = rect.width;
    }

    // update time progress scrubber button
    let valueVolumeMovePosition = (offsetX / rect.width) * 1.0;
    return valueVolumeMovePosition;
  }
}

export default UIVolumeBar;