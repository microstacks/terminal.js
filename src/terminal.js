/**
 * Welcome to Terminal.js
 * Exported module
 * @param {String|Element|Element[]|NodeList|Object} selector
 * @param {Object} options
 * @return {Object}
 */

var id=0;

function input(state, resolve, reject, args, last){
  console.log(arguments.callee.name, arguments);
  cmd = args[0]
  var content = $("#" + state.root);
  var id = state.root +'-input' + state.count;
  var el = $('<span>', {id: id, class: 'input'});
  el.appendTo(content);
  type = new Typed("#" + id, {
    strings: ["$ ^200" + cmd + "<br/>"], 
    loop: false, 
    typeSpeed: state.speed,
    cursorChar: state.cursor,
    onTypingPaused: function(pos, self) { 
      text = content.parent().parent();
      text.scrollTop(text[0].scrollHeight); 
    },
    onTypingResumed: function(pos, self) { 
      text = content.parent().parent();
      text.scrollTop(text[0].scrollHeight); 
    },
    onComplete(self) {
      self.destroy();
      el.remove();
      el.html("$ " + cmd + "<br/>");
      el.appendTo(content);
      resolve(el);
    }
  });
}

function inputCB(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  var content = $("#" + state.root);
  el = $('<span>', {id: state.root +'-input' + state.count, class: 'input'});
  el.append('<br/>');
  el.appendTo(content);
  text = content.parent().parent();
  text.scrollTop(text[0].scrollHeight); 

  done = function() {
    resolve(el);
  }

  cb(el, done);
}

function output(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  cmd = args[0];
  content = $("#" + state.root);
  id = state.root +'-output' + state.count;
  el = $('<span>', {id: id, class: 'output', html: cmd + '<br/>'});
  el.appendTo(content);
  text = content.parent().parent();
  text.scrollTop(text[0].scrollHeight); 
  resolve(el);
}

function outputCB(state, resolve, reject, args, last){
  console.log(arguments.callee.name, arguments);
  var content = $("#" + state.root);
  el = $('<span>', {id: state.root +'-output' + state.count, class: 'ouput'});
  el.append('<br/>');
  el.appendTo(content);
  text = content.parent().parent();
  text.scrollTop(text[0].scrollHeight); 

  done = function() {
    resolve(el);
  }

  cb(el, done);
}

function wait(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  timeout = args[0];
  content = $("#" + state.root);
  id = state.root +'-wait' + state.count;
  el = $('<span>', {id: id, class: 'input'});
  if (last[0].className == 'input') {
    last.find('br').remove();
  }
  el.appendTo(content);
  type = new Typed("#" + id, {
    strings: ["^" + timeout],
    loop: false, 
    typeSpeed: state.speed,
    cursorChar: state.cursor,
    onTypingPaused: function(pos, self) { 
      text = content.parent().parent();
      text.scrollTop(text[0].scrollHeight); 
    },
    onTypingResumed: function(pos, self) { 
      text = content.parent().parent();
      text.scrollTop(text[0].scrollHeight); 
    },
    onComplete(self) {
      self.destroy();
      el.remove();
      if (last[0].className == 'input') {
        last.append('<br/>');
      }
      resolve(last);
    }
  });
}

function explain(state, resolve, reject, timeout, last) {
  console.log(arguments.callee.name, arguments);
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
