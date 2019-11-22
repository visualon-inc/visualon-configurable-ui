import UIComponent from './ui_component';
import CONSTS from '../consts';

class UIAdsContainer extends UIComponent {
  constructor(context) {
    super(context);

    this.element_ = document.querySelector('.vop-ads-container');
  }

  destroy() {
    super.destroy();
  }

  onAdStarted(e) {
    if (this.element_ && e.client === 'googleima' && (e.adType === 'nonlinear')) {
      this.element_.style.bottom = CONSTS.BOTTOM_BAR_HEIGHT.toString() + 'px';
    }
  }

  onAdComplete() {
  }
}

export default UIAdsContainer;