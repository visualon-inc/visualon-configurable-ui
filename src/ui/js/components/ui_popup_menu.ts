import Events from '../events';
import UIContainer from './ui_container';
import UISubtitlesMenu from './ui_subtitles_menu';
import UISettingsMenu from './ui_settings_menu';
import UIQualityMenu from './ui_quality_menu';
import UIAudioTrackMenu from './ui_audio_track_menu';
import UIFccMenu from './ui_fcc_menu';
import UIFccPropertyMenu from './ui_fcc_property_menu';
import UIXSpeedMenu from './ui_xspeed_menu';
import UIVideoEnhancementMenu from './ui_video_enhancement_menu';

class SettingMenuData {
  currMenu: string;
  currQualityId: string;
  currAudioTrackId: string;
  currFccPropertyName: string;
  isEnableFCC: boolean;
  currSpeedId: string;
  constructor() {
    this.currMenu = 'none'; // none, settings_menu, quality_menu, audio_track_menu, fcc_menu, fcc_property_menu, subtitles_menu, xspeed_menu, video_enhancement_menu

    // main settings menu
    // quality settings menu
    this.currQualityId = '2';

    // audio track settings menu
    this.currAudioTrackId = '1';

    // FCC settings menu
    this.currFccPropertyName = 'background_color'; // only valid when currMenu is 'fcc_property_menu'.
    this.isEnableFCC = true;

    // X-Speed
    this.currSpeedId = '3';
  }
}

class UIPopupMenu extends UIContainer {
  private settingMenuUIData_: any;
  private onPopupMenuChange_: any;
  private onSettingButtonClick_: any;
  private onSubtitleButtonClick_: any;
  private onVideoEnhanceButtonClick_: any;
  private onClosed_: Function;
  constructor(context) {
    super(context);
    this.settingMenuUIData_ = new SettingMenuData();

    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-popup vop-popup-menu');
    this.element_.addEventListener('mousedown', this.onPopupMenuMouseDown.bind(this));
    this.initChildren();

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
    this.onSettingButtonClick_ = this.onSettingButtonClick.bind(this);
    this.onSubtitleButtonClick_ = this.onSubtitleButtonClick.bind(this);
    this.onVideoEnhanceButtonClick_ = this.onVideoEnhanceButtonClick.bind(this);
    this.eventbus_.on(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
    this.eventbus_.on(Events.SETTING_BUTTON_CLICK, this.onSettingButtonClick_);
    this.eventbus_.on(Events.SUBTITLE_BUTTON_CLICK, this.onSubtitleButtonClick_);
    this.eventbus_.on(Events.VIDEO_ENHANCEMENT_BUTTON_CLICK, this.onVideoEnhanceButtonClick_);
  }
  
  removeEventBusListeners() {
    this.eventbus_.off(Events.POPUPMENU_CHANGE, this.onPopupMenuChange_);
    this.eventbus_.off(Events.SETTING_BUTTON_CLICK, this.onSettingButtonClick_);
    this.eventbus_.off(Events.SUBTITLE_BUTTON_CLICK, this.onSubtitleButtonClick_);
    this.eventbus_.off(Events.VIDEO_ENHANCEMENT_BUTTON_CLICK, this.onVideoEnhanceButtonClick_);
    this.onPopupMenuChange_ = null;
    this.onSettingButtonClick_ = null;
    this.onSubtitleButtonClick_ = null;
    this.onVideoEnhanceButtonClick_ = null;
  }

  addPlayerListeners() {
    super.addPlayerListeners();
    this.onClosed_ = this.onClosed.bind(this);
    this.player_.addEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_CLOSED, this.onClosed_);
  }

  removePlayerListeners() {
    super.removePlayerListeners();
    this.player_.removeEventListener((window as any).voPlayer.events.VO_OSMP_SRC_CB_CLOSED, this.onClosed_);
    this.onClosed_ = null;
  }

  initChildren() {
    let vopPanel = document.createElement('div');
    vopPanel.setAttribute('class', 'vop-panel');

    this.components_.push(new UISubtitlesMenu(this.context_));
    this.components_.push(new UISettingsMenu(this.context_));
    this.components_.push(new UIQualityMenu(this.context_));
    this.components_.push(new UIAudioTrackMenu(this.context_));
    this.components_.push(new UIFccMenu(this.context_));
    this.components_.push(new UIFccPropertyMenu(this.context_));
    this.components_.push(new UIXSpeedMenu(this.context_));
    this.components_.push(new UIVideoEnhancementMenu(this.context_));
    for (let i = 0; i < this.components_.length; i ++) {
      let component = this.components_[i];
      vopPanel.appendChild(component.getElement());
    }
    this.element_.appendChild(vopPanel);
  }

  onPopupMenuMouseDown(e) {
    // Don't route 'click' event from panel to its parent div
    e.stopPropagation();
  }

  onPopupMenuChange(e) {
    this.settingMenuUIData_.currMenu = e.menu;
  }

  onSettingButtonClick(e) {
    let menu;
    // if e.forceHide is true, means that should hide menu for other buttons are clicked.
    if (e.forceHide == true) {
        menu = 'none';
    } else if (this.settingMenuUIData_.currMenu === 'subtitles_menu' ||
      this.settingMenuUIData_.currMenu === 'video_enhancement_menu') {
      menu = 'settings_menu';
    }
    else {
      if (this.settingMenuUIData_.currMenu !== 'none') {
        menu = 'none';
      } else {
        menu = 'settings_menu';
      }
    }
    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: menu
    });
  }

  onSubtitleButtonClick(e) {
    let menu;
    if (this.settingMenuUIData_.currMenu !== 'subtitles_menu') {
      menu = 'subtitles_menu';
    } else {
      menu = 'none';
    }
    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: menu
    });
  }

  onVideoEnhanceButtonClick(e) {
    let menu;
    if (this.settingMenuUIData_.currMenu !== 'video_enhancement_menu') {
      menu = 'video_enhancement_menu';
    } else {
      menu = 'none';
    }
    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: menu
    });
  }

  onAdStarted(e) {
    // hide all popup menu.
    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
      menu: 'none'
    });
  }

  onAdComplete() {}

  onClosed() {
    // hide all popup menu.
    this.eventbus_.emit(Events.POPUPMENU_CHANGE, {
    menu: 'none'
    });
  }
}

export default UIPopupMenu;