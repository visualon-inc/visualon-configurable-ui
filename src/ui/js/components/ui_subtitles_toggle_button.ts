import UIButton from './ui_button';
import Events from '../events';
import ID from '../id';

class UISubtitlesToggleButton extends UIButton {
  private onPlayerProgramChanged_: any;
  constructor(context) {
    super(context);
    this.element_ = document.createElement('button');
    this.element_.setAttribute('class', 'vop-button vop-subtitles-button');
    this.element_.style.display = 'none';
    this.element_.title = 'Subtitles';
    this.element_.setAttribute('data-id', ID.SUBTITLES_BUTTON);
    this.element_.addEventListener('click', (e) => {
      this.onHandleClick(e);
    }, true);

    this.addPlayerListeners();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onPlayerProgramChanged_ = this.onPlayerProgramChanged.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_PROGRAM_CHANGED, this.onPlayerProgramChanged_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    if (this.player_) {
      this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_PROGRAM_CHANGED, this.onPlayerProgramChanged_);
      this.onPlayerProgramChanged_ = null;
    }
  }

  onHandleClick(e) {
    this.eventbus_.emit(Events.SUBTITLE_BUTTON_CLICK);
  }

  updateBtnState() {
    let tracks = this.player_.getSubtitleTracks();
    if (tracks && tracks.length > 0) {
      this.show();
    } else {
      this.hide();
    }
  }

  onAdComplete() {
    this.updateBtnState();
  }

  onPlayerOpenFinished() {
    this.updateBtnState();
  }

  onPlayerProgramChanged() {
    if(this.element_.style.display === 'none')
      this.onPlayerOpenFinished_();
  }
}

export default UISubtitlesToggleButton;