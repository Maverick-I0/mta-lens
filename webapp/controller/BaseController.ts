import Controller from "sap/ui/core/mvc/Controller";
import Model from "sap/ui/model/Model";
import View from "sap/ui/core/mvc/View";

export default class BaseController extends Controller {
  /**
   * Sets the model at view level.
   * @param {Model} oModel - The Model that needs to be set at view level.
   * @param {String} sName - The name of the model that needs to be set at view level.
   * @returns {View} - The view instance for chaining, undefined, if view is not availble, indicating model is not set.
   */
  public setModel(oModel: Model, sName: string = ""): View | undefined {
    if (this.getView()) {
      return this.getView()?.setModel(oModel, sName);
    }
    console.warn("[WARNING] View not found, hence model not set.");
    return;
  }
}
