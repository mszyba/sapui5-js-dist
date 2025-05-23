/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Design Time Metadata for the sap.f.DynamicPage control
sap.ui.define([],
	function() {
	"use strict";

	return {
		aggregations : {
			title : {
				domRef : ":sap-domref .sapFDynamicPageTitle"
			},
			header : {
				domRef : ":sap-domref .sapFDynamicPageHeader"
			},
			content : {
				domRef :  ":sap-domref .sapFDynamicPageContent"
			},
			footer : {
				domRef : ":sap-domref .sapFDynamicPageActualFooterControl"
			},
			landmarkInfo: {
				ignore: true
			}
		},
		scrollContainers : [{
				domRef : "> .sapFDynamicPageContentWrapper",
				aggregations : function(oElement, fnUpdateFunction) {
					oElement.attachEventOnce("_moveHeader", function() {
						fnUpdateFunction({
							index: 0
						});
					});
					if (oElement._bHeaderInTitleArea || oElement._bPinned || oElement.getPreserveHeaderStateOnScroll()) {
						return ["content"];
					} else {
						return ["header", "content"];
					}
				}
			},
			{
				domRef : function(oElement) {
					return oElement.$("vertSB-sb").get(0);
				}
			}],
		templates: {
			create: "sap/f/designtime/DynamicPage.create.fragment.xml"
		}
	};

});
