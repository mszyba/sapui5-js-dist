/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.f.Card
sap.ui.define([
	"sap/ui/core/Renderer",
	"sap/f/library"
], function (
	Renderer,
	library
) {
	"use strict";
	var HeaderPosition = library.cards.HeaderPosition;

	/**
	 * <code>Card</code> renderer.
	 * @author SAP SE
	 * @namespace
	 */
	var CardRenderer = Renderer.extend("sap.f.CardRenderer", {
		apiVersion: 2
	});

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.f.Card} oCard an object representation of the control that should be rendered
	 */
	CardRenderer.render = function (oRm, oCard) {
		var oHeader = oCard._getHeaderAggregation(),
			bHeaderTop = oHeader && oCard.getCardHeaderPosition() === HeaderPosition.Top,
			bHasCardBadgeCustomData = oCard._getCardBadgeCustomData().length > 0;

		oRm.openStart("div", oCard);
		this.renderContainerAttributes(oRm, oCard);
		oRm.openEnd();

		if (bHasCardBadgeCustomData) {
			this.renderCardBadge(oRm, oCard);
		}

		// header at the top
		if (bHeaderTop) {
			oRm.renderControl(oHeader);
		}

		// content
		this.renderContentSection(oRm, oCard);

		// header at the bottom
		if (!bHeaderTop) {
			oRm.renderControl(oHeader);
		}

		// footer
		this.renderFooterSection(oRm, oCard);

		oRm.renderControl(oCard._ariaText);
		oRm.renderControl(oCard._ariaContentText);

		oRm.renderControl(oCard._describedByCardTypeText);
		oRm.renderControl(oCard._describedByInteractiveText);
		if (oCard._invisibleTitle) {
			oRm.renderControl(oCard._invisibleTitle);
		}

		if (bHasCardBadgeCustomData) {
			oRm.renderControl(oCard._getInvisibleCardBadgeText());
		}

		oRm.close("div");
	};

	/**
	 * @protected
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.f.Card} oCard An object representation of the control that should be rendered.
	 */
	CardRenderer.renderContainerAttributes = function (oRm, oCard) {
		const bIsInteractive = oCard.isInteractive();

		var sHeight = oCard.getHeight(),
			oHeader = oCard.getCardHeader(),
			oContent = oCard.getCardContent(),
			bHasHeader = !!(oHeader && oHeader.getVisible()),
			bHasContent = !!oContent,
			bCardHeaderBottom = bHasHeader && oCard.getCardHeaderPosition() === HeaderPosition.Bottom,
			sTooltip = oCard.getTooltip_AsString(),
			sAriaRole = oCard.getGridItemRole() || oCard.getSemanticRole().toLowerCase();

		oRm.class("sapFCard")
			.style("width", oCard.getWidth());

		if (!bHasHeader) {
			oRm.class("sapFCardNoHeader");
		}

		if (!bHasContent) {
			oRm.class("sapFCardNoContent");
		}

		if ((bHasHeader && oHeader.isInteractive && oHeader.isInteractive()) ||
			(bHasContent && oContent.isInteractive && oContent.isInteractive())) {
			oRm.class("sapFCardSectionInteractive");
		}

		if (oCard.isRoleListItem()) {
			oRm.class("sapFCardFocus");
			oRm.attr("tabindex", "0");

			if (bIsInteractive) {
				oRm.class("sapFCardInteractive");

				if (oCard.isMouseInteractionDisabled()) {
					oRm.class("sapFCardDisableMouseInteraction");
				}
			}
		}

		if (bCardHeaderBottom) {
			oRm.class("sapFCardBottomHeader");
		}

		if (sHeight && sHeight !== "auto") {
			oRm.style("height", sHeight);
		}

		if (sTooltip) {
			oRm.attr("title", sTooltip);
		}

		//Accessibility state
		oRm.accessibilityState(oCard, {
			role: sAriaRole,
			labelledby: { value: oCard._getAriaLabelledIds(), append: true },
			describedby: { value: oCard._getAriaDescribedByIds(), append: true }
		});
	};

	/**
	 * Render content section.
	 * Will be overwritten by subclasses.
	 *
	 * @protected
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.f.Card} oCard An object representation of the control that should be rendered.
	 */
	CardRenderer.renderContentSection = function (oRm, oCard) {
		var oContent = oCard.getCardContent();

		if (oContent) {
			oRm.openStart("div", oCard.getId() + "-contentSection")
				.class("sapFCardContent")
				.accessibilityState(oCard, {
					role: "group",
					labelledby: { value: oCard.getId() + "-ariaContentText", append: true }
				})
				.openEnd();

			oRm.renderControl(oContent);

			oRm.close("div");
		}
	};

	/**
	 * Render footer section.
	 * Will be overwritten by subclasses.
	 *
	 * @protected
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.f.Card} oCard An object representation of the control that should be rendered.
	 */
	CardRenderer.renderFooterSection = function (oRm, oCard) {

	};

	/**
	 * Render card badge section.
	 *
	 * @protected
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the render output buffer.
	 * @param {sap.f.Card} oCard An object representation of the control that should be rendered.
	 */
	CardRenderer.renderCardBadge = function (oRm, oCard) {
		oRm.openStart("div", oCard.getId() + "-cardBadgeSection")
			.class("sapFCardBadgePlaceholder")
			.openEnd();
				oCard._getCardBadges()?.forEach((oCardBadge) => {
					oRm.renderControl(oCardBadge);
				});
		oRm.close("div");
	};

	return CardRenderer;
});
