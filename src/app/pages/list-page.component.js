import { Component, LocalStorage, router, util } from 'lib';

class ListPageComponent extends Component {
  constructor(config) {
    super(config)
  }

  events() {
    return {
      'change #form-filter': 'filter',
      'click #selected-value': 'select',
      'click #select-list': 'pseudoSelect'
    }
  }

  onLoad() {
    this.onLoadTasks();
    document.addEventListener('click', this.documentListClose.bind(this));
  }

  async onLoadTasks() {
    sessionStorage.clear();

    const tbody = document.querySelector('.list tbody');
    tbody.innerHTML = '';

    const paginationRadio = document.getElementById('pagination');

    if (paginationRadio) {
      paginationRadio.remove();
    }

    const hover = util.hover();

    let tasks = LocalStorage.read('allTodos');

    if (!tasks) {
      let response = await fetch('https://spa-project-app.firebaseio.com/tasks.json');
      tasks = await response.json();
      LocalStorage.write('allTodos', tasks);
    }
    hover.remove();

    if (!tasks) {
      tbody.insertAdjacentHTML('beforeend', `
        <hr>
        <span class="no-task">There is no task</span><button class="btn-link"><a href="/">Create task</a></button>
        <hr>
        `);
      return;
    }

    const filters = new Set(['active', 'outdated', 'completed']);
    const select = document.getElementById('select-filter');
    const query = router.getQuery();
    select.value = query ? query.filter : 1;
    const { value } = select;
    this.setActiveSelectList();

    let filteredTasks = Array.from(Object.entries(tasks)).filter(task => {
      return !!(typeof +new Date(task[1].date) === 'number'
        && typeof task[1].title === 'string'
        && Array.isArray(task[1].chips)
        && task[1].chips.every(c => typeof c === 'string' && c.length < 50)
        && typeof task[1].desc === 'string' && task[1].desc.length < 2049);
    });

    if (filters.has(value)) {
      let entriesTasks = filteredTasks;
      switch (value) {
        case 'active': {
          entriesTasks = entriesTasks.filter(el => {
            return new Date(el[1].date) > Date.now() &&
              !el[1].completed;
          });
          break;
        }
        case 'completed': {
          entriesTasks = entriesTasks.filter(el => el[1].completed);
          break;
        }
        default: {
          entriesTasks =  entriesTasks.filter(el => {
            return new Date(el[1].date) < Date.now() &&
              !el[1].completed;
          });
        }
      }
      filteredTasks = entriesTasks;
    }

    let idx = 1;

    const currentPagesLength = Math.ceil(filteredTasks.length / 10);
    let queryLength = router.getQuery();
    queryLength = queryLength ? queryLength.page : 1;

    const from = (queryLength - 1) * 10;
    const to = queryLength * 10;

    if (queryLength > 0 && queryLength <= currentPagesLength) {
      idx = from + 1;
      filteredTasks = filteredTasks.slice(from, to);
    }

    filteredTasks = Object.fromEntries(filteredTasks);

    tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Date</th>
          <th>Description</th>
          <th>Status</th>
          <th>Open</th>
        </tr>
        `);

    for (const key in filteredTasks) {
      if (filteredTasks.hasOwnProperty(key)){
        const { title, date, desc, completed } = filteredTasks[key];
        const taskDate = new Date(date);
        const status = completed ? '<span class="complete">Completed</span>'
          : +taskDate < Date.now() ? '<span class="outdated">Outdated</span>'
          : '<span class="active">Active</span>';
        tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td class="no-resize">${idx++}</td>
          <td class="no-resize title">${title}</td>
          <td class="no-resize">${new Date(date).toLocaleDateString('ru')}</td>
          <td class="resize">${desc}</td>
          <td class="no-resize">${status}</td>
          <td class="no-resize"><button class="btn-link"><a href="/task${key}">open</a></button</td>
        </tr>
        `);
      }
    }

    const array = Array(currentPagesLength).fill(0);
    const pagination = array.map((el, i) => `
      <label for="r${i}">
        <input name="page" type="radio" id="r${i}" value="${i + 1}">
        <span class="page-number">${i + 1}</span>
      </label>
    `);

    const container = document.getElementById('app-list-page');

    container.insertAdjacentHTML('beforeend', `
      <form class="pagination" id="pagination">${pagination.join('')}</form>
    `);


    const paginationLabels = container.querySelectorAll('label');

    if (currentPagesLength > 7) {
      const pagination = document.getElementById('pagination');
      let from = 0;

      if (queryLength > 4) {
        from = queryLength - 4;
      }

      if (queryLength > currentPagesLength - 3){
        from = currentPagesLength - 7;
      }

      const newPagination = [...paginationLabels].slice(from, from + 7);
      pagination.innerHTML = '';
      pagination.append(...newPagination);
    }

    document.querySelectorAll('#pagination input').forEach(input => {
      if (+input.value === +queryLength) {
          input.checked = true;
        }
    });

    const paginationContainer = document.getElementById('pagination');

    paginationContainer.addEventListener('click', e => {
      const { target } = e;

      const pageNumber = query ? + query.page : 1;

      let nextValue = +target.value || pageNumber;


      if (pageNumber === +target.value) {
        return;
      }

      if (target.classList.contains('start')) {
        if (pageNumber === 1) {
          return;
        }
        nextValue = 1;
      } else if (target.classList.contains('end')) {
        if (pageNumber === currentPagesLength) {
          return;
        }
        nextValue = currentPagesLength;
      } else if (target.classList.contains('prev')) {
        if (pageNumber === 1) {
          return;
        }
        nextValue = pageNumber === 1 ? 1 : pageNumber - 1;
      } else if (target.classList.contains('next')) {
        if (pageNumber === currentPagesLength) {
          return;
        }
        nextValue = pageNumber === currentPagesLength ? pageNumber : pageNumber + 1;
      } else if (target.tagName !== 'INPUT') {
        return;
      }

      let state;
      const link = `list?filter=${value}&page=${nextValue}`;
      state = {
        page: link
      };
      history.pushState(state, '', state.page);
      paginationContainer.remove();
      this.onLoadTasks();
    });

    paginationContainer.insertAdjacentHTML('afterbegin', `
      <div class="prev">
        <span class="material-icons start">double_arrow</span>
        <span class="material-icons prev">chevron_left</span>
      </div>
    `)

    paginationContainer.insertAdjacentHTML('beforeend', `
      <div class="next">
        <span class="material-icons next">chevron_right</span>
        <span class="material-icons end">double_arrow</span>
      </div>
    `)
  }



  filter() {
    const select = document.getElementById('select-filter');
    const { value } = select;
    let state;
    const link = `list?filter=${value}&page=1`;
    state = {
      page: link
    };
    history.pushState(state, '', state.page);
    this.onLoadTasks();
  }

  select() {
    const selectList = document.getElementById('select-list');
    selectList.classList.add('show');
  }

  documentListClose({ target }) {
    if (target.tagName === 'UL' || target.tagName === 'LI') {
      return;
    }
    const selectList = document.getElementById('select-list');

    if (!selectList) {
      return;
    }

    if (selectList.classList.contains('show')) {
      selectList.classList.remove('show');
    }
  }

  setActiveSelectList() {
    const selectList = document.querySelectorAll('#select-list li');
    const select = document.getElementById('select-filter');
    const selectValue = document.getElementById('selected-value');
    selectValue.innerHTML = select.value;

    selectList.forEach(el => {
      if (el.innerHTML.toLowerCase() === select.value) {
        el.classList.add('active');
      } else {
        el.classList.remove('active')
      }
    })

  }

  pseudoSelect({ target }) {
    if (target.classList.contains('filter')){
      const select = document.getElementById('select-filter');
      select.value = target.innerHTML.toLowerCase();
      document.getElementById('select-list').classList.remove('show');
      this.filter()
    }
  }
}

export const listPageComponent = new ListPageComponent({
  selector: '#app-list-page',
  template: require('./html/list.html'),
  title: 'TODOs list'
});
