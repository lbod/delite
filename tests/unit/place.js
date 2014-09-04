define([
	"require",
	"intern!object",
	"intern/chai!assert",
	"delite/place",
	"dojo/window", // TODO remove?
	"dojo/dom-geometry" // TODO remove?
], function (localRequire, registerSuite, assert, place, winUtils, domGeometry) {

	var container, styles = "body { " +
				"height: 100%; " +
				"padding: 0; " +
				"margin: 10px; " +
				"/* negative test for #16148; shouldn't affect placement unless body position relative/absolute */ " +
				"border: 0; " +
			"}" +
			".aroundNode {" +
				"position: absolute;" +
				"width: 20px;" +
				"height: 20px;" +
				"background: yellow;" +
			"}" +
			"#popup {" +
				"position: absolute;" +
				"width: 75px;" +
				"background: blue;" +
				"color: white;" +
			"}",
		containerInnerHTML = "<div id='aroundTop' class='aroundNode' style='top: 0; left: 50%'>T</div>" +
			"<div id='aroundLeft' class='aroundNode' style='bottom: 30%; left: 0;'>L</div>" +
			"<div id='aroundRight' class='aroundNode' style='bottom: 30%; right: 1px;'>R</div>" +
			"<div id='aroundBottom' class='aroundNode' style='bottom: 5px; left: 50%;'>B</div>" +
			"<div id='popup'>" +
			"I'm a drop down, wider and taller than the around nodes I'm placed next to." +
			"</div>",
		stylesElement = null,
		popup = null,
		aroundTop = null,
		aroundBottom = null,
		aroundLeft = null,
		aroundRight = null;


	registerSuite({
		name: "place",
		setup: function () {
			stylesElement = document.createElement("style");
			stylesElement.innerHTML = styles;
			document.head.appendChild(stylesElement);

			// Create some nodes for testing that styles are loaded correctly
			container = document.createElement("div");
			container.innerHTML = containerInnerHTML;
			document.body.appendChild(container);
			popup = document.getElementById("popup");
			aroundTop = document.getElementById("aroundTop");
			aroundBottom = document.getElementById("aroundBottom");
			aroundLeft = document.getElementById("aroundLeft");
			aroundRight = document.getElementById("aroundRight");
		},
		"at" : {
			"atTL" : function () {
				// Place popup at (10,7)... place.at() should choose the top-left corner, because
				// any of the other corner would make the popup go partially off the screen
				var ret = place.at(popup, {x: 10, y: 7}, ["TR", "BR", "BL", "TL"]);

				assert.strictEqual(ret.corner, "TL", "top left corner chosen");
				assert.strictEqual(popup.style.left, "10px", "x coord");
				assert.strictEqual(popup.style.top, "7px", "y coord");
				assert.strictEqual(ret.w, 75, "it's 75px wide");
			},
			"atToolTip" : function () {
				// Same as above test except that shape of drop down changes depending on where it's positioned.
				// Simulates tooltip placement (tooltip shape changes b/c of the arrow).

				function layoutNode(node, aroundCorner, nodeCorner) {
					node.style.width = (nodeCorner === "TL" ? "80px" : "75px");
				}

				var ret = place.at(
					popup,
					{x: 10, y: 7},		// center of aroundNode
					["TR", "BR", "BL", "TL"],
					{x: 5, y: 5},		// half of width and height of aroundNode
					layoutNode
				);

				assert.strictEqual(ret.corner, "TL", "popup's corner");
				assert.strictEqual(ret.aroundCorner, "BR", "around corner");
				assert.strictEqual(popup.style.width, "80px", "layout node width");
				popup.style.width = "75px";
			},
			"atTR" : function () {
				// Place popup at top right... place.at() should choose the top-right corner, because
				// any of the other corner would make the popup go partially off the screen
				var viewport = winUtils.getBox(),
					ret = place.at(popup, {x: viewport.w - 10, y: 7}, ["TL", "BR", "TR", "BL"]),
					popupCoords = domGeometry.position(popup);

				assert.strictEqual(ret.corner, "TR", "top left corner chosen");
				assert.strictEqual(popupCoords.x + popupCoords.w, viewport.w - 10, "x coord");
				assert.strictEqual(popup.style.top, "7px", "y coord");
				assert.strictEqual(ret.w, 75, "it's 75px wide");
			}
		},
		"around" : {
			"aroundT" : function () {
				// Dropdown from "aroundTop" node. Should pick the second choice, since the first
				// goes off screen.
				var ret = place.around(popup, aroundTop, [
					"above",	// aroundTop's top-left corner with the popup's bottom-left corner (fails)
					"below",	// aroundTop's bottom-left corner with the popup's top-left corner (works)
					"below-alt"	// aroundTop's bottom-right corner with the popup's top-right corner (works)
				], true);

				assert.strictEqual(ret.aroundCorner, "BL", "around corner");
				assert.strictEqual(ret.corner, "TL", "popup's corner");
				assert.strictEqual(popup.style.top, "20px", "underneath around node");
				assert.strictEqual(Math.round(popup.style.left.replace("px", "")),
					Math.round(domGeometry.position(aroundTop).x),
					"left sides aligned");
			},
			"aroundTooltip" : function () {
				// Same as above test except that shape of drop down changes depending on where it's positioned.
				// Simulates tooltip placement (tooltip shape changes b/c of the arrow).
				// Should pick the third choice this time

				function layoutNode(node, aroundCorner, nodeCorner) {
					node.style.width = (nodeCorner === "TL" ? "5000px" : "75px");
				}

				var ret = place.around(popup, aroundTop, [
					"above",	// aroundTop's top-left corner with the popup's bottom-left corner (fails)
					"below",	// aroundTop's bottom-left corner with the popup's top-left corner (works)
					"below-alt"	// aroundTop's bottom-right corner with the popup's top-right corner (works)
				], true, layoutNode);

				assert.strictEqual(ret.aroundCorner, "BR", "around corner");
				assert.strictEqual(ret.corner, "TR", "popup's corner");
				assert.strictEqual(popup.style.top, "20px", "underneath around node");
				assert.strictEqual(Math.round(domGeometry.position(popup).x + domGeometry.position(popup).w),
					Math.round(domGeometry.position(aroundTop).x + domGeometry.position(aroundTop).w),
					"right sides aligned");

			},
			"aroundB" : function () {
				// Dropdown from "aroundBottom" node. Should go above aroundNode so that
				// popup doesn't go offscreen
				var ret = place.around(popup, aroundBottom, [
					"below",	// aroundBottom's bottom-left corner with the popup's top-left corner (fails)
					"above",	// aroundBottom's top-left corner with the popup's bottom-left corner (works)
					"below-alt"	// aroundBottom's bottom-right corner with the popup's top-right corner (fails)
				], true);

				assert.strictEqual(ret.aroundCorner, "TL", "around corner");
				assert.strictEqual(ret.corner, "BL", "popup's corner");
				assert.strictEqual(Math.round(domGeometry.position(popup).y + domGeometry.position(popup).h),
					Math.round(domGeometry.position(aroundBottom).y), "above around node");
			},
			"aroundBM" : function () {
				// bottom middle popup from "aroundBottom" node
				var ret = place.around(popup, aroundBottom, [
					"above-centered",	// aroundBottom's top-middle with the popup's bottom-middle (works)
					"below-centered"	// aroundBottom's bottom-middle with the popup's top-middle (fails)
				], true);

				assert.strictEqual(ret.aroundCorner, "TM", "around middle");
				assert.strictEqual(ret.corner, "BM", "popup's middle");
				var popupPos = domGeometry.position(popup);
				var aroundPos = domGeometry.position(aroundBottom);
				assert.strictEqual(Math.round(popupPos.y + popupPos.h), Math.round(aroundPos.y), "above around node");
				assert.isTrue(aroundPos.x > popupPos.x, "starts before around node");
				assert.isTrue(aroundPos.x < (popupPos.x + popupPos.w), "ends after around node");
			},
			"aroundTM" : function () {
				// top middle popup from "aroundTop" node
				var ret = place.around(popup, aroundTop, [
					"above-centered",	// aroundTop's top-middle with the popup's bottom-middle (fails)
					"below-centered"	// aroundTop's bottom-middle with the popup's top-middle (works)
				], true);

				assert.strictEqual(ret.aroundCorner, "BM", "around middle");
				assert.strictEqual(ret.corner, "TM", "popup's middle");
				var popupPos = domGeometry.position(popup);
				var aroundPos = domGeometry.position(aroundTop);
				assert.strictEqual(Math.round(popupPos.y), Math.round(aroundPos.y + aroundPos.h), "below around node");
				assert.isTrue(aroundPos.x > popupPos.x, "starts before around node");
				assert.isTrue(aroundPos.x < (popupPos.x + popupPos.w), "ends after around node");

			},
			"aroundML" : function () {
				// middle left popup from "aroundLeft" node
				var ret = place.around(popup, aroundLeft, [
					"after-centered",	// aroundLeft's middle-right with the popup's middle-left (works)
					"before-centered"	// aroundLeft's middle-left with the popup's middle-right (fails)
				], true);

				assert.strictEqual(ret.aroundCorner, "MR", "around middle");
				assert.strictEqual(ret.corner, "ML", "popup's middle");
				var popupPos = domGeometry.position(popup);
				var aroundPos = domGeometry.position(aroundLeft);
				assert.strictEqual(Math.round(popupPos.x), Math.round(aroundPos.x + aroundPos.w), "after around node");
				assert.isTrue(aroundPos.y > popupPos.y, "starts before around node");
				assert.isTrue(aroundPos.y < (popupPos.y + popupPos.h), "ends after around node");
			},
			"aroundMR" : function () {
				// middle left popup from "aroundRight" node
				var ret = place.around(popup, aroundRight, [
					"after-centered",	// aroundRight's middle-right with the popup's middle-left (fails)
					"before-centered"	// aroundRight's middle-left with the popup's middle-right (works)
				], true);

				assert.strictEqual(ret.aroundCorner, "ML", "around middle");
				assert.strictEqual(ret.corner, "MR", "popup's middle");
				var popupPos = domGeometry.position(popup);
				var aroundPos = domGeometry.position(aroundRight);
				assert.strictEqual(Math.round(aroundPos.x), Math.round(popupPos.x + popupPos.w), "before around node");
				assert.isTrue(aroundPos.y > popupPos.y, "starts before around node");
				assert.isTrue(aroundPos.y < (popupPos.y + popupPos.h), "ends after around node");
			},
			"aroundMLB" : function () {
				// This will put the drop-down below the "aroundLeft" node, first trying to right-align
				// but since that doesn't work then trying to left-align.
				var ret = place.around(popup, aroundLeft, ["below-alt"], true);

				assert.strictEqual(ret.aroundCorner, "BL", "around left");
				assert.strictEqual(ret.corner, "TL", "popup's left");
				var popupPos = domGeometry.position(popup);
				var aroundPos = domGeometry.position(aroundLeft);
				assert.strictEqual(Math.round(popupPos.y), Math.round(aroundPos.y + aroundPos.h), "below around node");
				assert.strictEqual(popupPos.x, aroundPos.x, "left aligned with around node");
			},
			"aroundMRT" : function () {
				// This will put the drop-down above the "aroundRight" node, first trying to left-align
				// but since that doesn't work then trying to right-align.
				var ret = place.around(popup, aroundRight, ["above"], true);

				assert.strictEqual(ret.aroundCorner, "TR", "around right");
				assert.strictEqual(ret.corner, "BR", "popup's right");
				var popupPos = domGeometry.position(popup);
				var aroundPos = domGeometry.position(aroundRight);
				assert.strictEqual(Math.round(popupPos.x + popupPos.w), Math.round(aroundPos.x + aroundPos.w),
					"right aligned with around node");
				assert.strictEqual(Math.round(popupPos.y + popupPos.h), Math.round(aroundPos.y),
					"above around node");
			},
			"svgAnchor" : function () {
				document.body.insertAdjacentHTML("beforeend",
					"<div id='svgWrapper' style='position: relative; top: 100px; left: 100px;'>" +
						"<svg xmlns='http://www.w3.org/2000/svg' version='1.1'>" +
						"<rect id='theRectangle' width='300' height='100' " +
						"style='fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)' />" +
						"</svg>" +
						"</div>"
				);

				var theRectangle = document.getElementById("theRectangle");
				place.around(popup, theRectangle, ["before", "after"], true);

				var textboxPos = domGeometry.position(theRectangle);
				var popupContainerPos = domGeometry.position(popup);

				var xDiff = textboxPos.x - popupContainerPos.x - popupContainerPos.w;
				var toTheLeft = xDiff >= -1 && xDiff < 2;

				xDiff = popupContainerPos.x - textboxPos.x - textboxPos.w;
				var toTheRight = xDiff >= -1 && xDiff < 2;

				assert.isTrue(toTheLeft || toTheRight, "The popup was not to the left or right");
			}
		},
		teardown: function () {
			container.parentNode.removeChild(container);
			popup.parentNode.removeChild(popup);
			document.head.removeChild(stylesElement);
			var svgWrapper = document.getElementById("svgWrapper");
			svgWrapper.parentNode.removeChild(svgWrapper);

		}
	});
});
