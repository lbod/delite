define([
	"delite/register",
	"delite/Widget",
	"delite/handlebars!./template/AttachNodeWidget.html",
	"delite/css!./css/AttachNodeWidget.css"
], function (register, Widget, template) {
	return register("attach-node-element", [HTMLElement, Widget], {
		baseClass: "attach-node-element",

		someProperty: "",
		template: template
	});
});
