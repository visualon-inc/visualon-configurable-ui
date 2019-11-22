import UIComponent from './ui_component';
import Events from '../events';
import DOM from '../dom';

class UIXSpeedMenu extends UIComponent {
  private onMenuBackClick_: any;
  private onMenuItemClick_: any;
  private vopPanelMenu_: HTMLElement;
  private xspeedData_: any;
  private onPopupMenuChange_: any;
  constructor(context) {
    super(context, false);

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-xspeed-menu');
    this.element_.style.display = 'none';

    let vopPanelHeader = document.createElement('div');
    vopPanelHeader.setAttribute('class', 'vop-panel-header');

    let vopPanelTitle = document.createElement('button');
    vopPanelTitle.setAttribute('class', 'vop-panel-title');
    vopPanelTitle.addEventListener('click', this.onMenuBackClick_);
    vopPanelTitle.innerText = 'Speed';

    this.vopPanelMenu_ = document.createElement('div');
    this.vopPanelMenu_.setAttribute('class', 'vop-panel-menu');

    vopPanelHeader.appendChild(vopPanelTitle);
    this.element_.appendChild(vopPanelHeader);
    this.element_.appendChild(this.vopPanelMenu_);

    this.xspeedData_ = {
      currSpeedId: '3',
      xspeedList: [{
        id: '1',
        value: 0.25
      }, {
        id: '2',
        value: 0.5
      }, {
        id: '3',
        value: 1.0
      }, {
        id: '4',
        value: 1.5
      }, {
        id: '5',
        value: 2.0
      }]
    };

    this.addEventBusListeners();
  }

  destroy() {
    super.destroy();
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

  onMenuBackClick(e) {
    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: 'settings_menu'
    });
  }

  onMenuItemClick(e) {
    let item = e.currentTarget;

    this.xspeedData_.currSpeedId = item.dataset.id;

    // Change Player X-Speed
    function getXSpeedValue(id) {
      let value = '';
      for (let i = 0; i < this.xspeedData_.xspeedList.length; i++) {
        let item = this.xspeedData_.xspeedList[i];
        if (item.id === id) {
          value = item.value;
          break;
        }
      }

      return value;
    }
    let value = getXSpeedValue.call(this, this.xspeedData_.currSpeedId);
    this.player_.setAudioPlaybackSpeed(parseFloat(value));

    // update ui
    let vopMenuitems = this.vopPanelMenu_.children;
    for (let i = 0; i < vopMenuitems.length; i ++) {
      let vopMenuitem: any = vopMenuitems[i];
      let id = vopMenuitem.getAttribute('data-id');
      if (id === this.xspeedData_.currSpeedId) {
        vopMenuitem.setAttribute('aria-checked', 'true');
      } else {
        vopMenuitem.setAttribute('aria-checked', 'false');
      }
    }
  }

  onPopupMenuChange(e) {
    if (e.menu === 'xspeed_menu') {
      this.element_.style.display = 'block';
    } else {
      this.element_.style.display = 'none';
    }
  }

  onPlayerOpenFinished() {
    // clear previous ui components
    DOM.removeAllChild(this.vopPanelMenu_);

    // reset playback speed to 1
    this.xspeedData_.currSpeedId = '3';

    let vopMenuitems = this.xspeedData_.xspeedList.map((item, index) => {
      let vopMenuitem = document.createElement('div');
      vopMenuitem.setAttribute('key', index);
      vopMenuitem.setAttribute('class', 'vop-menuitem');
      vopMenuitem.setAttribute('role', 'menuitemradio');
      vopMenuitem.setAttribute('aria-checked', (this.xspeedData_.currSpeedId === item.id) ? 'true' : 'false');
      vopMenuitem.setAttribute('data-id', item.id);
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
}

export default UIXSpeedMenu;