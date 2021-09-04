(function() {
	"use strict";

	var optionsPanelContainer = null;
	var activeToolPanels = new Map();

	var noBindingIds = ["tool_dx_fill_colorpicker", "tool_dx_stroke_colorpicker"];

	$(document).ready(onDocumentReady);

	window.dxTopMenu = {
		clear: function () {
			initContainer();
			activateToolPanel("#tool_select");
		}
	};

	function initContainer() {
		if (!optionsPanelContainer) {
			optionsPanelContainer = document.getElementById("dx-tool-options");
		}
	}

	function onDocumentReady() {
		initContainer();
		setupToolButtonEvents();

		/*
			Tool initialization
		*/
		initPencilOptions();
		initShapeOptions();
		initTextOptions();
		initGridOptions();
	}

	function setupToolButtonEvents() {
		var tool_buttons = Array.prototype.slice.call(document.querySelectorAll("#tools_left .tool_button, #tools_left .tool_button_current"));
		tool_buttons = tool_buttons.filter(function(btn) {
			if(noBindingIds.indexOf(btn.id) !== -1) {
				return false;
			}

			return true;
		});

		for(var i = 0, l = tool_buttons.length; i < l; ++i) {
			tool_buttons[i].addEventListener("click", onToolButtonClick);
		}

		setupToolButtonMutationObserver();
	}

	function setupToolButtonMutationObserver() {
		var observer = new MutationObserver(function(mutation) {
			mutation.forEach(function(mutationRecord) {
				for(var i = 0, l = mutationRecord.addedNodes.length; i < l; ++i) {
					if(noBindingIds.indexOf(mutationRecord.addedNodes[i].id) !== -1) {
						continue;
					}

					mutationRecord.addedNodes[i].addEventListener("click", onToolButtonClick);
				}
			});
		});

		var tools_left = document.getElementById("tools_left");
		observer.observe(tools_left, { childList: true });
	}

	function hidePanel(panel) {
		panel.classList.remove("dx-tool-options-visible");
	}

	function onToolButtonClick(e) {
		var toolId = this.getAttribute("id");
		activateToolPanel("#" + toolId);
	}

	function resetToolPanel(panel) {
		hidePanel(panel);
		activeToolPanels.delete(panel);
	}

	function resetNonPersistentToolPanels(newToolId) {
		activeToolPanels.forEach(function(panelInfo) {
			if(!panelInfo.persistent && !panelInfo.toggleable) {
				resetToolPanel(panelInfo.panel);
			} else if(panelInfo.toggleable) {
				hidePanel(panelInfo.panel);
			}
		});
	}

	function getTitleFromOptionsPanel(panel, toolId) {
		var ids = panel.getAttribute("data-tool-id").split(",");
		var titles = panel.getAttribute("data-tool-title");

		var index = ids.indexOf(toolId);
		if(titles == null || index === -1) {
			return null;
		}

		return titles.split(",")[index];
	}

	function getOptionsPanelById(toolId) {
		var panels = optionsPanelContainer.querySelectorAll('[data-tool-id]');
		var panel = null;
		for(var i = 0, l = panels.length, ids; i < l; ++i) {
			ids = panels[i].getAttribute("data-tool-id").split(",");

			if(ids.indexOf(toolId) !== -1) {
				return {
					panel: panels[i],
					id: toolId,
					title: getTitleFromOptionsPanel(panels[i], toolId),
					toggleable: panels[i].getAttribute("data-tool-toggleable") != null,
					persistent: panels[i].getAttribute("data-tool-persistent") != null
				};
			}
		}

		return null;
	}

	function isPanelActive(panel) {
		return activeToolPanels.has(panel);
	}

	function activateToolPanel(toolId) {
		var panelInfo = getOptionsPanelById(toolId);

		if (toolId === '#dx_view_grid') {
			let element = document.getElementsByClassName("dx-grid-snap-container dx-grid-snap-container-visible")[0];

			if (!element) {
				document.getElementsByClassName("dx-grid-snap-container")[0].classList.add("dx-grid-snap-container-visible");
			} else {
				element.classList.remove("dx-grid-snap-container-visible");
			}
			
			return 
		}

		if(panelInfo === null) {
			resetNonPersistentToolPanels();
			return;
		}

		if((panelInfo.persistent || panelInfo.toggleable) && isPanelActive(panelInfo.panel)) {
			resetToolPanel(panelInfo.panel);
			return;
		}

		if(!panelInfo.persistent) {
			resetNonPersistentToolPanels();
		}

		if(panelInfo.title !== null) {
			panelInfo.panel.children[0].innerHTML = panelInfo.title;
		}

		panelInfo.panel.classList.add("dx-tool-options-visible");

		activeToolPanels.set(panelInfo.panel, panelInfo);
	}

	/*
		Pencil options
	*/
	function initPencilOptions() {
		var $strokeRange = $(".dx-pencil-options .dx-pencil-tool-range");

		var currentStrokeWidth = svgEditor.canvas.getStrokeWidth();
		$strokeRange.val(currentStrokeWidth);

		$(".dx-pencil-options .dx-pencil-tool-range").on("input", onRangeChange);

		function onRangeChange(event) {
			var value = +event.target.value;
			svgEditor.canvas.setStrokeWidth(value);
		}
	}

	/*
		Shape options
	*/
	function initShapeOptions() {
		var $opts = $(".dx-shape-options");
		var $btns = $opts.find(".dx-shape-icon");

		var selected_shape_name = "rect";
		var selectedBtnClassname = 'dx-shape-selected';

		var selectedBtn;

		setBtnActive(
			$btns.filter(".dx-shape-" + "rect").get(0)
		)

		$btns.on("click", onShapeBtnClick);

		function onShapeBtnClick(event) {
			var setShapeFn = svgEditor.getGlobalExtensionMethod("dx-shapes", "setShape");
			var shape = event.target.getAttribute("data-shape");
			setShapeFn(shape);
			setBtnActive(event.target);
		}

		function setBtnActive(btn) {
			if(selectedBtn != null) {
				selectedBtn.classList.remove(selectedBtnClassname);
			}

			selectedBtn = btn;
			btn.classList.add(selectedBtnClassname);
		}
	}

	function initTextOptions() {
		var $panel = $(".dx-text-options");

		$panel.find(".dx-text-option-size").on("input", onTextSizeChange);
		$panel.find(".dx-text-option-size").val(svgEditor.canvas.getFontSize());

		function onTextSizeChange(event) {
			svgEditor.canvas.setFontSize(+event.target.value);
		}
	}

	/*
		Grid options
	*/
	function initGridOptions() {
		var $panel = $(".dx-grid-snap-container");

		$panel.find('.dx-grid-option-snap').on("change", onSnapChange);

		function onSnapChange(event) {
			var setSnapFn = svgEditor.getGlobalExtensionMethod("dx_view_grid", "setSnap");
			var checked = +event.target.checked;
			setSnapFn(checked);
		}
	}
}());
