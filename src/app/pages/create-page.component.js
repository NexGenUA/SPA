import { Component } from "../../lib";
import { formHandler } from "./handlers/form";

class CreatePageComponent extends Component {
  constructor(config) {
    super(config)
  }

  events() {
    return {
      'focusout #add-task': 'onLabelAction',
      'input .text-area-flexible': 'onTextAreaAction',
      'focusin .wrap-input__chips': 'onChipsBorderActive',
      'focusout .wrap-input__chips': 'onChipsBorderActive',
      'click #add-task': 'onBlurChips',
      'click .add-task': 'onLabelFocus',
      'keydown .chips': 'onChipsAction',
      'focusin .date-picker-modal' : 'onDatePicker',
      'click .submit' : 'onSubmit',
      'keydown .label.title' : 'onKeyEnterTitle'
    }
  }

  onLabelAction(e) {
    formHandler.inputLabelActive(e);
  }

  onTextAreaAction(e) {
    formHandler.textAreaResize(e);
  }

  onChipsBorderActive(e) {
    formHandler.chipsShadowBorderActive(e);
  }

  onBlurChips(e) {
    formHandler.blurChips(e);
  }

  onChipsAction(e) {
    formHandler.chipAction(e);
  }

  onDatePicker(e) {
    formHandler.showDatePicker(e);
  }

  onSubmit(e) {
    formHandler.submit(e)
  }

  onKeyEnterTitle(e) {
    formHandler.keyEnterTitle(e)
  }

  onLabelFocus(e) {
    formHandler.labelFocus(e)
  }

  onLoad() {
    sessionStorage.clear();
  }
}

export const createPageComponent = new CreatePageComponent({
  selector: '#app-create-page',
  template: require('./html/create.html'),
  title: 'Create Task'
});
