/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
* Provides a private class <code>sap.f.semantic.SemanticContainer</code>.
*/
sap.ui.define([
	"sap/ui/base/EventProvider",
	"./SemanticConfiguration",
	"sap/base/Log"
], function(EventProvider, SemanticConfiguration, Log) {
	"use strict";

	/**
	* Constructor for a <code>sap.f.semantic.SemanticContainer</code>.
	*
	* The base class for the <code>sap.f.semantic.SemanticTitle</code> and  <code>sap.f.semantic.SemanticFooter</code>.
	*
	* @private
	* @since 1.46.0
	* @alias sap.f.semantic.SemanticContainer
	*/
	var SemanticContainer = EventProvider.extend("sap.f.semantic.SemanticContainer", {
		constructor : function(oContainer, oParent) {
			if (!oContainer) {
				Log.error("SemanticContainer :: missing argument - container reference", this);
				return;
			}

			EventProvider.apply(this, arguments);

			this._oContainer = oContainer;
			this._oParent = oParent;
		},
		getInterface: function() {
			return this; // no facade
		}
	});

	/**
	* Returns the container control, used to hold ui5 controls.
	*
	* @returns {sap.ui.core.Control}
	*/
	SemanticContainer.prototype._getContainer = function() {
		return this._oContainer;
	};

	/**
	 * Returns the parent control.
	 *
	 * @returns {sap.ui.core.Control}
	 */
	SemanticContainer.prototype._getParent = function() {
		return this._oParent;
	};

	/**
	 * Returns the shouldBePreprocessed state of a <code>SemanticControl</code>,
	 * defined in <code>sap.f.semantic.SemanticConfiguration</code>.
	 *
	 * @param {sap.f.semantic.SemanticControl} oControl
	 * @returns {boolean}
	 */
	SemanticContainer.prototype._shouldBePreprocessed = function(oControl) {
		var sType = (oControl._getType && oControl._getType()) || oControl.getMetadata().getName();

		return SemanticConfiguration.shouldBePreprocessed(sType);
	};

	/**
	* Returns the order of a <code>SemanticControl</code> instance,
	* defined in <code>sap.f.semantic.SemanticConfiguration</code>.
	*
	* @param {sap.f.semantic.SemanticControl} oControl
	* @returns {int}
	*/
	SemanticContainer.prototype._getControlOrder = function(oControl) {
		var sType = (oControl._getType && oControl._getType()) || oControl.getMetadata().getName();

		return SemanticConfiguration.getOrder(sType);
	};

	/**
	* Returns the constraint of a <code>SemanticControl</code> instance,
	* defined in <code>sap.f.semantic.SemanticConfiguration</code>.
	* The constraints might be <code>IconOnly</code> and <code>Navigation</code>.
	*
	* @param {sap.f.semantic.SemanticControl | sap.m.Button} oControl
	* @returns {string}
	*/
	SemanticContainer.prototype._getConstraints = function(oControl) {
		return SemanticConfiguration.getConstraints(oControl.getMetadata().getName());
	};

	/**
	* Returns the internal control of a <code>SemanticControl</code> instance.
	*
	* <b>Note:</b> If the method is applied on a non-semantic control,
	* the method will return the non-semantic control itself.
	*
	* @param {sap.f.semantic.SemanticControl | sap.m.Button} oControl
	* @returns {sap.f.semantic.SemanticControl | sap.m.Button}
	*/
	SemanticContainer.prototype._getControl = function(oControl) {
		return oControl._getControl ? oControl._getControl() : oControl;
	};

	/**
	* Determines if the <code>SemanticControl</code> is a <code>sap.f.semantic.MainAction</code>.
	*
	* @returns {boolean}
	*/
	SemanticContainer.prototype._isMainAction = function(oControl) {
		return SemanticConfiguration.isMainAction(oControl.getMetadata().getName());
	};

	/**
	* Determines if the <code>SemanticControl</code> is a <code>Navigation</code> action,
	* such as  <code>sap.f.semantic.FullScreenAction</code> and <code>sap.f.semantic.CloseAction</code>.
	*
	* @returns {boolean}
	*/
	SemanticContainer.prototype._isNavigationAction = function(oControl) {
		return SemanticConfiguration.isNavigationAction(oControl.getMetadata().getName());
	};

	/**
	* Calls container`s method.
	*
	* @param {string} sMethod the method to be called
	* @returns {Object | Array<T>}
	*/
	SemanticContainer.prototype._callContainerAggregationMethod = function(sMethod) {
		return this._getContainer()[sMethod].apply(this._getContainer(), Array.prototype.slice.call(arguments).slice(1));
	};

	/**
	* Sorts the <code>SemanticControl</code> instances by the order
	* defined in the <code>sap.f.semantic.SemanticConfiguration</code>.
	*
	* @param {sap.f.semantic.SemanticControl} oControlA
	* @param {sap.f.semantic.SemanticControl} oControlB
	* @returns {int}
	*/
	SemanticContainer.prototype._sortControlByOrder = function(oControlA, oControlB) {
		return this._getControlOrder(oControlA) - this._getControlOrder(oControlB);
	};

	SemanticContainer.prototype.destroy = function() {
		this._oParent = null;
		this._oContainer = null;
	};

	return SemanticContainer;

});