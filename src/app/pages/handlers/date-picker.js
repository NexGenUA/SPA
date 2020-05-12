import { datePicker } from "../datepicker.modal";

class ShowDatePicker {
  constructor() {
    this.checkLocalStorage = sessionStorage.getItem('currentDate');
    this.date = this.checkLocalStorage ? new Date(this.checkLocalStorage) : new Date();
  }
  init(e) {

    setTimeout(() => this.show(e),0);

    datePicker.render();
  }

  show({ target: dateInput }) {

    document.body.style.overflow = 'hidden';

    dateInput.blur();

    const modal = document.querySelector('.date-picker');
    const setSelected = d => {
      sessionStorage.setItem('selected', JSON.stringify({
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        full: d
      }));
    };

    const taskChecker = document.querySelector('.task-checker');
    if (taskChecker && dateInput.value.trim() !== '') {
      const taskDate = new Date(dateInput.value.split('.').reverse().join('-'));
      sessionStorage.setItem('currentDate', taskDate);
      setSelected(taskDate);
      this.date = taskDate;
      taskChecker.classList.remove('task-checker');
    }

    modal.addEventListener('click', e => {
      const el = e.target;

      if (!el) return;

      if (el.parentNode.tagName === 'TD') {
        const tds = modal.querySelectorAll('.datepicker-table td');
        Array.from(tds).map(td => td.classList.remove('td-active'));
        el.parentNode.classList.add('td-active');
        const day = +el.textContent;
        this.date.setDate(day);
        renderYearDate(this.date, false);
        setSelected(this.date);
        return;
      }


      if (el.classList.contains('datepicker-done')) {
        this.closeModal(modal, true);
        const selDate = sessionStorage.getItem('selected');
        if (!selDate) return;
        const setDate = new Date(JSON.parse(selDate).full);
        dateInput.value = setDate.toLocaleDateString('ru');
        document.forms['add-task'].elements['desc'].focus();
        return;
      }

      if (el.classList.contains('datepicker-cancel')) this.closeModal(modal, true);

      const updateCalendar = () => {
        const td = document.querySelector('.td-active');
        if (!td) return;
        td.classList.remove('td-active');
      };

      const changeMonthYearCalendar = () => {
        const month = document.querySelector('.select-dropdown.month');
        const year = document.querySelector('.select-dropdown.year');

        month.value = this.date.toLocaleString('en', { month: 'long'});
        year.value = this.date.getFullYear();
      };

      const selectedDate = () => {
        const selected = this.selected();
        const tds = modal.querySelectorAll('.datepicker-table td');
        Array.from(tds).map(el => +el.textContent === selected ? el.classList.add('td-active') : el);
      };

      if (el.classList.contains('month-prev')) {
        this.date.setMonth(this.date.getMonth() - 1);
        renderDate(this.date, true);
        updateCalendar();
        changeMonthYearCalendar();
        selectedDate();
      }

      if (el.classList.contains('month-next')) {
        this.date.setMonth(this.date.getMonth() + 1);
        renderDate(this.date, true);
        updateCalendar();
        changeMonthYearCalendar();
        selectedDate();
      }

      if (el.classList.contains('month')) {
        let innerHtml = '';
        const currentMonth = this.date.getMonth();
        const month = m => new Date(2020, m).toLocaleString('en', { month: 'long'});
        for (let i = 0; i < 12; i++) {
          if (i === currentMonth) {
            innerHtml += `<li class="active-month" value="${i}">${month(i)}</li>`
          } else innerHtml += `<li value="${i}">${month(i)}</li>`
        }
        const hover = document.querySelector('.hover-modal');
        const ul = document.querySelector('.month-modal');
        const hoverHandler = e => {
          if (e.target.tagName === 'LI' || e.target.tagName === 'UL') return;
            hover.removeEventListener('click', hoverHandler);
            this.closeMonthYearPicker(ul, hoverHandler);
        };

        setTimeout(() => {
          hover.addEventListener('click', hoverHandler);
        }, 0);


        ul.style.display = 'block';
        ul.innerHTML = innerHtml;

        const setMonth = e => {
          const li = e.target;
          if (li.tagName !== 'LI') return;
            ul.removeEventListener('click', setMonth);
            this.date.setMonth(li.value);
            renderDate(this.date, true);
            updateCalendar();
            changeMonthYearCalendar();
            selectedDate();
            hover.removeEventListener('click', hoverHandler);
            this.closeMonthYearPicker(ul, hoverHandler);
        };

        ul.addEventListener('click', setMonth)
      }

      if (el.classList.contains('year')) {
        let innerHtml = '';
        const year = +this.date.getFullYear();
        for (let i = (year - 10); i <= (year + 10); i++) {
          if (i === year) {
          innerHtml += `<li class="active-year" value="${i}">${i}</li>`
          } else innerHtml += `<li value="${i}">${i}</li>`
        }
        const hover = document.querySelector('.hover-modal');
        const ul = document.querySelector('.years-modal');
        const hoverHandler = e => {
          if (e.target.tagName === 'LI' || e.target.tagName === 'UL') return;
            hover.removeEventListener('click', hoverHandler);
            this.closeMonthYearPicker(ul, hoverHandler);
        };

        setTimeout(() => {
          hover.addEventListener('click', hoverHandler);
        }, 0);


        ul.style.display = 'block';
        ul.innerHTML = innerHtml;

        const setMonth = e => {
          const li = e.target;
          if (li.tagName !== 'LI') return;
            ul.removeEventListener('click', setMonth);
            this.date.setFullYear(li.value);
            renderDate(this.date, true);
            updateCalendar();
            changeMonthYearCalendar();
            selectedDate();
            hover.removeEventListener('click', hoverHandler);
            this.closeMonthYearPicker(ul, hoverHandler);
        };

        ul.addEventListener('click', setMonth)
      }

    });



    const getMonth = d => {
      return d.toLocaleString('en', { month: 'long' });
    };

    const getDayOfWeek = d => {
      return d.toLocaleString('en', { weekday: 'long' });
    };

    const renderYearDate = (date, flag) => {
      const dayOfWeek = getDayOfWeek(date);
      const month = getMonth(date);
      let yearText = date.getFullYear();
      let dateText = `${dayOfWeek.slice(0,3)}, ${month.slice(0,3)} ${date.getDate()}`;
      const selectedDate = sessionStorage.getItem('selected');

      if (selectedDate && flag) {
        const date = new Date(JSON.parse(selectedDate).full);
        yearText = date.getFullYear();
        dateText = `${getDayOfWeek(date).slice(0,3)}, ${getMonth(date).slice(0,3)} ${date.getDate()}`;
      }

      modal.querySelector('.year-text').innerHTML = yearText;
      modal.querySelector('.date-text').innerHTML = dateText;
      modal.querySelector('.select-dropdown.month').value = month;
      modal.querySelector('.select-dropdown.year').value = date.getFullYear();
    };

    const renderDate = (d, flag) => {
      this.date = d ? new Date(d) : this.date;
      const month = getMonth(this.date);
      if (!flag) renderYearDate(this.date, month);


      const getTBody = this.tBody(this.date.getFullYear(), this.date.getMonth());
      modal.querySelector('table tbody').innerHTML = getTBody;
    };

    renderDate();

    this.closeModal(modal);
    return false;
  }

  closeMonthYearPicker(ul, fn) {
     ul.classList.add('scale-hide');
     sessionStorage.setItem('currentDate', this.date);
     setTimeout(() => {
        ul.classList.remove('scale-hide');
        ul.style.display = '';
        ul.removeEventListener('click', fn)
      }, 180);
  }

  closeModal(modal, flag) {
    const hover = document.querySelector('.hover-modal');

    const close = () => {

      hover.removeEventListener('click', removeModal);
      modal.classList.add('scale-hide');
      hover.classList.add('hover');

      sessionStorage.setItem('currentDate', this.date);

      setTimeout(() => {
        modal.classList.remove('scale-hide');
        document.body.style.overflow = '';
        hover.remove();
      }, 180);

    };

    const removeModal = e => {
      const target = e.target;
      const currentHover = e.currentTarget;

      if (target !== currentHover) return;
      close();
    };

    if (flag) close();

    hover.addEventListener('click', removeModal);
  }

  selected() {

    if (sessionStorage.getItem('selected')) {
      const {day: sD, month: sM, year: sY} = JSON.parse(sessionStorage.getItem('selected'));
      if (this.date.getFullYear() === sY && this.date.getMonth() === sM) {
        return sD;
      }
    }
    return null;
  }

  tBody(year, month) {
    const getWeek = (y, m) => {
      return new Date(y, m).getDay();
    };

    let currentDay = 0;
    const currentDate = new Date();
    if (currentDate.getMonth() === new Date(year, month).getMonth()
      && currentDate.getFullYear() === new Date(year, month).getFullYear()) {
      currentDay = +currentDate.getDate();
    }

    const getDays = (y, m) => {
      return new Date(y, m + 1, 0).getDate()
    };

    const weekDay = getWeek(year, month);
    const days = getDays(year, month);

    let tableHTML = '<tr>' + '<td></td>'.repeat(weekDay);
    let sunday = 7 - weekDay;

    const selected = this.selected();

    for (let i = 1; i <= days; i++) {

      tableHTML += `<td ${
        i === currentDay ? 'class="current-date"' : i === selected ? 'class="td-active"' : ''
      }><button>${i}</button></td>`;
      if (i === sunday) {
        tableHTML += `</tr><tr>`;
        sunday += 7;
      }
    }

    let lastEmptyDays = 35 - weekDay - days;
    lastEmptyDays = lastEmptyDays >= 0 ? lastEmptyDays : 0;
    tableHTML += '<td></td>'.repeat(lastEmptyDays) + '</tr>';
    return tableHTML;
  }
}

export const showDatePicker = new ShowDatePicker();
