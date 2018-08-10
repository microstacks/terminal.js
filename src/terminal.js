/**
 * Welcome to Terminal.js
 * Exported module
 * @param {String|Element|Element[]|NodeList|Object} selector
 * @param {Object} options
 * @return {Object}
 */

var id=0;

function input(state, resolve, reject, cmd, options){
  content = "#" + state.root;
  $(content).append('<span id="'+ state.root +'-input' + state.count + '" class="input"></span>');
  type = new Typed("#" + state.root + "-input" + state.count, {
    strings: ["$ ^200" + cmd + "<br/>"], 
    loop: false, 
    typeSpeed: 65,
    onTypingPaused: function(pos, self) { 
      text = $(content).parent().parent();
      $(text).scrollTop($(text)[0].scrollHeight); 
    },
    onTypingResumed: function(pos, self) { 
      text = $(content).parent().parent();
      $(text).scrollTop($(text)[0].scrollHeight); 
    },
    onComplete(self) {
      self.destroy();
      $(content).append('<span id="'+ state.root +'-input' + state.count + '" class="input">$ ' + cmd +'<br/></span>');
      resolve();
    }
  });
}

function inputCB(term, resolve, reject, cmd, options) {
}

function output(state, resolve, reject, cmd, options) {
  content = "#" + state.root;
  $(content).append('<span id="'+ state.root +'-output' + state.count + '" class="output">' + cmd +'<br/></span>');
  text = $(state.root).parent().parent();
  $(text).scrollTop($(content)[0].scrollHeight); 
  resolve();
}

function outputCB(term, resolve, reject, cmd, options){
}


function then(func, state, cmd, options) {
  pending = state.promise;
  state.count++;
  state.promise = new Promise(function(resolve, reject) {
    if (pending) {
      pending.then(func.bind(null, jQuery.extend(true, {}, state), resolve, reject, cmd, options))
    } else {
      func(jQuery.extend(true, {}, state), resolve, reject, cmd, options);
    }
  });

  return state;
}

function terminal(selector) {
  var content = "content" + id++;

  // Convert element to terminal
  $(selector).append('<div class="text-editor-wrap">\
<div class="title-bar">\
<span class="icon close-icon"></span>\
<span class="icon minimize-icon"></span>\
<span class="icon fullScreen-icon"></span>\
<span>bash - 8x x 20</span></span>\
</div>\
<div data-simplebar class="text-body">\
<span id="' + content + '" style="white-space:pre;"></span>\
</div>\
</div>');

  state = { count: 0, root: content, promise: null};
  state.input    = then.bind(null, input, state);
  state.inputCB  = then.bind(null, inputCB, state),
  state.output   = then.bind(null, output, state),
  state.outputCB = then.bind(null, outputCB, state)
  return state;state
}
