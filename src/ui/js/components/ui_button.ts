import UIComponent from './ui_component';

class UIButton extends UIComponent {
  constructor(context, bHandleAds = true) {
    super(context, bHandleAds);
  }

  initElement(classAttribute:string, title:string='') {
    this.element_ = document.createElement('button');
    this.element_.setAttribute('class', classAttribute);
    this.element_.title = title;

    this.element_.addEventListener('click', this.onHandleClick.bind(this));
    this.element_.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  onHandleClick() {
  }

  onMouseDown() {
    super.hideMenu();
  }
}

export default UIButton;