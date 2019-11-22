import UIComponent from './ui_component';
import DOM from '../dom';

class UISpacer extends UIComponent {
  constructor(context) {
    super(context, false);
    // ui properties
    let properties = {
      'className': 'vop-spacer',
    };

    // create html element
    this.element_ = DOM.createEl('div', properties);
  }
}

export default UISpacer;
