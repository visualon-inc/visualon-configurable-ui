import UIContainer from './ui_container';
import DOM from '../dom';

class UITitleBar extends UIContainer {
  constructor(context) {
    super(context, false);
    let properties = {
      'className': 'vop-titlebar',
    };
    this.element_ = DOM.createEl('div', properties);

    // TODO: Don't show title bar for now.
    //this.initChildren();
  }

  initChildren() {
    let title = 'Big Buck Bunny';
    let description = 'Tired of being picked on by Frankie the squirrel and his band of puny forest creatures, JC the bunny finally decides to fight back.';

    let uiTitlebarTitle = document.createElement('span');
    uiTitlebarTitle.innerText = title;

    let uiTitlebarDescription = document.createElement('span');
    uiTitlebarDescription.setAttribute('class', 'vop-titlebar-description');
    uiTitlebarDescription.innerText = description;

    this.element_.appendChild(uiTitlebarTitle);
    this.element_.appendChild(uiTitlebarDescription);
  }
}

export default UITitleBar;