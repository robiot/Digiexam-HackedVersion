/*globals svgEditor, svgedit, svgCanvas, $*/
/*jslint vars: true*/
/*
 * ext-dx-fill.js
 */

// Dependencies:
// 1) units.js
// 2) everything else
svgEditor.ready(function() {
	svgEditor.addExtension('dx_fill_tool', function() { 'use strict';

		function onClickTool() {
			if (svgEditor.toolButtonClick('#dx_fill_tool')) {
				svgEditor.canvas.setMode('fill');
			}
		}

		return {
			svgicons: svgEditor.curConfig.extPath + 'ext-dx-fill.xml',
			buttons: [{
				id: 'dx_fill_tool',
				title: 'Fill tool [F]',
				type: 'mode',
				customMode: true,
				position: 6,
				events: {
					click: onClickTool
				}
			}],
		};
	});

});
