import { Component, LocalStorage, router, util } from 'lib';
import { formHandler } from './handlers/form';

class TodoPageComponent extends Component {
  constructor(config) {
    super(config);
    this.task = true;
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
      'click .chips': 'onPressChips',
      'focusin .date-picker-modal': 'onDatePicker',
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
    e.target.blur();
    e.preventDefault();
    return false;
  }

  onPressChips(e) {
    e.target.style.transition = '';
    e.target.blur();
    e.preventDefault();
  }

  onDatePicker(e) {
    formHandler.showDatePicker(e);
  }

  onLabelFocus(e) {
    formHandler.labelFocus(e)
  }

  async onLoad() {
    this.renderForm();
    const el = document.querySelector('.wrap-submit');
    const task = await this.getTask();
    task.date = new Date(task.date);

    if (task.completed) {
      this.completed(el);
      return;
    }

    if (+task.date < Date.now()) {
      this.outdated(el);
      return;
    }

    this.updateBtn();
    this.completeBtn();
  }

  async getTask() {
    const id = router.getUrl().slice(4);
    let task = LocalStorage.read(id);

    if (!task) {
      const fetchData = await fetch(`https://spa-project-app.firebaseio.com/tasks/${id}.json`);
      task = await fetchData.json();
      LocalStorage.write(id, task);
    }

    return task;
  }

  async renderForm() {
    const hover = util.hover();
    const task = await this.getTask();
    hover.remove();
    const {title, date, chips, desc} = task;

    const chipInput = document.querySelector('.chips');
    chips.forEach(chip => {
      chipInput.insertAdjacentHTML('beforebegin', `
        <div class="chip"><span>${chip}</span></div>
      `)
    });
    document.querySelector('.title-text').textContent = title;
    document.querySelector('.date-picker-modal').value = new Date(date).toLocaleDateString('ru');
    const textarea = document.querySelector('#descript');
    textarea.value = desc;
    textarea.focus();
    textarea.blur();
    const event = new Event('input', {bubbles: true});
    textarea.dispatchEvent(event);
  }

  updateBtn() {
    this.updateTask('update');
  }

  completeBtn() {
    this.updateTask('complete');
  }

  getBtns() {
    return document.querySelectorAll('.btn');
  }

  completed(el) {
    this.btnsDisable();
    this.readOnly();
    el.insertAdjacentHTML('afterbegin', '<span class="validate complete">Task completed</span>');
  }

  readOnly() {
    const textarea = document.querySelector('#descript');
    const dateInput = document.querySelector('.date-picker-modal');
    textarea.setAttribute('readonly', '');
    textarea.classList.add('readonly');
    dateInput.parentNode.insertAdjacentHTML('afterbegin', `<input readonly value="${dateInput.value}">`);
    dateInput.remove()
  }

  outdated(el) {
    this.btnsDisable();
    this.readOnly();
    el.insertAdjacentHTML('afterbegin', '<span class="validate update">Task outdated</span>');
  }

  btnsDisable() {
    const btns = this.getBtns();
    btns.forEach(btn => btn.setAttribute('disabled', ''));
  }

  async updateTask(selector) {
    const btn = document.querySelector(`.btn.${selector}`);
    const task = await this.getTask();

    btn.addEventListener('click', async e => {
      const elements = document.forms['add-task'].elements;
      const descInput = elements['desc'].value;
      const dateInput = elements['date'].value;
      const validate = document.querySelector('.validate');
      const id = router.getUrl().slice(4);

      if (validate) validate.remove();

      switch (selector) {
        case 'update': {
          task.date = new Date(dateInput.split('.').reverse().join('-'));
          task.desc = descInput;
          if (+task.date < Date.now()) {
            btn.parentNode.insertAdjacentHTML('afterbegin', '<span class="validate update">Enter correct date</span>');
            return;
          }

          if (descInput.trim() === '') {
            btn.parentNode.insertAdjacentHTML('afterbegin', '<span class="validate update">Please fill in all fields</span>');
            return;
          }
          const hover = util.hover();
          await fetch(`https://spa-project-app.firebaseio.com/tasks/${id}.json`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
          });
          hover.remove();
          break;
        }
        case 'complete': {
          task.completed = true;
          this.completed(btn.parentNode);
          const hover = util.hover();
          await fetch(`https://spa-project-app.firebaseio.com/tasks/${id}.json`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
          });
          hover.remove();
          break;
        }
      }
    })
  }
}

export const todoPageComponent = new TodoPageComponent({
  selector: '#app-todo-page',
  template: require('./html/todo.html'),
  title: 'TODOs'
});
