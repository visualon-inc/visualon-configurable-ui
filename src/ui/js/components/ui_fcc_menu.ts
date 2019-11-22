import UIComponent from './ui_component';
import Events from '../events';

class UIFccMenu extends UIComponent {
  onMenuBackClick_: any;
  onMenuItemClick_: any;
  fccData: any;
  private vopMenuitems_: [];
  private onPopupMenuChange_: any;
  private onFccPropertyValueChange_: any;
  private fccPropertyList_: any;
  private scrollPostion_: any;
  constructor(context) {
    super(context, false);

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);

    this.fccData = {
      currFccPropertyName: 'background_color', // only valid when currMenu is 'fcc_property_menu'.
      isEnableFCC: true,
      fccPropertyList: [{
        // white/black(default)/red/green/blue/yellow/magenta/cyan
        name: 'background_color',
        values: ['default', 'white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
        currValue: 'default'
      }, {
        name: 'background_opacity',
        values: ['default', '0%', '25%', '50%', '75%', '100%'],
        currValue: 'default'
      }, {
        // white/black(default)/red/green/blue/yellow/magenta/cyan
        name: 'font_color',
        values: ['default', 'white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
        currValue: 'default'
      }, {
        name: 'font_opacity',
        values: ['default', '0%', '25%', '50%', '75%', '100%'],
        currValue: 'default'
      }, {
        // Arial(default)/Courier/Times New Roman/Helvetica/Dom/Coronet/Gothic
        name: 'font_family',
        values: ['default', 'Arial', 'Courier', 'Times New Roman', 'Helvetica', 'Dom', 'Coronet', 'Gothic'],
        currValue: 'default'
      }, {
        // none/dropshadow/raised(default)/depressed/uniform
        name: 'font_edge_type',
        values: ['default', 'none', 'leftDropShadow', 'rightDropShadow', 'raised', 'depressed', 'uniform'],
        currValue: 'default'
      }, {
        // white/black/red/green/blue(default)/yellow/magenta/cyan
        name: 'font_edge_color',
        values: ['default', 'white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
        currValue: 'default'
      }, {
        name: 'font_edge_opacity',
        values: ['default', '0%', '25%', '50%', '75%', '100%'],
        currValue: 'default'
      }, {
        name: 'font_size',
        values: ['default', '50%', '75%', '100%', '150%', '200%', '300%', '400%'],
        currValue: 'default'
      }, {
        name: 'font_bold',
        values: ['default', 'true', 'false'],
        currValue: 'default'
      }, {
        name: 'font_underline',
        values: ['default', 'true', 'false'],
        currValue: 'default'
      }, {
        name: 'font_italic',
        values: ['default', 'true', 'false'],
        currValue: 'default'
      }, {
        // white/black/red/green/blue(default)/yellow/magenta/cyan
        name: 'window_color',
        values: ['default', 'white', 'black', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan'],
        currValue: 'default'
      }, {
        name: 'window_color_opacity',
        values: ['default', '0%', '25%', '50%', '75%', '100%'],
        currValue: 'default'
      }/*, {
        name: 'bounding_box',
        values: ['default', 'custom'],
        currValue: 'default'
      }*/, {
        name: 'horizontal_position',
        values: ['default', 'left', 'center', 'right'],
        currValue: 'default'
      }]
    };

    this.fccPropertyList_ = [] as any;
    //
    this.vopMenuitems_ = this.fccData.fccPropertyList.map((item, index) => {
      this.fccPropertyList_[index] = {};
      this.fccPropertyList_[index].currValue = item.currValue;
      let vopMenuitem = document.createElement('div');
      vopMenuitem.setAttribute('key', index);
      vopMenuitem.setAttribute('class', 'vop-menuitem');
      vopMenuitem.setAttribute('role', 'menuitem');
      vopMenuitem.setAttribute('aria-haspopup', 'true');
      vopMenuitem.setAttribute('data-id', item.name);
      vopMenuitem.addEventListener('click', this.onMenuItemClick_);
      vopMenuitem.setAttribute('tabIndex', '0');

      let vopMenuitemLabel = document.createElement('div');
      vopMenuitemLabel.setAttribute('class', 'vop-menuitem-label');
      let vopMenuitemLabelSpan = document.createElement('span');
      vopMenuitemLabelSpan.innerText = item.name;

      let vopMenuitemContent = document.createElement('div');
      vopMenuitemContent.setAttribute('class', 'vop-menuitem-content');
      let vopMenuitemContentSpan = document.createElement('span');
      vopMenuitemContentSpan.innerText = item.currValue;

      vopMenuitemLabel.appendChild(vopMenuitemLabelSpan);
      vopMenuitemContent.appendChild(vopMenuitemContentSpan);

      vopMenuitem.appendChild(vopMenuitemLabel);
      vopMenuitem.appendChild(vopMenuitemContent);

      return vopMenuitem;
    });

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-fcc-menu');
    this.element_.style.display = 'none';

    let vopPanelHeader = document.createElement('div');
    vopPanelHeader.setAttribute('class', 'vop-panel-header');
    let vopPanelTitle = document.createElement('button');
    vopPanelTitle.setAttribute('class', 'vop-panel-title');
    vopPanelTitle.addEventListener('click', this.onMenuBackClick_);
    vopPanelTitle.innerText = 'Options';

    let vopPanelMenu = document.createElement('div');
    vopPanelMenu.setAttribute('class', 'vop-panel-menu');
    for (let i = 0; i < this.vopMenuitems_.length; i ++) {
      vopPanelMenu.appendChild(this.vopMenuitems_[i]);
    }

    vopPanelHeader.appendChild(vopPanelTitle);
    this.element_.appendChild(vopPanelHeader);
    this.element_.appendChild(vopPanelMenu);

    this.addEventBusListeners();
  }

  destroy() {
    super.destroy();
    this.removeEventBusListeners();
  }

  addEventBusListeners() {
    this.onPopupMenuChange_ = this.onPopupMenuChange.bind(this);
    this.onFccPropertyValueChange_ = this.onFccPropertyValueChange.bind(this);
    this.eventbus_.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
    this.eventbus_.on(Events.FCC_PROPERTY_VALUE_CHANGE, this.onFccPropertyValueChange_);
  }

  removeEventBusListeners() {
    this.eventbus_.off(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
    this.eventbus_.off(Events.FCC_PROPERTY_VALUE_CHANGE, this.onFccPropertyValueChange_);
    this.onPopupMenuChange_ = null;
    this.onFccPropertyValueChange_ = null;
  }

  onPlayerOpenFinished() {
    this.fccData.fccPropertyList.map((item, index) => {
      item.currValue = this.fccPropertyList_[index].currValue;
      this.onFccPropertyValueChange({fccProperty: item});
    });
  }

  onMenuBackClick(e) {
    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: 'settings_menu'
    });
  }

  onMenuItemClick(e) {
    this.scrollPostion_ = this.element_.parentElement.parentElement.scrollTop;
    let currFccPropertyName = e.currentTarget.dataset.id;
    let fccProperty;
    for (let i = 0; i < this.fccData.fccPropertyList.length; i++) {
      fccProperty = this.fccData.fccPropertyList[i];
      if (currFccPropertyName === fccProperty.name) {
        break;
      }
    }

    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: 'fcc_property_menu',
      fccProperty: fccProperty
    });
  }

  onPopupMenuChange(e) {
    if (e.menu === 'fcc_menu') {
      this.element_.style.display = 'block';
      let v: HTMLElement = this.element_.querySelector('.vop-menuitem');
      if (v) {
        this.element_.parentElement.parentElement.scrollTop = this.scrollPostion_ || 0;
      }
    } else {
      this.element_.style.display = 'none';
    }
  }

  onFccPropertyValueChange(e) {
    let fccProperty = e.fccProperty;
    // update ui data source
    for (let i = 0; i < this.fccData.fccPropertyList.length; i++) {
      let tmpFccProperty = this.fccData.fccPropertyList[i];
      if (tmpFccProperty.name === fccProperty.name) {
        this.fccData.fccPropertyList[i] = fccProperty;
        break;
      }
    }

    // update ui
    for (let i = 0; i < this.vopMenuitems_.length; i ++) {
      let menuitem: HTMLElement = this.vopMenuitems_[i];
      let itemname = menuitem.getAttribute('data-id');
      if (itemname === fccProperty.name) {
        let vopMenuitemContent: HTMLElement = menuitem.querySelector('.vop-menuitem-content');
        let vopMenuitemContentSpan: HTMLSpanElement = vopMenuitemContent.getElementsByTagName('span')[0];
        vopMenuitemContentSpan.innerText = fccProperty.currValue;
        break;
      }
    }
  }
}

export default UIFccMenu;
