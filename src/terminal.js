/**
 * Welcome to Terminal.js
 * Exported module
 * @param {String|Element|Element[]|NodeList|Object} selector
 * @param {Object} options
 * @return {Object}
 */

var id=0;

function _input(state, resolve, reject, cmd, options){
  $(state.root).append('<span id="input' + state.count + '" class="input"></span>');
  console.log(state.root);
  type = new Typed("#input" + state.count, {
    strings: ["$ ^200" + cmd + "<br/>"], 
    loop: false, 
    typeSpeed: 65,
    onTypingPaused: function(pos, self) { 
      content = $(state.root).parent().parent();
      $(content).scrollTop($(content)[0].scrollHeight); 
    },
    onTypingResumed: function(pos, self) { 
      content = $(state.root).parent().parent();
      $(content).scrollTop($(content)[0].scrollHeight); 
    },
    onComplete(self) {
      self.destroy();
      $(state.root).append('<span id="input' + state.count + '" class="input">$ ' + cmd +'<br/></span>');
      resolve();
    }
  });
}

function _inputCB(term, resolve, reject, cmd, options){
}

function _output(state, resolve, reject, cmd, options){
  $(state.root).append('<span id="output' + state.count + '" class="output"></span>');
  type = new Typed("#output" + state.count, {
    strings: ["`" + cmd + "`<br/>"], 
    loop: false, 
    typeSpeed: 65,
    onTypingPaused: function(pos, self) { 
      content = $(state.root).parent().parent();
      $(content).scrollTop($(content)[0].scrollHeight); 
    },
    onTypingResumed: function(pos, self) { 
      content = $(state.root).parent().parent();
      $(content).scrollTop($(content)[0].scrollHeight); 
    },
    onComplete(self) {
      self.destroy();
      $(state.root).append('<span id="output' + state.count + '" class="output">' + cmd +'<br/></span>');
      resolve();
    }
  });
}

function _outputCB(term, resolve, reject, cmd, options){
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

  state = { count: 0, root: "#" + content, promise: null};
  state.input    = then.bind(null, _input, state);
  state.inputCB  = then.bind(null, _inputCB, state),
  state.output   = then.bind(null, _output, state),
  state.outputCB = then.bind(null, _outputCB, state)
  return state;state
}
