/**
 * Welcome to Terminal.js
 * Exported module
 * @param {String|Element|Element[]|NodeList|Object} selector
 * @param {Object} options
 * @return {Object}
 */

function _input(root, count, resolve, reject, cmd, options){
  root.append('<span id="input' + count + '" class="input"></span>');
  type = new Typed("#input" + count, {
    strings: ["$ ^200" + cmd + "<br/>"], 
    loop: false, 
    typeSpeed: 65,
    onComplete(self) {
      self.destroy();
      root.append('<span id="input' + count + '" class="input">$ ' + cmd +'<br/></span>');
      resolve();
    }
  });
}

function _output(root, count, resolve, reject, cmd, options){
  root.append('<span id="output' + count + '" class="output"></span>');
  type = new Typed("#output" + count, {
    strings: ["`" + cmd + "`<br/>"], 
    loop: false, 
    typeSpeed: 65,
    onComplete(self) {
      self.destroy();
      root.append('<span id="output' + count + '" class="output">' + cmd +'<br/></span>');
      resolve();
    }
  });
}

function output(cmd, options) {
  prevCmd = this.promise;
  root = this.root;
  id = this.id
  count = id.count++;
  return {
    root: root,
    count: count,
    id: id,
    promise: new Promise(function(resolve, reject) {
      if (prevCmd) {
        prevCmd.then(_output.bind(null, root, count, resolve, reject, cmd, options))
      } else {
        _output(root, count, resolve, reject, cmd, options);
      }
    }),
    input: input,
    output: output
  }
}

function input(cmd, options) {
  prevCmd = this.promise;
  root = this.root;
  id = this.id
  count = id.count++;
  return {
    root: root,
    count: count,
    id: id,
    promise: new Promise(function(resolve, reject) {
      if (prevCmd) {
        prevCmd.then(_input.bind(null, root, count, resolve, reject, cmd, options))
      } else {
        _input(root, count, resolve, reject, cmd, options);
      }
    }),
    input: input,
    output: output
  }
}

function terminal(selector, options) {
  var width = (typeof options !== 'undefined' && options.width) || $(selector).width();
  var height = (typeof options !== 'undefined' && options.height) || 400;

  $(selector).empty()
  // Convert element to terminal
  $(selector).append('<div class="text-editor-wrap">\
<div class="title-bar">\
<span class="icon close-icon"></span>\
<span class="icon minimize-icon"></span>\
<span class="icon fullScreen-icon"></span>\
<span>bash - ' + width + ' x ' + height + '</span></span>\
</div>\
<div data-simplebar class="text-body">\
<span id="content" style="white-space:pre;"></span>\
</div>\
</div>');
  id = { count: 0 }
  return {
    id: id,
    terminal: this,
    root: $("#content"),
    promise: null,
    input: input,
    output: output
  };
}
