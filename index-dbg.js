sap.ui.define([
  "sap/ui/core/ComponentContainer"
], (ComponentContainer) => {
  "use strict";

  new ComponentContainer({
    name: "ui5.mszyba",
    settings: {
      id: "mszyba"
    },
    async: true
  }).placeAt("content");
});