class UIDebug {
  showTimeStamp_: boolean;
  constructor () {
    this.showTimeStamp_ = true;
  }

  log() {
    let message = '';
    let d = null;
    if (this.showTimeStamp_) {
      d = new Date();
      message += '[' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
        ('0' + d.getDate()).slice(-2) + ' ' +
        ('0' + d.getHours()).slice(-2) + ':' +
            ('0' + d.getMinutes()).slice(-2) + ':' +
            ('0' + d.getSeconds()).slice(-2) + '.' +
            ('0' + d.getMilliseconds()).slice(-3) + ']';
    }
    if (message.length > 0) {
      message += ' ';
    }

    Array.apply(null, arguments).forEach((item) => {
      message += item + ' ';
    });

    console.log(message);
  }
}

export default UIDebug;