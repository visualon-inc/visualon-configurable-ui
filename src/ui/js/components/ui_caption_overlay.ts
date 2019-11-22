import UIContainer from './ui_container';
import DOM from '../dom';

import {
  difference,
  filter
} from '../../../externals/underscore';

class UICaptionOverlay extends UIContainer {
  private textTrack_: any;
  private currentCues_: any;

  constructor(context) {
    super(context, false);

    let properties = {
      'className': 'vop-caption-overlay'
    };
    this.element_ = DOM.createEl('div', properties);
    this.element_.style.color = 'red';
    this.element_.style.backgroundColor = 'transparent';
  }

  destroy() {
    super.destroy();
  }

  onMediaTimeupdated(e) {
    let pos = this.player_.getPosition();

    let cues = [];
    let textTrack = this.player_.getCurrentSubtitleTrack();
    if (textTrack && textTrack.data) {
      cues = this.getCurrentCues(textTrack.data, pos);
    }

    this.updateCurrentCues(cues);
    this.renderCues();
  }

  onTextTrackChanged(e) {
    this.textTrack_ = this.player_.getCurrentSubtitleTrack();
  }

  // Tools
  getCurrentCues(allCues, pos) {
    return filter(allCues, function(cue) {
      return pos >= (cue.start) && (!cue.end || pos <= cue.end);
    });
  }

  updateCurrentCues(cues) {
    // Render with vtt.js if there are cues, clear if there are none.
    if (!cues.length) {
      this.currentCues_ = [];
    } else if (difference(cues, this.currentCues_).length) {
      this.currentCues_ = cues;
    }
  }

  renderCues() {
    if (this.currentCues_.length > 0) {
      const cue = this.currentCues_[0];
      this.element_.innerText = cue.data;
    } else {
      this.element_.innerText = '';
    }
  }
}

export default UICaptionOverlay;