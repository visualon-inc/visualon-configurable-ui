import UIComponent from './ui_component';
import Events from '../events';
import DOM from '../dom';

class UIVideoEnhancementMenu extends UIComponent {
  private onMenuItemClick_: any;

  private enhanceLevelData_: any;
  private onLevelChanged_: Function;

  private vopPanelMenu_: HTMLElement;
  private onPopupMenuChange_: any;
  constructor(context) {
    super(context, false);

    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-video-enhance-menu');
    this.element_.style.display = 'none';

    this.vopPanelMenu_ = document.createElement('div');
    this.vopPanelMenu_.setAttribute('class', 'vop-panel-menu');
    this.element_.appendChild(this.vopPanelMenu_);

    this.enhanceLevelData_ = {
      currLevelValue: 0,
      LevelList: [{
        value: 0
      }, {
        value: 0.25
      }, {
        value: 0.5
      }, {
        value: 0.75
      }, {
        value: 1.0
      }]
    };
    this.initUI();

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
    this.onLevelChanged_ = this.onEnhanceLevelChanged.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_LOW_BACKLIGHT_ENHANCE_LEVEL_CHANGED, this.onLevelChanged_);
  }

  removePlayerListeners() {
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_LOW_BACKLIGHT_ENHANCE_LEVEL_CHANGED, this.onLevelChanged_);
    this.onLevelChanged_ = null;
  }

  onMenuItemClick(e) {
      e.stopPropagation();

      this.enhanceLevelData_.currLevelValue = e.currentTarget.dataset.value;
      this.player_.setLowBacklightEnhanceLevel(parseFloat(this.enhanceLevelData_.currLevelValue)*100);
  }

  onPopupMenuChange(e) {
    if (e.menu === 'video_enhancement_menu') {
      this.element_.style.display = 'block';
    } else {
      this.element_.style.display = 'none';
    }
  }

  initUI() {
    // clear previous ui components
    DOM.removeAllChild(this.vopPanelMenu_);

    let vopMenuitems = this.enhanceLevelData_.LevelList.map((item, index) => {
      let vopMenuitem = document.createElement('div');
      vopMenuitem.setAttribute('key', index);
      vopMenuitem.setAttribute('class', 'vop-menuitem');
      vopMenuitem.setAttribute('role', 'menuitemradio');
      vopMenuitem.setAttribute('aria-checked', (this.enhanceLevelData_.currLevelValue == item.value) ? 'true' : 'false');
      vopMenuitem.setAttribute('data-value', item.value);
      vopMenuitem.addEventListener('click', this.onMenuItemClick_);
      vopMenuitem.setAttribute('tabIndex', '0');

      let vopMenuitemLabel = document.createElement('div');
      vopMenuitemLabel.setAttribute('class', 'vop-menuitem-label');

      let span = document.createElement('span');
      span.innerText = item.value;

      vopMenuitemLabel.appendChild(span);
      vopMenuitem.appendChild(vopMenuitemLabel);
      return vopMenuitem;
    });

    for (let i = 0; i < vopMenuitems.length; i ++) {
      this.vopPanelMenu_.appendChild(vopMenuitems[i]);
    }
  }

  updateUI() {
    let arrMenuitem = this.vopPanelMenu_.children;
    for (let i = 0; i < arrMenuitem.length; i ++) {
      let vopMenuitem = arrMenuitem[i];
      let value = vopMenuitem.getAttribute('data-value');
      if (this.enhanceLevelData_.currLevelValue == value) {
        vopMenuitem.setAttribute('aria-checked', 'true');
      } else {
        vopMenuitem.setAttribute('aria-checked', 'false');
      }
    }
  }

  onEnhanceLevelChanged(e) {
    this.enhanceLevelData_.currLevelValue = e.level/100.0;
    // console.log('[VEN] receive level changed to ' + this.enhanceLevelData_.currLevelValue);

    this.updateUI();
  }
}

export default UIVideoEnhancementMenu;