/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/f/cards/loading/PlaceholderBase",
	"./GenericPlaceholderRenderer"
], function (PlaceholderBase, GenericPlaceholderRenderer) {
	"use strict";

	/**
	 * Constructor for a new <code>loading</code>.
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
	 * @since 1.76
	 * @alias sap.f.cards.loading.GenericPlaceholder
	 */
	var GenericPlaceholder = PlaceholderBase.extend("sap.f.cards.loading.GenericPlaceholder", {
		metadata: {
			library: "sap.f"
		},
		renderer: GenericPlaceholderRenderer
	});

	return GenericPlaceholder;
});
