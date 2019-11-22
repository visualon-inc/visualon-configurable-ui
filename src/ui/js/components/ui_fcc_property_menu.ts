import UIComponent from './ui_component';
import Events from '../events';
import DOM from '../dom';

class UIFccPropertyMenu extends UIComponent {
  private onMenuBackClick_: any;
  private onMenuItemClick_: any;
  private onInputChange_: any;
  private fccProperty_: any;
  private vopPanelMenu_: HTMLElement;
  private onPopupMenuChange_: any;
  constructor(context) {
    super(context, false);

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);
    this.onInputChange_ = this.onInputChange.bind(this);

    this.fccProperty_ = null;
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-fcc-property-menu');

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

  internalUpdate() {
    const fccProperty_ = this.fccProperty_;
    if (fccProperty_) {
      let menuitems = [];

      if (fccProperty_.name === 'bounding_box') {
        menuitems = fccProperty_.values.map((value, index) => {
          let vopMenuitem = document.createElement('div');
          vopMenuitem.setAttribute('key', index);
          vopMenuitem.setAttribute('class', 'vop-menuitem');
          vopMenuitem.setAttribute('role', 'menuitemradio');
          vopMenuitem.setAttribute('aria-checked', fccProperty_.currValue === value ? 'true' : 'false');
          vopMenuitem.addEventListener('click', this.onMenuItemClick_);
          vopMenuitem.setAttribute('data-id', value);
          vopMenuitem.setAttribute('tabIndex', '0');

          let vopMenuitemLabel = document.createElement('div');
          vopMenuitemLabel.setAttribute('class', 'vop-menuitem-label');
          if (value === 'default') {
            let vopMenuitemLabelSpan = document.createElement('span');
            vopMenuitemLabelSpan.innerText = value;
            vopMenuitemLabel.appendChild(vopMenuitemLabelSpan);
          }else {
            let customItem = ['Left:', 'Top:', 'Right:', 'Bottom:'];
            customItem.map(value => {
              let vopMenuitemLabelDiv = document.createElement('div');
              vopMenuitemLabelDiv.setAttribute('class', 'vop-menuitem-boundingbox');
              let vopMenuitemLabelSpan = document.createElement('span');
              vopMenuitemLabelSpan.innerText = value;
              let vopMenuitemLabelInput = document.createElement('div');
              let input = document.createElement('input');
              let inputSpan = document.createElement('span');
              input.setAttribute('type', 'number');
              input.setAttribute('name', value);
              input.setAttribute('placeholder', '0~100');
              input.setAttribute('min', '0');
              input.setAttribute('max', '100');
              input.addEventListener('change', this.onInputChange_);
              inputSpan.innerText = '%';
              vopMenuitemLabelInput.appendChild(input);
              vopMenuitemLabelInput.appendChild(inputSpan);

              vopMenuitemLabelDiv.appendChild(vopMenuitemLabelSpan);
              vopMenuitemLabelDiv.appendChild(vopMenuitemLabelInput);
              vopMenuitemLabel.appendChild(vopMenuitemLabelDiv);
            });
          }

          vopMenuitem.appendChild(vopMenuitemLabel);

          return vopMenuitem;
        });
      }else {
        menuitems = fccProperty_.values.map((value, index) => {
          let vopMenuitem = document.createElement('div');
          vopMenuitem.setAttribute('key', index);
          vopMenuitem.setAttribute('class', 'vop-menuitem');
          vopMenuitem.setAttribute('role', 'menuitemradio');
          vopMenuitem.setAttribute('aria-checked', fccProperty_.currValue === value ? 'true' : 'false');
          vopMenuitem.addEventListener('click', this.onMenuItemClick_);
          vopMenuitem.setAttribute('data-id', value);
          vopMenuitem.setAttribute('tabIndex', '0');

          let vopMenuitemLabel = document.createElement('div');
          vopMenuitemLabel.setAttribute('class', 'vop-menuitem-label');

          let vopMenuitemLabelSpan = document.createElement('span');
          vopMenuitemLabelSpan.innerText = value;

          vopMenuitemLabel.appendChild(vopMenuitemLabelSpan);
          vopMenuitem.appendChild(vopMenuitemLabel);

          return vopMenuitem;
        });
      }

      let vopPanelHeader = document.createElement('div');
      vopPanelHeader.setAttribute('class', 'vop-panel-header');
      let vopPanelTitle = document.createElement('button');
      vopPanelTitle.setAttribute('class', 'vop-panel-title');
      vopPanelTitle.addEventListener('click', this.onMenuBackClick_);
      vopPanelTitle.innerText = fccProperty_.name;

      this.vopPanelMenu_ = document.createElement('div');
      this.vopPanelMenu_.setAttribute('class', 'vop-panel-menu');
      for (let i = 0; i < menuitems.length; i++) {
        this.vopPanelMenu_.appendChild(menuitems[i]);
      }

      vopPanelHeader.appendChild(vopPanelTitle);
      this.element_.appendChild(vopPanelHeader);
      this.element_.appendChild(this.vopPanelMenu_);
    } else {
      // do nothing here
    }
  }

  onMenuBackClick(e) {
    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: 'fcc_menu'
    });
  }

  onMenuItemClick(e) {
    let currValue = e.currentTarget.dataset.id;
    this.fccProperty_.currValue = currValue;
    //console.log(`ui_fcc_property_menu.js, onMenuItemClick, click: ${currValue}`);

    // the color Opacity value on Edge do not support "%", so change it to point value in this case.
    if(this.fccProperty_.name.indexOf('opacity') >= 0 && currValue.match('[0-9]*%')) {
        this.fccProperty_.currValue = currValue.replace("%","")/100.0;
    }

    // update fcc_property refernce data & ui
    this.eventbus_.emit(Events.FCC_PROPERTY_VALUE_CHANGE, {
      fccProperty: this.fccProperty_
    });

    // update fcc_property_menu ui
    let menuitems = this.vopPanelMenu_.querySelectorAll('.vop-menuitem');
    for (let i = 0; i < menuitems.length; i++) {
      let vopMenuitem = menuitems[i];
      vopMenuitem.setAttribute('aria-checked', 'false');
    }
    e.currentTarget.setAttribute('aria-checked', 'true');

    // update player setting
    let subStyle: any = {
      enable: true
    };
    let enableItem = this.fccProperty_.currValue == 'default' ? false : true;
    switch(this.fccProperty_.name) {
      case 'background_color': {
        subStyle.fontBackgroundColor = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'background_opacity': {
        subStyle.fontBackgroundOpacity = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'font_color': {
        subStyle.fontColor = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'font_opacity': {
        subStyle.fontOpacity = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'font_family': {
        subStyle.fontFamily = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'font_edge_type': {
        subStyle.fontEdgeType = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'font_edge_color': {
        subStyle.fontEdgeColor = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'font_edge_opacity': {
        subStyle.fontEdgeOpacity = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'font_size': {
        subStyle.fontSize = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'font_bold': {
        subStyle.fontBold = {
          enable: enableItem
        };
        if (this.fccProperty_.currValue === 'true') {
          subStyle.fontBold.value = true;
        } else {
          subStyle.fontBold.value = false;
        }
      } break;
      case 'font_underline': {
        subStyle.fontUnderline = {
          enable: enableItem
        };
        if (this.fccProperty_.currValue === 'true') {
          subStyle.fontUnderline.value = true;
        } else {
          subStyle.fontUnderline.value = false;
        }
      } break;
      case 'font_italic': {
        subStyle.fontItalic = {
          enable: enableItem
        };
        if (this.fccProperty_.currValue === 'true') {
          subStyle.fontItalic.value = true;
        } else {
          subStyle.fontItalic.value = false;
        }
      } break;
      case 'window_color': {
        subStyle.windowColor = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'window_color_opacity': {
        subStyle.windowOpacity = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      case 'bounding_box': {
        if (currValue === 'default') {
          subStyle.boundingBox = {
            enable: true,
            value: {
              left: '',
              top: '',
              right: '',
              bottom: ''
            }
          }
        }else {
          return;
        }
      } break;
      case 'horizontal_position': {
        subStyle.fontHorzPosition = {
          enable: enableItem,
          value: this.fccProperty_.currValue
        };
      } break;
      default:
      break;
    }

    this.player_.setSubtitleStyles(subStyle);

    this.fccProperty_.currValue = currValue;//item seleted by this value matched "%"
  }

  onInputChange() {
    let subStyle = this.getBondingBoxStyle();

    this.player_.setSubtitleStyles(subStyle);
  }

  getBondingBoxStyle() {
    let subStyle: any = {
      enable: true
    };
    let boundingBox = this.vopPanelMenu_.querySelectorAll('.vop-menuitem-boundingbox');
    let left = boundingBox[0].getElementsByTagName('input')[0].value;
    let top = boundingBox[1].getElementsByTagName('input')[0].value;
    let right = boundingBox[2].getElementsByTagName('input')[0].value;
    let bottom = boundingBox[3].getElementsByTagName('input')[0].value;
    let value = {
      left: (left != '') ? (left + '%') : '',
      top: (top != '') ? (top + '%') : '',
      right: (right != '') ? (right + '%') : '',
      bottom: (bottom != '') ? (bottom + '%') : ''
    };
    subStyle.boundingBox = {
      enable: true,
      value: value
    };

    return subStyle;
  }

  onPopupMenuChange(e) {
    if (e.menu === 'fcc_property_menu') {
      this.fccProperty_ = e.fccProperty;
    } else {
      this.fccProperty_ = null;
    }

    DOM.removeAllChild(this.element_);

    this.internalUpdate();
  }
}

export default UIFccPropertyMenu;
