/**
 * Welcome to Terminal.js
 * Exported module
 * @param {String|Element|Element[]|NodeList|Object} selector
 * @param {Object} options
 * @return {Object}
 */

var id=0;

function input(state, resolve, reject, args, last){
  console.log(arguments.callee.name, args)
  console.log(arguments.callee.name, last);
  cmd = args[0]
  var content = "#" + state.root;
  $(content).append('<span id="'+ state.root +'-input' + state.count + '" class="input"></span>');
  type = new Typed("#" + state.root + "-input" + state.count, {
    strings: ["$ ^200" + cmd + "<br/>"], 
    loop: false, 
    typeSpeed: state.speed,
    cursorChar: state.cursor,
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
      resolve($("#" + state.root +'-input' + state.count));
    }
  });
}

function inputCB(state, resolve, reject, cb, last) {
  console.log(arguments.callee.name, args);
  console.log(arguments.callee.name, last);
  cb = args[0]
  var content = "#" + state.root;
  var input = $(content).append('<span id="'+ state.root +'-input' + state.count + '" class="input"></span><br/>');
  text = $(content).parent().parent();
  $(text).scrollTop($(content)[0].scrollHeight); 

  done = function() {
    resolve($("#" + state.root +'-input' + state.count));
  }

  cb($("#" + state.root + "-input" + state.count), done, reject);
}

function output(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, last);
  content = "#" + state.root;
  $(content).append('<span id="'+ state.root +'-output' + state.count + '" class="output">' + cmd +'<br/></span>');
  text = $(content).parent().parent();
  $(text).scrollTop($(content)[0].scrollHeight); 
  resolve($("#" + state.root +'-output' + state.count));
}

function outputCB(state, resolve, reject, cb, last){
  console.log(arguments.callee.name, last);
  var content = "#" + state.root;
  $(content).append('<span id="'+ state.root +'-output' + state.count + '" class="output"></span><br/>');
  text = $(content).parent().parent();
  $(text).scrollTop($(content)[0].scrollHeight); 

  done = function() {
    resolve($("#" + state.root +'-output' + state.count));
  }

  cb($("#" + state.root + "-output" + state.count), done, reject);
}

function wait(state, resolve, reject, timeout, last) {
  console.log(arguments.callee.name, last);
  content = "#" + state.root;
  $(content).append('<span id="'+ state.root +'-wait' + state.count + '" class="input"></span>');
  type = new Typed("#" + state.root + "-wait" + state.count, {
    strings: ["^" + timeout],
    loop: false, 
    typeSpeed: state.speed,
    cursorChar: state.cursor,
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
      resolve($("#" + state.root +'-wait' + state.count));
    }
  });
}

function explain(state, resolve, reject, timeout, last) {
  console.log(arguments.callee.name, last);
  resolve(last);
  
}

function queue(func, state) {
  var args = [];
  for (var idx = 0; idx < arguments.length; idx++) {
    if (idx < 2) continue;
    args.push(arguments[idx]);
  }
  pending = state.promise;
  state.count++;
  state.promise = new Promise(function(resolve, reject) {
    if (pending) {
      pending.then(func.bind(null, jQuery.extend(true, {}, state), resolve, reject, args))
    } else {
      func(jQuery.extend(true, {}, state), resolve, reject, args);
    }
  });

  return state;
}

function terminal(selector, options) {
  var content = "content" + id++;

  // Convert element to terminal
  $(selector).append('<div class="text-editor-wrap">\
<div class="title-bar">\
<span class="icon close-icon"></span>\
<span class="icon minimize-icon"></span>\
<span class="icon fullScreen-icon"></span>\
<span>bash - 80 x 20</span></span>\
</div>\
<div data-simplebar class="text-body">\
<span id="' + content + '" style="white-space:pre;"></span>\
</div>\
</div>');

  state = { 
    count: 0, 
    root: content, 
    promise: null, 
    cursor: (options && options.cursor) || "_",
    speed: (options && options.speed) || 65
  };
  state.input    = queue.bind(null, input, state);
  state.inputCB  = queue.bind(null, inputCB, state),
  state.output   = queue.bind(null, output, state),
  state.outputCB = queue.bind(null, outputCB, state),
  state.wait     = queue.bind(null, wait, state)
  state.explain  = queue.bind(null, explain, state)
  return state;state
}
