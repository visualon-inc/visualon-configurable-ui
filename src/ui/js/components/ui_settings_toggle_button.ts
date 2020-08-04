import UIButton from './ui_button';
import Events from '../events';
import ID from '../id';

class UISettingsToggleButton extends UIButton {
  constructor(context) {
    super(context);

    this.initElement('vop-settings-button', 'settings');

    this.element_.setAttribute('data-id', ID.SETTINGS_BUTTON);
  }

  destroy() {
    super.destroy();
  }

  onHandleClick() {
    this.eventbus_.emit(Events.SETTING_BUTTON_CLICK);
  }

  onMouseDown() {
  }

  onPlayerOpenFinished() {
    this.flagAdBreakStart_ = false;
    this.show();
  }
}

export default UISettingsToggleButton;