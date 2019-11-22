import UIComponent from './ui_component';
import Events from '../events';
import DOM from '../dom';

class UISubtitlesMenu extends UIComponent {
  private onMenuItemClick_: any;

  private onPlayerProgramChanged_: Function;

  private vopPanelMenu_: HTMLElement;
  private onPopupMenuChange_: any;
  constructor(context) {
    super(context, false);

    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-subtitles-menu');
    this.element_.style.display = 'none';

    this.vopPanelMenu_ = document.createElement('div');
    this.vopPanelMenu_.setAttribute('class', 'vop-panel-menu');
    this.element_.appendChild(this.vopPanelMenu_);

    this.addPlayerListeners();
    this.addEventBusListeners();
  }

  destroy() {
    super.destroy();
    this.removePlayerListeners();
    this.removeEventBusListeners();
  }

  addEventBusListeners() {
    this.onPopupMenuChange_ = this.onPopupMenuChange.bind(this);
    this.eventbus_.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
  }
  
  removeEventBusListeners() {
    this.eventbus_.off(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
    this.onPopupMenuChange_ = null;
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onPlayerProgramChanged_ = this.onPlayerProgramChanged.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_PROGRAM_CHANGED, this.onPlayerProgramChanged_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_PROGRAM_CHANGED, this.onPlayerProgramChanged_);
    this.onPlayerProgramChanged_ = null;
  }

  onMenuItemClick(e) {
    e.stopPropagation();

    let trackId = e.currentTarget.dataset.id;

    let currSubTrack = this.player_.getCurrentSubtitleTrack();
    if (currSubTrack.id === trackId) {
      this.player_.selectSubtitleTrack('');

      e.currentTarget.setAttribute('aria-checked', 'false');
    } else {
      // apply changes to player instance
      this.player_.selectSubtitleTrack(trackId);

      // update ui
      let arrMenuitem = this.vopPanelMenu_.children;
      for (let i = 0; i < arrMenuitem.length; i ++) {
        let vopMenuitem = arrMenuitem[i];
        let id = vopMenuitem.getAttribute('data-id');
        if (trackId === id) {
          vopMenuitem.setAttribute('aria-checked', 'true');
        } else {
          vopMenuitem.setAttribute('aria-checked', 'false');
        }
      }
    }
  }

  onPopupMenuChange(e) {
    if (e.menu === 'subtitles_menu') {
      this.element_.style.display = 'block';
    } else {
      this.element_.style.display = 'none';
    }
  }

  createTextTrackUI(track, currTrackId) {
    let vopMenuitem = document.createElement('div');
    vopMenuitem.setAttribute('class', 'vop-menuitem');
    vopMenuitem.setAttribute('key', track.id);
    vopMenuitem.setAttribute('role', 'menuitem');
    vopMenuitem.setAttribute('aria-checked', 'false');
    vopMenuitem.setAttribute('data-id', track.id);
    vopMenuitem.setAttribute('tabIndex', '0');
    vopMenuitem.addEventListener('click', this.onMenuItemClick_);

    let vopMenuitemLabel = document.createElement('div');
    vopMenuitemLabel.setAttribute('class', 'vop-menuitem-label');
    vopMenuitemLabel.innerText = track.label ? track.label : track.lang;
    //console.log(`createTextTrackUI, id: ${track.id}, label: ${track.label}, lang: ${track.lang}`);
    if (!vopMenuitemLabel.innerText) {
      vopMenuitemLabel.innerText = track.id;
    }

    let vopMenuitemContent = document.createElement('div');
    vopMenuitemContent.setAttribute('class', 'vop-menuitem-content');

    let vopMenuitemToggleCheckbox = document.createElement('div');
    vopMenuitemToggleCheckbox.setAttribute('class', 'vop-menuitem-toggle-checkbox');

    vopMenuitemContent.appendChild(vopMenuitemToggleCheckbox);

    if (track.id === currTrackId) {
      vopMenuitem.setAttribute('aria-checked', 'true');
    } else {
      vopMenuitem.setAttribute('aria-checked', 'false');
    }

    vopMenuitem.appendChild(vopMenuitemLabel);
    vopMenuitem.appendChild(vopMenuitemContent);

    return vopMenuitem;
  }

  onPlayerOpenFinished() {
    this.onPlayerProgramChanged();
  }

  onPlayerProgramChanged() {
    // clear previous ui components
    DOM.removeAllChild(this.vopPanelMenu_);

    // init subtitle assets
    let subTracks = this.player_.getSubtitleTracks();
    if (subTracks.length < 0) {
      return;
    }
    let currSubTrack = this.player_.getCurrentSubtitleTrack();
    let currSubTrackId = currSubTrack.id ? currSubTrack.id : '-1';
    for (let i = 0; i < subTracks.length; i ++) {
      let track = subTracks[i];
      let vopMenuitem = this.createTextTrackUI(track, currSubTrackId);

      this.vopPanelMenu_.appendChild(vopMenuitem);
    }
  }
}

export default UISubtitlesMenu;