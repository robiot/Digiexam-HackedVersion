/*globals svgEditor, $, DOMParser*/
/*jslint es5: true, vars: true, eqeq: true*/
svgEditor.ready(function() {
	svgEditor.addExtension('dx-shapes', function() {
		'use strict';

		var current_d, cur_shape_id;
		var canv = svgEditor.canvas;
		var cur_shape;
		var start_x, start_y;
		var svgroot = canv.getRootElem();
		var lastBBox = {};

		var extName = "dx-shapes";
		var mode_id = 'shapelib';

		var shapes = {
			rect: "M2.5,2.5 L2.5,102.5 L102.5,102.5 L102.5,2.5 L2.5,2.5 z",
			roundedRect: "M12.5,2.5 C12.5,2.5 2.5,2.5 2.5,12.5 C2.5,22.5 2.5,92.5 2.5,92.5 C2.5,92.5 2.5,102.5 12.5,102.5 C22.5,102.5 92.5,102.5 92.5,102.5 C92.5,102.5 102.5,102.5 102.5,92.5 C102.5,82.5 102.5,12.5 102.5,12.5 C102.5,12.5 102.5,2.5 92.5,2.5 C82.5,2.5 12.5,2.5 12.5,2.5 z",
			circle: "M100,150 C100,122.37569060773481 122.37569060773481,100 150,100 C177.6243093922652,100 200,122.37569060773481 200,150 C200,177.6243093922652 177.6243093922652,200 150,200 C122.37569060773481,200 100,177.6243093922652 100,150 Z",
			triangle: "M52.5,2.5 L2.5,102.5 L102.5,102.5 L52.5,2.5 z",
			star: "M300,17.97832264848789 321.91415105250474,69.83775868885817 378.00725072261423,74.65390779124402 335.4578412375519,111.52095100397999 348.2111323155104,166.35693088451202 300,137.28258061432368 251.78886768448962,166.35693088451202 264.5421587624481,111.52095100397999 221.99274927738577,74.65390779124404 278.08584894749526,69.83775868885817 300,17.97832264848789 321.91415105250474,69.83775868885817 z"
		};

		var startClientPos = {};

		var cur_shape_name = "rect";
		var cur_shape_data = shapes[cur_shape_name];

		function setShape(shape) {
			cur_shape_name = shape;
			cur_shape_data = shapes[shape];
		}

		function onMouseDown(opts) {
			var mode = canv.getMode();
			if (mode !== mode_id) {
				return;
			}

			start_x = opts.start_x;
			start_y = opts.start_y;
			var x = start_x;
			var y = start_y;
			var cur_style = canv.getStyle();

			cur_style.stroke_width = "5";

			startClientPos.x = opts.event.clientX;
			startClientPos.y = opts.event.clientY;

			cur_shape = canv.addSvgElementFromJson({
				'element': 'path',
				'curStyles': true,
				'attr': {
					'd': cur_shape_data,
					'id': canv.getNextId(),
					'opacity': cur_style.opacity / 2,
					'style': 'pointer-events:none',
					'stroke': cur_style.stroke,
					'fill': cur_style.fill
				}
			});

			// Make sure shape uses absolute values
			if (/[a-z]/.test(cur_shape_data)) {
				cur_shape_data = canv.pathActions.convertPath(cur_shape);
				cur_shape.setAttribute('d', cur_shape_data);
				canv.pathActions.fixEnd(cur_shape);
			}
			cur_shape.setAttribute('transform', 'translate(' + x + ',' + y + ') scale(0.005) translate(' + -x + ',' + -y + ')');

			canv.recalculateDimensions(cur_shape);

			var tlist = canv.getTransformList(cur_shape);

			lastBBox = cur_shape.getBBox();

			return {
				started: true
			};
		}

		function onMouseMove(opts) {
			var mode = canv.getMode();
			if (mode !== mode_id) {
				return;
			}

			var zoom = canv.getZoom();
			var evt = opts.event;

			var x = opts.mouse_x / zoom;
			var y = opts.mouse_y / zoom;

			var tlist = canv.getTransformList(cur_shape);
			var box = cur_shape.getBBox();
			var left = box.x, top = box.y, width = box.width;
			var height = box.height;
			var dx = x - start_x;
			var dy = y - start_y;

			var newbox = {
				'x': Math.min(start_x,x),
				'y': Math.min(start_y,y),
				'width': Math.abs(x-start_x),
				'height': Math.abs(y-start_y)
			};

			var tx = 0, ty = 0;
			var sy = height ? (height + dy) / height : 1;
			var sx = width ? (width + dx) / width : 1;

			sx = (newbox.width / lastBBox.width) || 1;
			sy = (newbox.height / lastBBox.height) || 1;

			// Not perfect, but mostly works...
			if (x < start_x) {
				tx = lastBBox.width;
			}

			if (y < start_y) {
				ty = lastBBox.height;
			}

			// update the transform list with translate,scale,translate
			var translateOrigin = svgroot.createSVGTransform();
			var scale = svgroot.createSVGTransform();
			var translateBack = svgroot.createSVGTransform();

			translateOrigin.setTranslate(-(left + tx), -(top + ty));
			if (evt.shiftKey) {
				var max = Math.min(Math.abs(sx), Math.abs(sy));

				sx = max * (sx < 0 ? -1 : 1);
				sy = max * (sy < 0 ? -1 : 1);
			}

			scale.setScale(sx, sy);

			translateBack.setTranslate(left + tx, top + ty);
			tlist.appendItem(translateBack);
			tlist.appendItem(scale);
			tlist.appendItem(translateOrigin);

			canv.recalculateDimensions(cur_shape);

			lastBBox = cur_shape.getBBox();
		}

		function onMouseUp(opts) {
			var mode = canv.getMode();
			if (mode !== mode_id) {
				return;
			}

			var keepObject = (opts.event.clientX != startClientPos.x && opts.event.clientY != startClientPos.y);

			return {
				keep: keepObject,
				element: cur_shape,
				started: false
			};
		}

		function onExtensionPostInitialization() {
			svgEditor.registerGlobalExtensionMethod(extName, "setShape", setShape);
		}

		return {
			svgicons: svgEditor.curConfig.extPath + 'ext-dx-shapes.xml',
			buttons: [{
				id: 'tool_dx_shapes',
				type: 'mode',
				position: 4,
				title: 'Shapes [S]',
				events: {
					click: function() {
						canv.setMode(mode_id);
					}
				}
			}],
			callback: onExtensionPostInitialization,
			mouseDown: onMouseDown,
			mouseMove: onMouseMove,
			mouseUp: onMouseUp
		};
	});
});
