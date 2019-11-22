class DOM {
  // TODO: Use createEl gradually.
  element: HTMLElement;

  constructor(tagName: string, attributes: {[name: string]: string}) {
    let element = document.createElement(tagName);

    for (let attributeName in attributes) {
      let attributeValue = attributes[attributeName];
      element.setAttribute(attributeName, attributeValue);
    }

    this.element = element;
  }

  get() {
    return this.element;
  }

  // tool functions
  static isObject(value) {
    return !!value && typeof value === 'object';
  }

  static isEl(value) {
    return DOM.isObject(value) && value.nodeType === 1;
  }

  static isTextNode(value) {
    return DOM.isObject(value) && value.nodeType === 3;
  }

  static normalizeContent(content) {
    // First, invoke content if it is a function. If it produces an array,
    // that needs to happen before normalization.
    if (typeof content === 'function') {
      content = content();
    }

    // Next up, normalize to an array, so one or many items can be normalized,
    // filtered, and returned.
    return (Array.isArray(content) ? content : [content]).map(value => {
      // First, invoke value if it is a function to produce a new value,
      // which will be subsequently normalized to a Node of some kind.
      if (typeof value === 'function') {
        value = value();
      }

      if (DOM.isEl(value) || DOM.isTextNode(value)) {
        return value;
      }

      if (typeof value === 'string' && (/\S/).test(value)) {
        return document.createTextNode(value);
      }
    }).filter(value => value);
  }

  static textContent(el, text) {
    if (typeof el.textContent === 'undefined') {
      el.innerText = text;
    } else {
      el.textContent = text;
    }
    return el;
  }

  static appendContent(el, content) {
    DOM.normalizeContent(content).forEach(node => el.appendChild(node));
    return el;
  }

  static createEl(tagName = 'div', properties = {}, attributes = {}, content = null) {
    const el = document.createElement(tagName);

    Object.getOwnPropertyNames(properties).forEach(function(propName) {
      const val = properties[propName];

      // We originally were accepting both properties and attributes in the
      // same object, but that doesn't work so well.
      if (propName.indexOf('aria-') !== -1 || propName === 'role' || propName === 'type') {
        // console.warn(tsml`Setting attributes in the second argument of createEl()
        //           has been deprecated. Use the third argument instead.
        //           createEl(type, properties, attributes). Attempting to set ${propName} to ${val}.`);
        el.setAttribute(propName, val);

      // Handle textContent since it's not supported everywhere and we have a
      // method for it.
      } else if (propName === 'textContent') {
        DOM.textContent(el, val);
      } else {
        el[propName] = val;
      }
    });

    Object.getOwnPropertyNames(attributes).forEach(function(attrName) {
      el.setAttribute(attrName, attributes[attrName]);
    });

    if (content) {
      DOM.appendContent(el, content);
    }

    return el;
  }

  static throwIfWhitespace(str) {
    if ((/\s/).test(str)) {
      throw new Error('class has illegal whitespace characters');
    }
  }

  static classRegExp(className) {
    return new RegExp('(^|\\s)' + className + '($|\\s)');
  }

  static hasClass(element, classToCheck) {
    DOM.throwIfWhitespace(classToCheck);
    if (element.classList) {
      return element.classList.contains(classToCheck);
    }
    return DOM.classRegExp(classToCheck).test(element.className);
  }

  static addClass(element, classToAdd) {
    if (element.classList) {
      element.classList.add(classToAdd);

    // Don't need to `throwIfWhitespace` here because `hasElClass` will do it
    // in the case of classList not being supported.
    } else if (!DOM.hasClass(element, classToAdd)) {
      element.className = (element.className + ' ' + classToAdd).trim();
    }

    return element;
  }

  static removeClass(element, classToRemove) {
    if (element.classList) {
      element.classList.remove(classToRemove);
    } else {
      DOM.throwIfWhitespace(classToRemove);
      element.className = element.className.split(/\s+/).filter(function(c) {
        return c !== classToRemove;
      }).join(' ');
    }

    return element;
  }

  static isPtInElement(element, pt) {
    let rect = element.getBoundingClientRect();
    if ((rect.left <= pt.x && pt.x <= rect.right) &&
      (rect.top <= pt.y && pt.y <= rect.bottom)) {
      return true;
    } else {
      return false;
    }
  }

  static removeAllChild(element) {
    while (element.hasChildNodes()) { //当elem下还存在子节点时 循环继续
      element.removeChild(element.firstChild);
    }
  }
}

export default DOM;