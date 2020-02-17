import UIComponent from './ui_component';
import DOM from '../dom';

class UILogoOverlay extends UIComponent {
  constructor(context) {
    super(context);

    let properties = {
      'className': 'vop-logo-container',
    };
    this.element_ = DOM.createEl('div', properties);
    this.element_.addEventListener('click', this.onLogoClick.bind(this));
    this.element_.addEventListener('mousedown', this.onLogoMouseDown.bind(this));

    this.initChildren();
  }

  initChildren() {
    let a = document.createElement('a');
    a.setAttribute('href', 'http://www.visualon.com');
    a.setAttribute('target', '_Blank');

    let btn = document.createElement('button');
    btn.setAttribute('class', 'vop-logo-button');
    
    a.appendChild(btn);

    this.element_.appendChild(a);
  }

  onLogoClick(e) {
    e.stopPropagation();
  }

  onLogoMouseDown(e) {
    e.stopPropagation();
  }
}

export default UILogoOverlay;
