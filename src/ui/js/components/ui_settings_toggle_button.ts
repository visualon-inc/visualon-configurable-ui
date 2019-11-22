import UIComponent from './ui_component';
import Events from '../events';
import ID from '../id';

class UISettingsToggleButton extends UIComponent {
  constructor(context) {
    super(context);
    this.element_ = document.createElement('button');
    this.element_.setAttribute('class', 'vop-button vop-settings-button');
    this.element_.setAttribute('data-id', ID.SETTINGS_BUTTON);
    this.element_.title = 'settings';
    this.element_.addEventListener('click', (e) => {
      this.onHandleClick(e);
    }, true);
  }

  destroy() {
    super.destroy();
  }

  onHandleClick(e) {
    this.eventbus_.emit(Events.SETTING_BUTTON_CLICK);
  }

  onPlayerOpenFinished() {
    this.flagAdBreakStart_ = false;
    this.show();
  }
}

export default UISettingsToggleButton;