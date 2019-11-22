import UIComponent from './ui_component';
import Events from '../events';
import ID from '../id';
import DOM from '../dom';

class UIAudioTrackMenu extends UIComponent {
  private onMenuBackClick_: any;
  private onMenuItemClick_: any;
  private vopPanelMenu_: HTMLElement;
  private onPopupMenuChange_: any;
  constructor(context) {
    super(context, false);

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-audio-track-menu');
    this.element_.style.display = 'none';

    let vopPanelHeader = document.createElement('div');
    vopPanelHeader.setAttribute('class', 'vop-panel-header');

    let vopPanelTitle = document.createElement('button');
    vopPanelTitle.setAttribute('class', 'vop-panel-title');
    vopPanelTitle.addEventListener('click', this.onMenuBackClick_);
    vopPanelTitle.innerText = 'AudioTrack';

    this.vopPanelMenu_ = document.createElement('div');
    this.vopPanelMenu_.setAttribute('class', 'vop-panel-menu');

    vopPanelHeader.appendChild(vopPanelTitle);
    this.element_.appendChild(vopPanelHeader);
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
    super.addPlayerListeners();
    this.onPopupMenuChange_ = this.onPopupMenuChange.bind(this);
    this.eventbus_.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
  }

  removeEventBusListeners() {
    super.removePlayerListeners();
    this.eventbus_.off(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
    this.onPopupMenuChange_ = null;
  }

  addPlayerListeners() {
  }

  removePlayerListeners() {
  }

  onMenuBackClick(e) {
    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: 'settings_menu'
    });
  }

  onMenuItemClick(e) {
    let trackId = e.currentTarget.dataset.id;
    // apply changes to player instance
    this.player_.selectAudioTrack(trackId);

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

  onPopupMenuChange(e) {
    if (e.menu === 'audio_track_menu') {
      this.element_.style.display = 'block';
    } else {
      this.element_.style.display = 'none';
    }
  }

  onPlayerOpenFinished() {
    // clear previous ui components
    DOM.removeAllChild(this.vopPanelMenu_);
    
    // init audio assets
    let audioTracks = this.player_.getAudioTracks();
    if (audioTracks.length < 1) {
      return;
    }
    let currAudioTrack = this.player_.getCurrentAudioTrack();
    let currAudioTrackId = currAudioTrack.id;

    for (let i = 0; i < audioTracks.length; i ++) {
      let audioTrack = audioTracks[i];

      let vopMenuitem = document.createElement('div');
      vopMenuitem.setAttribute('key', i.toString());
      vopMenuitem.setAttribute('class', 'vop-menuitem');
      vopMenuitem.setAttribute('role', 'menuitemradio');
      vopMenuitem.setAttribute('aria-checked', currAudioTrackId === audioTrack.id ? 'true' : 'false');
      vopMenuitem.setAttribute('data-id', audioTrack.id);
      vopMenuitem.addEventListener('click', this.onMenuItemClick_);
      vopMenuitem.setAttribute('tabIndex', '0');

      let vopMenuitemLabel = document.createElement('div');
      vopMenuitemLabel.setAttribute('class', 'vop-menuitem-label');

      let span = document.createElement('span');
      span.innerText = audioTrack.lang;

      vopMenuitemLabel.appendChild(span);
      vopMenuitem.appendChild(vopMenuitemLabel);

      this.vopPanelMenu_.appendChild(vopMenuitem);
    }
  }
}

export default UIAudioTrackMenu;