sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel"
], function (Controller) {
  "use strict";

  return Controller.extend("ui5.mszyba.controller.MyPage", {
    onInit: function () {
    },

    onSectionVisibilityChanged: function (oEvent) {
      const oVisibleSubSections = oEvent.getParameter("visibleSubSections"),
        aSubSectionsIds = Object.keys(oVisibleSubSections);

      if (aSubSectionsIds.length === 1) {
        oVisibleSubSections[aSubSectionsIds[0]].addStyleClass("sapUxAPObjectPageSubSectionFitContainer");
      } else {
        aSubSectionsIds.forEach(function (sKey) {
          oVisibleSubSections[sKey].removeStyleClass("sapUxAPObjectPageSubSectionFitContainer");
        });
      }
    },

    handleUrlPress: function () {
      sap.m.URLHelper.redirect("https://github.com/mszyba/sapui5-js", true);
    }
  });
});