import UIComponent from './ui_component';
import Events from '../events';
import ID from '../id';
import DOM from '../dom';

class UISettingsMenu extends UIComponent {
  private onMenuItemClick_: any;
  private styleDisplay_: string;
  private vopPanelMenu_: HTMLElement;
  private onPlayerProgramChanged_: any;
  private onPopupMenuChange_: any;
  constructor(context) {
    super(context, false);

    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);

    this.styleDisplay_ = 'none';

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-settings-menu');
    this.element_.style.display = this.styleDisplay_;

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
    let item = e.currentTarget;
    let menu;
    switch (item.dataset.id) {
      case ID.MENUITEM_QUALITY:
        menu = 'quality_menu';
        break;
      case ID.MENUITEM_AUDIO_TRACK:
        menu = 'audio_track_menu';
        break;
      case ID.MENUITEM_FCC:
        menu = 'fcc_menu';
        break;
      case ID.MENUITEM_XSPEED:
        menu = 'xspeed_menu';
      default:
        break;
    }

    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: menu
    });
  }

  onPopupMenuChange(e) {
    if (e.menu === 'settings_menu') {
      this.styleDisplay_ = 'block';
    } else {
      this.styleDisplay_ = 'none';
    }

    this.element_.style.display = this.styleDisplay_;
  }

  onPlayerOpenFinished() {
    // clear previous ui components
    DOM.removeAllChild(this.vopPanelMenu_);
    
    // create new ui components
    let settingsListData = [];

    let qualityLevels = this.player_.getQualityLevels();
    if (qualityLevels.length > 1) {
      settingsListData.push({
        id: ID.MENUITEM_QUALITY,
        text: 'Quality'
      });
    }
    let audioTracks = this.player_.getAudioTracks();
    if (audioTracks.length > 1) {
      settingsListData.push({
        id: ID.MENUITEM_AUDIO_TRACK,
        text: 'Language'
      });
    }
    let subtitleTracks = this.player_.getSubtitleTracks();
    if (subtitleTracks.length > 0) {
      settingsListData.push({
        id: ID.MENUITEM_FCC,
        text: 'FCC'
      });
    }
    settingsListData.push({
      id: ID.MENUITEM_XSPEED,
      text: 'Speed'
    });

    for (let i = 0; i < settingsListData.length; i ++) {
      let item = settingsListData[i];

      let vopMenuitem = document.createElement('div');
      vopMenuitem.setAttribute('class', 'vop-menuitem');
      vopMenuitem.setAttribute('key', i.toString());
      vopMenuitem.setAttribute('role', 'menuitem');
      vopMenuitem.setAttribute('aria-haspopup', 'true');
      vopMenuitem.setAttribute('data-id', item.id);
      vopMenuitem.addEventListener('click', this.onMenuItemClick_);
      vopMenuitem.setAttribute('tabIndex', '0');

      let vopMenuitemLabel = document.createElement('div');
      vopMenuitemLabel.setAttribute('class', 'vop-menuitem-label');
      vopMenuitemLabel.innerText = item.text;

      let vopMenuitemContent = document.createElement('div');
      vopMenuitemContent.setAttribute('class', 'vop-menuitem-content');

      let vopMenuitemContentText = document.createElement('span');
      vopMenuitemContentText.setAttribute('class', 'vop-menuitem-content-text');
      vopMenuitemContentText.innerText = '';

      vopMenuitemContent.appendChild(vopMenuitemContentText);
      vopMenuitem.appendChild(vopMenuitemLabel);
      vopMenuitem.appendChild(vopMenuitemContent);

      this.vopPanelMenu_.appendChild(vopMenuitem);
    }
  }

  onPlayerProgramChanged() {
    this.onPlayerOpenFinished_();
  }
}

export default UISettingsMenu;