import UIComponent from './ui_component';

class UIGradientBottom extends UIComponent {
  constructor(context) {
    super(context);
    this.element_ = document.createElement('div');
    this.element_.setAttribute('class', 'vop-gradient-bottom');
  }

  destroy() {
    super.destroy();
  }

  onAdStarted(e) {
    this.element_.style.zIndex = '20';
  }

  onAdComplete() {
    this.element_.style.zIndex = '2';
  }
}

export default UIGradientBottom;