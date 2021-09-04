/*globals svgEditor, $, DOMParser*/
/*jslint es5: true, vars: true, eqeq: true*/
svgEditor.ready(function() {
	svgEditor.addExtension("dx-fill-colorpicker", function() {
		"use strict";

		var canvas = svgEditor.canvas;

		var colors = [
			["#FFFFFF", "#333333", "#ED0A1C", "#FF8400", "#FFF345", "#19B50B", "#31A0EB", "#0000C2"],
			["#A5A5A5", "#B35C42", "#FFD257", "#F2F1BB", "#B7E856", "#BAFFFF", "#FFB8CF", "#8C17A1"]
		];
		var is_showing = false;

		var cur_colors = {
			stroke: canvas.getStyle().stroke
		};

		var cur_mode = null;

		var $palette;
		var $strokeIcon;

		var selectedElements = [];

		function createIcons() {
			var $stroke = $('<div class="dx-colorpicker-palette-icon-outer"><div class="dx-colorpicker-palette-icon dx-colorpicker-stroke"></div></div>');
			$strokeIcon = $stroke.find(".dx-colorpicker-palette-icon");

			$('#tool_dx_stroke_colorpicker').empty().append($stroke);
		}

		function setIconColor() {
			// Only set the icon color of stroke
			$strokeIcon.css({
				'border-color': cur_colors.stroke
			});
		}

		function addColorsToPalette() {
			var cellTemplate = '<td class="dx-colorpicker-palette-color" data-color="%s" style="background-color: %s;" />';
			var rowTemplate = '<tr />';

			var rows = [];
			for(var i = 0, l = colors.length, $row; i < l; ++i) {
				$row = $(rowTemplate);
				for(var x = 0, ll = colors[i].length, $cell, color; x < ll; ++x) {
					color = colors[i][x];
					$cell = $(cellTemplate.replace(/%s/g, color));
					$cell.on("click", selectColor);

					$row.append($cell);
				}

				rows.push($row.get(0));
			}

			$palette.append(rows);
		}

		function resetSelectedColors() {
			$palette.find(".dx-colorpicker-palette-color-selected").removeClass("dx-colorpicker-color-selected");
		}

		function markPaletteColorAsSelected() {
			resetSelectedColors();
			if(cur_mode !== "fill") {
				$palette.find('[data-color="' + cur_colors[cur_mode].toLowerCase() + '"]').addClass("dx-colorpicker-color-selected");
			}
		}

		function createPalette() {
			return $('<table class="dx-colorpicker-palette" />');
		}

		function positionPalette() {
			var $parent = $("#tool_dx_" + cur_mode + "_colorpicker");
			var offset = $parent.offset();
			var parentWidth = $parent.innerWidth();
			var parentHeight = $parent.innerHeight();
			var paletteHeight = $($palette).innerHeight();

			$palette.css({
				left: offset.left + parentWidth,
				top: offset.top + (parentHeight / 2) - (paletteHeight / 2)
			});
		}

		function showPalette(mode) {
			cur_mode = mode;
			is_showing = true;

			positionPalette();
			if(selectedElements.length === 0) {
				markPaletteColorAsSelected();
			} else {
				resetSelectedColors();
			}

			$palette.show();
		}

		function hidePalette() {
			$palette.hide();
			is_showing = false;
			cur_mode = null;
		}

		function selectColor(event) {
			var $target = $(event.target);
			var color = $target.attr("data-color");
			var paint = new $.jGraduate.Paint({ solidColor: color.substr(1) });

			canvas.setStrokePaint(paint);

			if(selectedElements.length > 0) {
				for(var i = 0, l = selectedElements.length, el; i < l; ++i) {
					el = selectedElements[i];
					el.setAttribute("stroke", color);
				}
			}

			cur_colors[cur_mode] = color;

			setIconColor();

			if(selectedElements.length === 0) {
				hidePalette();
			}
		}

		function onExtensionPostInitialization() {
			createIcons();
			setIconColor();

			$palette = createPalette();
			addColorsToPalette();

			$("body").append($palette);
		}

		function onSelectionChanged(opts) {
			var elems = opts.elems || [];
			var selected = [];
			for(var i = 0, l = elems.length; i < l; ++i) {
				if(elems[i] != null) {
					selected.push(elems[i]);
				}
			}

			selectedElements = selected;
		}

		function onMouseDown() {
			if(!is_showing) {
				return;
			}

			hidePalette();
		}

		function onClickTool(tool) {
			return function() {
				if(!is_showing || cur_mode != null && cur_mode != tool) {
					showPalette(tool);
				} else {
					hidePalette();
				}
			}
		}

		return {
			buttons: [
				{
					id: "tool_dx_stroke_colorpicker",
					type: "mode",
					title: "Color [C]",
					// Hack to allow the button to exist in the left toolbar but not work as a "mode"
					// @TODO (Rasmus) Create a custom type instead
					customMode: true,
					events: {
						click: onClickTool("stroke")
					}
				}
			],
			callback: onExtensionPostInitialization,
			selectedChanged: onSelectionChanged,
			mouseDown: onMouseDown
		};
	});
});
