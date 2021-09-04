// http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
// This implementation is used since touch.js by default swallows events for extensions
// and other html5 controls

// By default touch.js adds event listeners to document, but this breaks touch support, therefore we add it to workarea.
document.addEventListener("DOMContentLoaded", function() {
	function touchHandler(event) {'use strict';
	
		var simulatedEvent,
			touches = event.changedTouches,
			first = touches[0],
			type = "";
		switch (event.type) {
			case "touchstart": type = "mousedown"; break;
			case "touchmove":  type = "mousemove"; break;
			case "touchend":   type = "mouseup"; break;
			default: return;
		}

		simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent(type, true, true, window, 1,
									first.screenX, first.screenY,
									first.clientX, first.clientY, false,
									false, false, false, 0/*left*/, null);
		if (touches.length < 2) {
			first.target.dispatchEvent(simulatedEvent);
			event.preventDefault();
		
		}
	}

	var workarea = document.getElementById("workarea");

	workarea.addEventListener('touchstart', touchHandler, true);
	workarea.addEventListener('touchmove', touchHandler, true);
	workarea.addEventListener('touchend', touchHandler, true);
	workarea.addEventListener('touchcancel', touchHandler, true);
	
	var isTouch =  !!("ontouchstart" in window) || window.navigator.msMaxTouchPoints > 0;
	if (isTouch) {
		$('.push_button').addClass('nohover'); 
	}
});
