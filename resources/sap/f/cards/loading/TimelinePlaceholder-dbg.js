/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/f/cards/loading/PlaceholderBase",
	"./TimelinePlaceholderRenderer"
], function (PlaceholderBase, TimelinePlaceholderRenderer) {
	"use strict";

	/**
	 * Constructor for a new <code>TimelinePlaceholder</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 *
	 * @extends sap.f.cards.loading.PlaceholderBase
	 *
	 * @author SAP SE
	 * @version 1.135.0
	 *
	 * @constructor
	 * @private
	 * @since 1.106
	 * @alias sap.f.cards.loading.TimelinePlaceholder
	 */
	var TimelinePlaceholder = PlaceholderBase.extend("sap.f.cards.loading.TimelinePlaceholder", {
		metadata: {
			library: "sap.f",
			properties: {

				/**
				 * The minimum number of items set to the timeline.
				 */
				minItems: {
					type : "int",
					group : "Misc"
				},

				/**
				 * Item template form the timeline.
				 */
				item: {
					type: "any"
				},

				itemHeight: {
					type: "sap.ui.core.CSSSize"
				}
			}
		},
		renderer: TimelinePlaceholderRenderer
	});

	return TimelinePlaceholder;
});
