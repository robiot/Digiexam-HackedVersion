/*globals svgEditor, $, DOMParser*/
/*jslint es5: true, vars: true, eqeq: true*/
svgEditor.addExtension('dx-stroke-colorpicker', function() {'use strict';
	return {
		svgicons: svgEditor.curConfig.extPath + 'ext-dx-colorpicker.xml',
		buttons: [{
			id: 'tool_dx_stroke_colorpicker',
			type: 'mode',
			title: 'Stroke color',
			events: {
				click: function() {

				}
			}
		}]
	};
});

