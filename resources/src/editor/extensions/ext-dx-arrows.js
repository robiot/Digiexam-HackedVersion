/*globals svgEditor, svgCanvas, $*/
svgEditor.ready(function() {
	svgEditor.addExtension('dx-arrows', function(privates) {
		var getNextId = privates.getNextId;
		var addElem = privates.addSvgElementFromJson;
		var findDefs = privates.findDefs;
		var getElem = privates.getElem;
		var getSVGContent = privates.getSVGContent;
		var call = privates.call;
		var nonce = privates.nonce;
		var randomize_ids = privates.randomize_ids;
		var pathdata;
		var arrowprefix;
		var prefix = 'se_arrow_';
		var canv = svgEditor.canvas;

		var mode_id = "dx-arrow";

		var mtypes = ['start', 'mid', 'end'];

		var current_drawing_shape = null;

		if (randomize_ids) {
			arrowprefix = prefix + nonce + '_';
		} else {
			arrowprefix = prefix;
		}

		pathdata = {
			fw: {d: 'm0,0l10,5l-10,5l5,-5l-5,-5z', refx: 8,  id: arrowprefix + 'fw'},
			bk: {d: 'm10,0l-10,5l10,5l-5,-5l5,-5z', refx: 2, id: arrowprefix + 'bk'}
		};

		function getLinked(elem, attr) {
			var str = elem.getAttribute(attr);
			if(!str) {
				return null;
			}

			var m = str.match(/\(\#(.*)\)/);
			if(!m || m.length !== 2) {
				return null;
			}

			return getElem(m[1]);
		}

		function getExistingMarkerByColorAndDir(color, dir) {
			var markers = $(findDefs()).find('marker').toArray();

			for(var i = 0, l = markers.length, marker, attrs; i < l; ++i) {
				marker = markers[i];
				attrs = {
					fill: marker.children[0].getAttribute("fill"),
					d: marker.children[0].getAttribute("d")
				};

				if(attrs.fill === color && attrs.d === pathdata[dir]) {
					// Found another marker with this color and this path
					return marker;
				}
			}

			return null;
		}

		function addMarker(dir, type) {
			// TODO: Make marker (or use?) per arrow type, since refX can be different
			var color = svgEditor.canvas.getStyle().stroke;

			var marker = getExistingMarkerByColorAndDir(color, dir);
			var data = pathdata[dir];

			if (type == 'mid') {
				data.refx = 5;
			}

			if (!marker) {
				marker = addElem({
					'element': 'marker',
					'attr': {
						'viewBox': '0 0 10 10',
						'id': arrowprefix + dir + getNextId(),
						'refY': 5,
						'markerUnits': 'strokeWidth',
						'markerWidth': 5,
						'markerHeight': 5,
						'orient': 'auto',
						'style': 'pointer-events:none' // Currently needed for Opera
					}
				});

				var arrow = addElem({
					'element': 'path',
					'attr': {
						'd': data.d,
						'fill': color
					}
				});

				marker.appendChild(arrow);
				findDefs().appendChild(marker);
			}

			marker.setAttribute('refX', data.refx);

			return marker;
		}

		function setArrow(el) {
			var type = 'end';

			if (type == 'none') {
				return;
			}

			// Set marker on element
			var dir = 'fw';
			if (type == 'mid_bk') {
				type = 'mid';
				dir = 'bk';
			} else if (type == 'both') {
				addMarker('bk', type);
				svgCanvas.changeSelectedAttribute('marker-start', 'url(#' + pathdata.bk.id + ')');
				type = 'end';
				dir = 'fw';
			} else if (type == 'start') {
				dir = 'bk';
			}

			var marker = addMarker(dir, type);
			svgCanvas.changeSelectedAttribute('marker-' + type, 'url(#' + marker.id + ')');
		}

		function colorChanged(elem) {
			var color = elem.getAttribute('stroke');

			for(var i = 0, l = mtypes.length, type; i < l; ++i) {
				type = mtypes[i];

				var marker = getLinked(elem, 'marker-' + type);
				if(!marker) {
					continue;
				}

				var cur_color = $(marker).children().attr('fill');
				if(cur_color === color) {
					continue;
				}

				var cur_d = $(marker).children().attr('d');
				var dir = marker.id.indexOf('_fw') !== -1
					? 'fw'
					: 'bk';
				var new_marker = getExistingMarkerByColorAndDir(color, dir);

				if(!new_marker) {
					// Create a new marker with this color
					new_marker = addMarker(dir, type);
				}

				$(elem).attr('marker-' + type, 'url(#' + new_marker.id + ')');

				cleanMarkers();
			}
		}

		function cleanMarkers() {
			var markers = $(findDefs()).find('marker').toArray();
			var arrows = $(getSVGContent())
				.find(mtypes.map(function(type) { return '[marker-' + type + ']'; }).join(','))
				.toArray();

			// No arrows found? Remove AAAAALLL the markers and shortcircuit
			if(arrows.length === 0) {
				$(markers).remove();
				return;
			}

			var toBeRemoved = [];
			for(var x = markers.length - 1, marker, id, found; x >= 0; --x) {
				marker = markers[x];
				id = 'url(#' + marker.id + ')';
				found = false;

				for(var i = 0, l = arrows.length, arrow; i < l; ++i) {
					arrow = arrows[i];

					if(
						arrow.getAttribute('marker-start') === id ||
						arrow.getAttribute('marker-mid') === id ||
						arrow.getAttribute('marker-end') === id
					) {
						found = true;
						break;
					}
				}

				if(!found) {
					toBeRemoved.push(marker);
				}
			}

			if(toBeRemoved.length > 0) {
				$(toBeRemoved).remove();
			}
		}

		function onMouseDown(opts) {
			if(canv.getMode() !== mode_id) {
				return;
			}

			var start_x = opts.start_x;
			var start_y = opts.start_y;

			if (svgEditor.curConfig.gridSnapping) {
				start_x = svgedit.utilities.snapToGrid(start_x);
				start_y = svgedit.utilities.snapToGrid(start_y);
			}

			var cur_style = canv.getStyle();
			var stroke_w = cur_style.stroke_width == 0 ? 1 : cur_style.stroke_width;

			current_drawing_shape = addElem({
				element: 'line',
				curStyles: true,
				attr: {
					x1: start_x,
					y1: start_y,
					x2: start_x,
					y2: start_y,
					id: getNextId(),
					stroke: cur_style.stroke,
					'stroke-width': stroke_w,
					'stroke-dasharray': cur_style.stroke_dasharray,
					'stroke-linejoin': cur_style.stroke_linejoin,
					'stroke-linecap': cur_style.stroke_linecap,
					'stroke-opacity': cur_style.stroke_opacity,
					fill: 'none',
					opacity: cur_style.opacity / 2,
					style: 'pointer-events:none'
				}
			});

			return {
				started: true
			};
		}

		function onMouseMove(opts) {
			if(canv.getMode() !== mode_id) {
				return;
			}

			var x = opts.mouse_x;
			var y = opts.mouse_y;

			if (svgEditor.curConfig.gridSnapping) {
				x = svgedit.utilities.snapToGrid(x);
				y = svgedit.utilities.snapToGrid(y);
			}

			current_drawing_shape.setAttribute("x2", x);
			current_drawing_shape.setAttribute("y2", y);
		}

		function onMouseUp(opts) {
			if(canv.getMode() !== mode_id) {
				return;
			}

			var el = current_drawing_shape;

			var cur_style = canv.getStyle();

			el.setAttribute("opacity", cur_style.opacity);
			var attrs = {
				x1: +el.getAttribute("x1"),
				y1: +el.getAttribute("y1"),
				x2: +el.getAttribute("x2"),
				y2: +el.getAttribute("y2")
			};

			var keep = attrs.x1 !== attrs.x2 || attrs.y1 !== attrs.y2;

			if(!keep) {
				current_drawing_shape = null;
			}

			return {
				element: el,
				keep: keep,
				started: false
			};
		}

		function onElementChanged(opts) {
			// Arrow added
			if(
				opts.elems.length > 0 &&
				opts.elems[0] !== null &&
				opts.elems[0] === current_drawing_shape
			) {
				setArrow(opts.elems[0]);
				colorChanged(opts.elems[0]);
				current_drawing_shape = null;
				return;
			}

			// Check for color change or arrow deletion
			var needCleaning = false;
			for(var i = 0, l = opts.elems.length, el; i < l; ++i) {
				el = opts.elems[i];

				if(el == null) {
					continue;
				}

				if(el.parentElement != null && (
					el.getAttribute('marker-start') ||
					el.getAttribute('marker-mid') ||
					el.getAttribute('marker-end')
				)) {
					// Has marker, so see if it should match color
					colorChanged(el);
				} else if(el.parentElement == null && (
					el.getAttribute('marker-start') ||
					el.getAttribute('marker-mid') ||
					el.getAttribute('marker-end')
				)) {
					needCleaning = true;
				}
			}

			if(needCleaning) {
				cleanMarkers();
			}
		}

		return {
			svgicons: svgEditor.curConfig.extPath + 'ext-dx-arrows.xml',
			buttons: [{
				id: 'tool_dx_arrows',
				type: 'mode',
				position: 3,
				title: 'Arrow [A]',
				events: {
					click: function() {
						canv.setMode(mode_id);
					}
				}
			}],
			mouseDown: onMouseDown,
			mouseMove: onMouseMove,
			mouseUp: onMouseUp,
			elementChanged: onElementChanged
		};
	});
});
