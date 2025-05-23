/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Provides a private class <code>sap.f.semantic.SemanticShareMenu</code>.
 */
sap.ui.define([
	"sap/ui/core/IconPool",
	"sap/ui/base/EventProvider",
	"sap/ui/base/ManagedObjectObserver",
	"sap/ui/Device",
	"sap/ui/core/Lib",
	"sap/ui/core/ShortcutHintsMixin",
	"sap/ui/core/library",
	"sap/m/library",
	"sap/m/OverflowToolbarButton",
	"sap/m/OverflowToolbarLayoutData",
	"./SemanticContainer"
], function(
	IconPool,
	EventProvider,
	ManagedObjectObserver,
	Device,
	Library,
	ShortcutHintsMixin,
	coreLibrary,
	mobileLibrary,
	OverflowToolbarButton,
	OverflowToolbarLayoutData,
	SemanticContainer
) {
	"use strict";

	// shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	// shortcut for sap.ui.core.aria.HasPopup
	var AriaHasPopup = coreLibrary.aria.HasPopup;

	/**
	* Constructor for a <code>sap.f.semantic.SemanticShareMenu</code>.
	*
	* @private
	* @since 1.46.0
	* @alias sap.f.semantic.SemanticShareMenu
	*/
	var SemanticShareMenu = SemanticContainer.extend("sap.f.semantic.SemanticShareMenu", {
		constructor : function(oContainer, oParent) {
			SemanticContainer.call(this, oContainer, oParent);

			this._aShareMenuActions = [];
			this._aCustomShareActions = [];
			this._oObserver = new ManagedObjectObserver(SemanticShareMenu.prototype._onShareMenuButtonChanges.bind(this));
			this._onShareButtonClickRef = this._onShareButtonClick.bind(this);

			this._setMode(SemanticShareMenu._Mode.initial);
		}
	});

	/*
	* Static member
	*/
	SemanticShareMenu._Mode = {
		/**
		* In <code>initial</code> mode, the menu is empty and hidden.
		*/
		initial: "initial",

		/**
		* In "menu" mode, the menu consists of:
		* (1) an actionSheet containing all of the menu items and
		* (2) a dedicated button that only opens the ShareMenu.
		*/
		menu: "menu"
	};

	/*
	* CUSTOM SHARE ACTIONS aggregation methods.
	*/

	SemanticShareMenu.prototype.addCustomAction = function(oCustomControl) {
		this._onControlAdded(oCustomControl);
		this._oObserver.observe(oCustomControl, {
			properties: ["visible"]
		});

		this._callContainerAggregationMethod("insertButton", oCustomControl, this._getCustomActionInsertIndex());
		this._aCustomShareActions.push(oCustomControl);
		return this;
	};

	SemanticShareMenu.prototype.insertCustomAction = function(oCustomControl, iIndex) {
		if (this._aCustomShareActions.indexOf(oCustomControl) < 0) {
			this._onControlAdded(oCustomControl);
			this._oObserver.observe(oCustomControl, {
				properties: ["visible"]
			});
			this._aCustomShareActions.splice(iIndex, 0, oCustomControl);
		}

		this._callContainerAggregationMethod("insertButton", oCustomControl, this._getCustomActionInsertIndex(iIndex));

		return this;
	};

	SemanticShareMenu.prototype.getCustomActions = function() {
		return this._aCustomShareActions.slice();
	};

	SemanticShareMenu.prototype.indexOfCustomAction = function(oCustomControl) {
		return this._aCustomShareActions.indexOf(oCustomControl);
	};

	SemanticShareMenu.prototype.removeCustomAction = function(oCustomControl) {
		var vResult = this._callContainerAggregationMethod("removeButton", oCustomControl);
		this._oObserver.unobserve(oCustomControl, {
			properties: ["visible"]
		});

		this._aCustomShareActions.splice(this._aCustomShareActions.indexOf(oCustomControl), 1);
		this._onControlRemoved();
		return vResult;
	};

	SemanticShareMenu.prototype.removeAllCustomActions = function() {
		var aResult = [];

		this._aCustomShareActions.forEach(function(oCustomControl){
			var vResult = this._callContainerAggregationMethod("removeButton", oCustomControl);
			if (vResult) {
				aResult.push(oCustomControl);
			}
		}, this);

		this._aCustomShareActions = [];
		this._onControlRemoved();
		return aResult;
	};

	SemanticShareMenu.prototype.destroyCustomActions = function() {
		this.removeAllCustomActions(true).forEach(
			function(oCustomControl){
				oCustomControl.destroy();
			});

		return this;
	};

	/*
	* SEMANTIC SHARE MENU ACTIONS
	*/

	/*
	* Adds a <code>sap.f.semantic.SemanticControl</code> to the container.
	*
	* @param {sap.f.semantic.SemanticControl} oSemanticControl
	* @returns {this}
	*/
	SemanticShareMenu.prototype.addContent = function (oSemanticControl) {
		var oControl = this._getControl(oSemanticControl);

		if (this._aShareMenuActions.indexOf(oSemanticControl) < 0) {
			this._onControlAdded(oControl);
			this._oObserver.observe(oControl, {
				properties: ["visible"]
			});
			this._aShareMenuActions.push(oSemanticControl);
		}

		this._preProcessOverflowToolbarButton(oControl);
		this._callContainerAggregationMethod("insertButton", oControl, this._getSemanticActionInsertIndex(oSemanticControl));
		return this;
	};

	/*
	* Removes the <code>sap.f.semantic.SemanticControl</code> from the container.
	*
	* @param {sap.f.semantic.SemanticControl} oSemanticControl
	* @returns {sap.f.semantic.SemanticFooter}
	*/
	SemanticShareMenu.prototype.removeContent = function (oSemanticControl) {
		var oControl = this._getControl(oSemanticControl);
		this._oObserver.unobserve(oControl, {
			properties: ["visible"]
		});

		this._callContainerAggregationMethod("removeButton", oControl);
		this._aShareMenuActions.splice(this._aShareMenuActions.indexOf(oSemanticControl), 1);
		this._postProcessOverflowToolbarButton(oSemanticControl);
		this._onControlRemoved();
		return this;
	};

	/*
	 * Destroys all the actions - custom and semantic
	 * and cleans all the references in use.
	 *
	 * @returns {this}
	 */
	SemanticShareMenu.prototype.destroy = function() {
		if (this._oShareMenuBtn) {
			this._oShareMenuBtn.destroy();
		}
		this._oShareMenuBtn = null;
		this._aShareMenuActions = null;
		this._aCustomShareActions = null;

		return SemanticContainer.prototype.destroy.call(this);
	};

	SemanticShareMenu.prototype.exit = function () {
		this._oObserver.disconnect();
		this._oObserver = null;
	};

	/*
	* PRIVATE METHODS
	*/

	/*
	* Returns the current mode - <code>initial</code>, <code>button</code> or <code>actionSheet</code>.
	*
	* @returns {string}
	*/
	SemanticShareMenu.prototype._getMode = function() {
		return this._mode;
	};


	/*
	 * Sets the <code>ShareMenu</code> mode - <code>initial</code>, <code>button</code> or <code>actionSheet</code>.
	 *
	 * @param {string} sMode
	 * @returns {this}
	 */
	SemanticShareMenu.prototype._setMode = function (sMode) {
		if (this._getMode() === sMode) {
			return this;
		}

		if (sMode === SemanticShareMenu._Mode.initial) {

			if (this._getMode()) {
				this._fireContentChanged(true); // the ShareMenu is empty.
			}

			this._mode = SemanticShareMenu._Mode.initial;
			return this;
		}

		if (sMode === SemanticShareMenu._Mode.menu) {
			this._mode = SemanticShareMenu._Mode.menu;
			this._fireContentChanged(false); // the ShareMenu is not empty anymore.
		}

		return this;
	};

	/*
	* Fires an internal event to notify that the <code>ShareMenu</code> content has been changed.
	*
	* @private
	*/
	SemanticShareMenu.prototype._fireContentChanged = function (bEmpty) {
		EventProvider.prototype.fireEvent.call(this._getParent(), "_shareMenuContentChanged", {"bEmpty" : bEmpty});
	};


	SemanticShareMenu.prototype._onShareButtonClick = function () {
		var oContainer = this._getContainer();

		oContainer.openBy(this._oShareMenuBtn);
	};

	SemanticShareMenu.prototype._getVisibleActions = function () {
		var aAllActions = this._aShareMenuActions.concat(this._aCustomShareActions),
			aVisibleActions = aAllActions.map(function (oAction) {
				return this._getControl(oAction);
			}, this).filter(function (oButton) {
				return oButton.getVisible();
			});

		return aVisibleActions;
	};

	SemanticShareMenu.prototype._onShareMenuButtonChanges = function () {
		var aVisibleActions = this._getVisibleActions();

		this._getShareMenuButton().setVisible(aVisibleActions.length > 1);

		this.fireEvent("_visibleActionsChanged", { "visibleActionsCount": aVisibleActions.length });
	};


	/*
	* Retrieves the <code>ShareMenu</code> button.
	*
	* @returns {sap.m.Button}
	*/
	SemanticShareMenu.prototype._getShareMenuButton = function() {
		var oContainer, oResourceBundle, sShortcutKey;

		if (!this._oShareMenuBtn) {
			oContainer = this._getContainer();
			oResourceBundle = Library.getResourceBundleFor("sap.f");
			sShortcutKey = "SEMANTIC_CONTROL_ACTION_SHARE_SHORTCUT"; // Ctrl+Shift+S

			if (Device.os.macintosh) {
				sShortcutKey += "_MAC"; // Cmd+Shift+S
			}

			this._oShareMenuBtn = new OverflowToolbarButton(oContainer.getId() + "-shareButton", {
				ariaHasPopup: AriaHasPopup.Menu,
				icon: IconPool.getIconURI("action"),
				tooltip: oResourceBundle.getText("SEMANTIC_CONTROL_ACTION_SHARE"),
				layoutData: new OverflowToolbarLayoutData({
					closeOverflowOnInteraction: false
				}),
				text: oResourceBundle.getText("SEMANTIC_CONTROL_ACTION_SHARE"),
				type: ButtonType.Transparent,
				press: this._onShareButtonClickRef
			});

			ShortcutHintsMixin.addConfig(this._oShareMenuBtn, {
				addAccessibilityLabel: true,
				message: oResourceBundle.getText(sShortcutKey)
			});
		}

		return this._oShareMenuBtn;
	};

	/*
	* Determines the insert index of the custom controls to be added.
	*
	* @param {int} iIndex
	* @returns {int}
	*/
	SemanticShareMenu.prototype._getCustomActionInsertIndex = function(iIndex) {
		var iCustomActionsCount = this._aCustomShareActions.length;

		if (iIndex === undefined) {
			return this._aShareMenuActions.length + iCustomActionsCount;
		}

		iIndex = iIndex >= iCustomActionsCount ? iCustomActionsCount : iIndex;
		iIndex += this._aShareMenuActions.length;
		return iIndex;
	};

	/*
	* Determines the insert index of the semantic controls to be added.
	*
	* @param {sap.f.semantic.SemanticControl} oSemanticControl
	* @returns {int}
	*/
	SemanticShareMenu.prototype._getSemanticActionInsertIndex = function(oSemanticControl) {
		this._aShareMenuActions.sort(this._sortControlByOrder.bind(this));
		return this._aShareMenuActions.indexOf(oSemanticControl);
	};

	/*
	 * Returns <code>false</code>, if the current mode is <code>Initial</code>,
	 * indicating that the control will be added in the <code>SemanticTitle</code> as a base button
	 * and preventing adding it to the container.
	 * Otherwise, it returns <code>true</code>.
	 *
	 * The method is called after new control has been added
	 * in order to update the <code>ShareMenu</code> mode.
	 *
	 * @param {sap.f.semantic.SemanticControl} oControl
	 * @returns {boolean}
	 */
	SemanticShareMenu.prototype._onControlAdded = function(oControl) {
		if (this._isInitialMode()) {
			this._setMode(SemanticShareMenu._Mode.menu, oControl);
		}
	};

	/*
	 * The method is called after a control has been removed
	 * in order to update the <code>ShareMenu</code> mode.
	 *
	 * @returns {boolean}
	 */
	SemanticShareMenu.prototype._onControlRemoved = function() {
		var iActions = this._aShareMenuActions.length,
			iCustomActions = this._aCustomShareActions.length,
			bEmpty = (iActions + iCustomActions) === 0;

		if (this._isMenuMode() && bEmpty) {
			this._setMode(SemanticShareMenu._Mode.initial);
		}
	};


	/**
	* Runs before adding a button to the action sheet.
	* If the button is OverflowToolbarButton, it is made to show icon and text.
	*
	* @param oButton
	* @private
	*/
	SemanticShareMenu.prototype._preProcessOverflowToolbarButton = function(oButton) {
		if (oButton instanceof OverflowToolbarButton) {
			oButton._bInOverflow = true;
		}
	};

	/**
	* Runs after a button has been removed from the action sheet.
	* If the button is OverflowToolbarButton, it is made to only show an icon only.
	*
	* @param oButton
	* @private
	*/
	SemanticShareMenu.prototype._postProcessOverflowToolbarButton = function(oButton) {
		if (oButton instanceof OverflowToolbarButton) {
			delete oButton._bInOverflow;
		}
	};

	SemanticShareMenu.prototype._isInitialMode = function() {
		return this._getMode() === SemanticShareMenu._Mode.initial;
	};

	SemanticShareMenu.prototype._isMenuMode = function() {
		return this._getMode() === SemanticShareMenu._Mode.menu;
	};

	return SemanticShareMenu;

});