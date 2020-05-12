import { Modal } from "../../lib/core/modal";

class DatePickerModal extends Modal{
  constructor(config) {
    super(config);
    this.firstChek = true;
  }
}

export const datePicker = new DatePickerModal({
  selector: '.date-picker',
  template: require('./html/date-picker.html'),
});
