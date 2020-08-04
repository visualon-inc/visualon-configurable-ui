import UIComponent from './ui_component';
import Events from '../events';
import DOM from '../dom';

class UIAspectRatioMenu extends UIComponent {
  private onMenuBackClick_: any;
  private onMenuItemClick_: any;
  private vopPanelMenu_: HTMLElement;
  private aspectRatioData_: any;
  private onPopupMenuChange_: any;
  constructor(context) {
    super(context, false);

    this.onMenuBackClick_ = this.onMenuBackClick.bind(this);
    this.onMenuItemClick_ = this.onMenuItemClick.bind(this);

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-aspect-menu');
    this.element_.style.display = 'none';

    let vopPanelHeader = document.createElement('div');
    vopPanelHeader.setAttribute('class', 'vop-panel-header');

    let vopPanelTitle = document.createElement('button');
    vopPanelTitle.setAttribute('class', 'vop-panel-title');
    vopPanelTitle.addEventListener('click', this.onMenuBackClick_);
    vopPanelTitle.innerText = 'Aspect Ratio';

    this.vopPanelMenu_ = document.createElement('div');
    this.vopPanelMenu_.setAttribute('class', 'vop-panel-menu');

    vopPanelHeader.appendChild(vopPanelTitle);
    this.element_.appendChild(vopPanelHeader);
    this.element_.appendChild(this.vopPanelMenu_);

    // VO_RATIO_AUTO(original), VO_RATIO_11(1 : 1), VO_RATIO_43(4 : 3),
    // VO_RATIO_169(16 : 9), VO_RATIO_21(2 : 1), VO_RATIO_2331(2.33 : 1)
    this.aspectRatioData_ = {
      currRatioId: '0',
      ratioList: [{
        id: '0',
        value: 'Auto',
        param: (window as any).voPlayer.Enumerations.VO_ASPECT_RATIO.VO_RATIO_AUTO
      }, {
        id: '1',
        value: '1 : 1',
        param: (window as any).voPlayer.Enumerations.VO_ASPECT_RATIO.VO_RATIO_11
      }, {
        id: '2',
        value: '4 : 3',
        param: (window as any).voPlayer.Enumerations.VO_ASPECT_RATIO.VO_RATIO_43
      }, {
        id: '3',
        value: '16 : 9',
        param: (window as any).voPlayer.Enumerations.VO_ASPECT_RATIO.VO_RATIO_169
      }, {
        id: '4',
        value: '2 : 1',
        param: (window as any).voPlayer.Enumerations.VO_ASPECT_RATIO.VO_RATIO_21
      }, {
        id: '5',
        value: '2.33 : 1',
        param: (window as any).voPlayer.Enumerations.VO_ASPECT_RATIO.VO_RATIO_2331
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

    this.aspectRatioData_.currRatioId = item.dataset.id;

    function getRatioParam(id) {
      let param = '';
      for (let i = 0; i < this.aspectRatioData_.ratioList.length; i++) {
        let item = this.aspectRatioData_.ratioList[i];
        if (item.id === id) {
          param = item.param;
          break;
        }
      }

      return param;
    }
    let param = getRatioParam.call(this, this.aspectRatioData_.currRatioId);
    this.player_.setVideoAspectRatio(param);

    // update ui
    let vopMenuitems = this.vopPanelMenu_.children;
    for (let i = 0; i < vopMenuitems.length; i ++) {
      let vopMenuitem: any = vopMenuitems[i];
      let id = vopMenuitem.getAttribute('data-id');
      if (id === this.aspectRatioData_.currRatioId) {
        vopMenuitem.setAttribute('aria-checked', 'true');
      } else {
        vopMenuitem.setAttribute('aria-checked', 'false');
      }
    }
  }

  onPopupMenuChange(e) {
    if (e.menu === 'aspect_ratio_menu') {
      this.element_.style.display = 'block';
    } else {
      this.element_.style.display = 'none';
    }
  }

  onPlayerOpenFinished() {
    // clear previous ui components
    DOM.removeAllChild(this.vopPanelMenu_);

    // reset playback speed to 'auto'
    this.aspectRatioData_.currRatioId = '0';

    let vopMenuitems = this.aspectRatioData_.ratioList.map((item, index) => {
      let vopMenuitem = document.createElement('div');
      vopMenuitem.setAttribute('key', index);
      vopMenuitem.setAttribute('class', 'vop-menuitem');
      vopMenuitem.setAttribute('role', 'menuitemradio');
      vopMenuitem.setAttribute('aria-checked', (this.aspectRatioData_.currRatioId === item.id) ? 'true' : 'false');
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

export default UIAspectRatioMenu;