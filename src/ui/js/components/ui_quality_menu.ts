import UIComponent from './ui_component';
import Events from '../events';
import DOM from '../dom';

const AUTO_LEVEL_ID = 'Auto';

class UIQualityMenu extends UIComponent {
  private onMenuBackClick_: any;
  private onMenuItemClick_: any;
  private vopPanelMenu_: HTMLElement;
  private onPopupMenuChange_: any;
  private onPlayerProgramChanged_: Function;
  constructor(context) {
    super(context, false);

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-quality-menu')
    this.element_.style.display = 'none';

    let vopPanelHeader = document.createElement('div');
    vopPanelHeader.setAttribute('class', 'vop-panel-header');
    let vopPanelTitle = document.createElement('button');
    vopPanelTitle.setAttribute('class', 'vop-panel-title');
    vopPanelTitle.addEventListener('click', this.onMenuBackClick_);
    vopPanelTitle.innerText = 'Quality';

    this.vopPanelMenu_ = document.createElement('div');
    this.vopPanelMenu_.setAttribute('class', 'vop-panel-menu');

    vopPanelHeader.appendChild(vopPanelTitle);
    this.element_.appendChild(vopPanelHeader);
    this.element_.appendChild(this.vopPanelMenu_);

    this.addEventBusListeners();
  }

  destroy() {
    super.destroy();
    this.removeEventBusListeners();
  }
  
  addEventBusListeners() {
    this.onPopupMenuChange_ = this.onPopupMenuChange.bind(this);
    this.eventbus_.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
    this.onPlayerProgramChanged_ = this.onPlayerProgramChanged.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_PROGRAM_CHANGED, this.onPlayerProgramChanged_);
  }
  
  removeEventBusListeners() {
    this.eventbus_.off(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
    this.onPopupMenuChange_ = null;
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_PROGRAM_CHANGED, this.onPlayerProgramChanged_);
    this.onPlayerProgramChanged_ = null;
  }

  onMenuBackClick(e) {
    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: 'settings_menu'
    });
  }

  onMenuItemClick(e) {
    let trackId = e.currentTarget.dataset.id;
    // apply changes to player instance
    if (trackId === AUTO_LEVEL_ID) {
      this.player_.selectQualityLevel('');
    } else {
      this.player_.selectQualityLevel(trackId);
    }

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
    if (e.menu === 'quality_menu') {
      this.element_.style.display = 'block';
    } else {
      this.element_.style.display = 'none';
    }
  }

  onPlayerProgramChanged() {
    this.onPlayerOpenFinished();
  }

  onPlayerOpenFinished() {
    // clear previous ui components
    DOM.removeAllChild(this.vopPanelMenu_);

    let qualityLevels = this.player_.getQualityLevels();
    if (qualityLevels.length < 1) {
      return;
    }

    let currQualityLevelId = AUTO_LEVEL_ID;
    for (let i = 0; i < qualityLevels.length; i ++) {
      if (qualityLevels[i].selInfo&(window as any).voPlayer.Enumerations.VO_TRACK_SELECTINFO.TRACK_SELECTED) {
        currQualityLevelId = qualityLevels[i].id;
        break;
      }
    }

    let autoLevel = {
      id: AUTO_LEVEL_ID
    };
    this.addQualityLevelMenuItem(autoLevel, currQualityLevelId, AUTO_LEVEL_ID);

    for (let i = 0; i < qualityLevels.length; i ++) {
      let key = i.toString();
      let level = qualityLevels[i];
      this.addQualityLevelMenuItem(level, currQualityLevelId, key);
    }
  }

  addQualityLevelMenuItem(level, currQualityLevelId, key) {
    function getQualityLevelText(level) {
      let text = '';
      if (level.id === AUTO_LEVEL_ID) {
        text = AUTO_LEVEL_ID;
      } else {
        if (level.width !== undefined && level.height != undefined) {
          text = level.width + 'x' + level.height + ', ';
        }
        text += Math.round(level.bandwidth / 1000) + ' kbps';
      }

      return text;
    }

    let vopMenuitem = document.createElement('div');
    vopMenuitem.setAttribute('key', key);
    vopMenuitem.setAttribute('class', 'vop-menuitem');
    vopMenuitem.setAttribute('role', 'menuitemradio');
    vopMenuitem.setAttribute('aria-checked', ((currQualityLevelId === level.id) ? 'true' : 'false'));
    vopMenuitem.setAttribute('data-id', level.id);
    vopMenuitem.addEventListener('click', this.onMenuItemClick_);
    vopMenuitem.setAttribute('tabIndex', '0');
    if ((level.id !== AUTO_LEVEL_ID) && (level.selInfo&(window as any).voPlayer.Enumerations.VO_TRACK_SELECTINFO.TRACK_DISABLED)) {
      vopMenuitem.style.pointerEvents = "none";
      vopMenuitem.style.color = "gray";
    }

    let vopMenuitemLabel = document.createElement('vop-menuitem-label');
    vopMenuitemLabel.setAttribute('class', 'vop-menuitem-label');

    let span = document.createElement('span');
    span.innerText = getQualityLevelText(level);

    vopMenuitemLabel.appendChild(span);
    vopMenuitem.appendChild(vopMenuitemLabel);

    this.vopPanelMenu_.appendChild(vopMenuitem);
  }
}

export default UIQualityMenu;