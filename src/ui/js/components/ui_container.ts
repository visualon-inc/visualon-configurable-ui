import UIComponent from './ui_component';


class UIContainer extends UIComponent {
  constructor(context, bHandleAds = true) {
    super(context, bHandleAds);
  }

  // only container need to initialize children elements
  initChildren() {
    
  }

  addComponent(component: UIComponent) {
    this.components_.push(component);

    this.element_.appendChild(component.getElement());
  }

  toDomElement() {

  }
}

export default UIContainer;