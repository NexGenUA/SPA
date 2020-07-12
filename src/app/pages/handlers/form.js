import { showDatePicker } from "./date-picker";
import { util } from "../../../lib";

class FormHandler {

  constructor() {
    this.allTags = new Set();
    this.titleWrong = false;
    this.fieldsWrong = false;
  }

  inputLabelActive(e) {
    const el = e.target;
    if (!el || !el.classList.contains('label')) return;
    const label = el.parentNode.querySelector('label');
    if (el.value.length) {
      label.classList.add('label-active');
    } else {
      label.classList.remove('label-active');
    }
  }

  chipsShadowBorderActive(e) {
    const chipsWrap = e.target;
    const type = e.type;
    const activeChip = chipsWrap.parentNode.querySelector('.active-chip');

    if (activeChip) activeChip.classList.remove('active-chip');

    if (!chipsWrap.classList.contains('chips')) return;

    if (type === 'focusin') {
      chipsWrap.parentNode.classList.add('border-shadow')
    }

    if (type === 'focusout') {
      chipsWrap.parentNode.classList.remove('border-shadow');
      if (chipsWrap.value === '') return;
       this.createChips(chipsWrap.value);
    }
  }

  textAreaResize(e) {
    const FIELD_SIZE = 2048;
    const area = e.target;
    const characterCounter = document.querySelector('.character-counter');
    if (area.value.length >= FIELD_SIZE) area.value = area.value.slice(0, FIELD_SIZE);
    characterCounter.innerHTML = `${area.value.length}/${FIELD_SIZE}`;

    area.style.transition = '';

    area.style.height = 'auto';

    const scroll = area.scrollHeight;
    const height = area.clientHeight;

    if (scroll !== height) {
      area.style.height = `${scroll+2}px`;
    }
  }

  blurChips(e) {
    const chipsWrap = e.target;
    if (!chipsWrap.classList.contains('wrap-input__chips')) return;
    chipsWrap.querySelector('input').focus();
  }

  chipAction(e) {
    this.tags = e.target;

    if (!this.tags) return;

    const checkedChip = document.querySelector('.active-chip');

    if (checkedChip && e.keyCode !== 8) checkedChip.classList.remove('active-chip');

    this.tagsValue = this.tags.value.trim();

    if (e.keyCode === 13) {
      this.createChips();
    }

    if (e.keyCode !== 8 || this.tagsValue) return;


    setTimeout(()=>{
    const elms = document.querySelectorAll('.chip');
      const index = elms.length - 1;
      if (!elms.length) return;
      const el = elms[index];
      const valueChip = el.textContent.trim().slice(0, -1);

      if (el.classList.contains('active-chip')) {
        el.remove();
        this.allTags.delete(valueChip);

        if (index - 1 >= 0) {
          elms[index - 1].classList.add('active-chip');
        }
      } else {
        el.classList.add('active-chip');
      }
    },0);
  }

  showDatePicker(e) {
    showDatePicker.init(e);
  }

  async submit({ target }) {
    const form = document.forms['add-task'];
    const title = form.elements['title'].value.trim();
    const desc = form.elements['desc'].value.trim();
    const date = form.elements['date'].value.trim();
    const elChips = form.elements['chips'].parentNode.getElementsByTagName('span');
    const successTask = document.querySelector('.success.task');
    if (successTask) successTask.remove();

    const titleWrongRemove = () => {
      const titleWrong = document.querySelector('.validate.title');
      if (titleWrong) titleWrong.remove();
    };

    if (!title || !desc || !date || !elChips.length) {
      this.titleWrong = false;
      titleWrongRemove();
      if (this.fieldsWrong) return;
      this.fieldsWrong = true;
      target.insertAdjacentHTML('beforebegin', '<span class="validate fields">Please fill in all fields</span>');
      return;
    }

    this.fieldsWrong = false;

    const fieldsWrong = document.querySelector('.validate.fields');

    if (fieldsWrong) {
      fieldsWrong.remove();
    }

    this.titleWrong = false;

    titleWrongRemove();

    form.elements['title'].classList.remove('wrong');

    let chips = new Set();

    for (const chip of elChips) {
        chips.add(chip.textContent.trim());
    }

    const toStorage = {
      title,
      id: Date.now(),
      chips: [...chips],
      date: new Date(date.split('.').reverse().join('-')),
      desc
    };

    const response = await fetch(`https://spa-project-app.firebaseio.com/tasks.json`, {
      method: 'POST',
      body: JSON.stringify(toStorage),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    const aSubmit = document.querySelector('.a-submit');
    const clickSubmit = new Event('click', {
       bubbles: true
    });
    const hover = util.hover();
    fetch('/addtask', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
      body: JSON.stringify(result.name)
    }).then(res => {
      hover.remove();
      this.allTags.clear();
      if (res.ok) {
        aSubmit.dispatchEvent(clickSubmit);
      }
    })
  }

  keyEnterTitle(e) {
    if (e.keyCode !== 13) return;
    document.forms['add-task'].elements['chips'].focus()
  }

  labelFocus({ target }) {
    const label = target;
    if (label.tagName !== 'LABEL') return;
    label.parentNode.querySelectorAll('*')[0].focus();
  }

  createChips(value = false) {

    this.tagsValue = value || this.tagsValue;

    if (!this.allTags.has(this.tagsValue) && this.tagsValue.trim() !== '') {
      const div = document.createElement('div');
      const close = document.createElement('div');
      const closeChip = e => {
        e.target.parentNode.remove();
        this.allTags.delete(this.tagsValue);
      };

      div.innerHTML = `<span>${this.tagsValue}</span>`;
      this.allTags.add(this.tagsValue);
      close.innerHTML = 'x';
      div.classList.add('chip');
      close.classList.add('chip-close');
      div.append(close);
      this.tags.before(div);
      close.addEventListener('click', closeChip);
      this.tags.value = '';
    return;
    }

    if (this.allTags.size && this.tags.value.trim() === '') {
      document.forms['add-task'].elements['date'].focus();
    }

    this.tags.value = '';
  }
}

export const formHandler = new FormHandler();
