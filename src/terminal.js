/**
 * Welcome to Terminal.js
 */

function scroll(root) {
  text = root.parent().parent();
  text.scrollTop(text[0].scrollHeight); 
}

function run(state, resolve, reject, args, last){
  console.log(arguments.callee.name, arguments);
  cmd = args[0]
  var el = $('<span>', {class: 'command'}).appendTo(state.root);
  type = new Typed(el[0], {
    strings: ["$ ^200" + cmd + "<br/>"], 
    loop: false, 
    typeSpeed: state.speed,
    cursorChar: state.cursor,
    onTypingPaused: function(pos, self) { scroll(state.root); },
    onTypingResumed: function(pos, self) { scroll(state.root); },
    onComplete(self) {
      self.destroy();
      el.html("$ " + cmd + "<br/>");
      resolve(el);
    }
  });
}

function output(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  cmd = args[0];
  el = $('<span>', {class: 'output', html: cmd + '<br/>'}).appendTo(state.root);
  scroll(state.root);
  resolve(el);
}

function wait(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  timeout = args[0];
  el = $('<span>', {class: 'command'}).appendTo(state.root);
  if (last[0].className == 'command') {
    last.find('br').remove();
  }
  type = new Typed(el[0], {
    strings: ["^" + timeout],
    loop: false, 
    typeSpeed: state.speed,
    cursorChar: state.cursor,
    onTypingPaused: function(pos, self) { scroll(state.root); },
    onTypingResumed: function(pos, self) { scroll(state.root); },
    onComplete(self) {
      self.destroy();
      el.remove();
      if (last[0].className == 'command') {
        last.append('<br/>');
      }
      resolve(last);
    }
  });
}

function tooltip(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  title = args[0];
  timeout = args[1] || 1000;
  last[0].title = title;
  tippy(last[0], {theme: 'custom', arrow: true, placement: 'right', distance: 20, popperOptions: {
    modifiers: {
      preventOverflow: {
      	enabled: false
      }
    }
  }});
  console.log(last[0]._tippy);
  last[0]._tippy.show();
  
  function hide(last){
    last[0]._tippy.hide();
    resolve(last);
  }
  
  setTimeout(hide, timeout, last);
  
}

function mutate(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  cb = args[0]

  done = function() {
    resolve(last);
  }

  cb(last, done);
}


function pipeline(func, state) {
  var args = [];
  for (var idx = 0; idx < arguments.length; idx++) {
    if (idx < 2) continue;
    args.push(arguments[idx]);
  }
  pending = state.promise;
  state.promise = new Promise(function(resolve, reject) {
    call = func.bind(null, jQuery.extend(true, {}, state), resolve, reject, args)
    pending && pending.then(call) || call();
  });

  return state;
}

function terminal(selector, options) {
  term = $("<div>", {class: 'text-editor-wrap'});
  titleBar = $("<div>", {class: 'title-bar'}).appendTo(term);
  closeIcon = $("<span>", {class: 'icon close-icon'}).appendTo(titleBar);
  closeMinimize = $("<span>", {class: 'icon minimize-icon'}).appendTo(titleBar);
  closeFullscreen = $("<span>", {class: 'icon fullscreen-icon'}).appendTo(titleBar);
  title = $("<span>").text('bash - 80 x 20').appendTo(titleBar);
  textBody = $("<div>", {class: 'text-body'}).attr('data-simplebar', '').appendTo(term);
  content = $('<span>').css('white-space', 'pre').appendTo(textBody);
  term.appendTo(selector);
    
  state = { 
    root: content, 
    promise: null, 
    cursor: (options && options.cursor) || "_",
    speed: (options && options.speed) || 65
  };
  
  state.run      = pipeline.bind(null, run, state);
  state.output   = pipeline.bind(null, output, state);
  state.wait     = pipeline.bind(null, wait, state);
  state.tooltip  = pipeline.bind(null, tooltip, state);
  state.mutate   = pipeline.bind(null, mutate, state);
  return state;
}
