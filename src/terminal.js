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
    strings: ["$ ^200" + cmd], 
    loop: false, 
    typeSpeed: state.speed,
    cursorChar: state.cursor,
    onTypingPaused: function(pos, self) { scroll(state.root); },
    onTypingResumed: function(pos, self) { scroll(state.root); },
    onComplete(self) {
      self.destroy();
      el.html("$ " + cmd);
      resolve(el[0]);
    }
  });
}

function output(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  cmd = args[0];
  el = $('<span>', {class: 'output', html: cmd}).appendTo(state.root);
  scroll(state.root);
  resolve(el);
}

function wait(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  timeout = args[0];
  el = $('<span>', {class: 'command'}).appendTo(state.root);
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
      resolve(last);
    }
  });
}

function tooltip(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  title = args[0];
  last.title = title;
  tippy(last, {theme: 'custom', arrow: true, placement: 'right', distance: 20, popperOptions: {
    modifiers: {
      preventOverflow: {
      	enabled: false
      }
    }
  }});

  resolve(last._tippy);
}

function mutate(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  cb = args[0]

  done = function() {
    resolve(last);
  }

  cb(last, done);
}

function hide(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  if ( typeof last.hide === 'undefined') {
    $(last).hide();
  } else{
    last.hide()
  }
  resolve(last);
}

function show(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  if ( typeof last.show === 'undefined') {
    $(last).show();
  } else{
    last.show()
  }
  resolve(last);
}

function enter(state, resolve, reject, args, last) {
  console.log(arguments.callee.name, arguments);
  $("<br/>").appendTo(last);
  resolve(last);
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
  state.hide     = pipeline.bind(null, hide, state);
  state.show     = pipeline.bind(null, show, state);
  state.enter     = pipeline.bind(null, enter, state);
  return state;
}
