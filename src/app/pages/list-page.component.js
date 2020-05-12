import { Component } from "../../lib";

class ListPageComponent extends Component {
  constructor(config) {
    super(config)
  }

  onLoad() {
    this.onLoadTasks()
  }

  onLoadTasks() {
    sessionStorage.clear();

    const tbody = document.querySelector('.list tbody');

    if (!localStorage.length) {
      tbody.insertAdjacentHTML('beforeend', `
        <hr>
        <span class="no-task">Еhere is no task</span><button class="btn-link"><a href="/">Create task</a></button>
        <hr>
        `);
      return;
    }

    const tasks = new Set();
    let idx = 1;

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

    for (const task in localStorage) {
      if (localStorage.hasOwnProperty(task)){
        const { title, date, desc, id, completed } = JSON.parse(localStorage.getItem(task));
        const taskDate = new Date(date);
        const status = completed ? '<span class="complete">Completed</span>'
          : +taskDate < Date.now() ? '<span class="outdated">Outdated</span>'
          : '<span class="active">Active</span>';
        tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td class="no-resize">${idx++}</td>
          <td class="no-resize">${title}</td>
          <td class="no-resize">${new Date(date).toLocaleDateString('ru')}</td>
          <td class="resize">${desc}</td>
          <td class="no-resize">${status}</td>
          <td class="no-resize"><button class="btn-link"><a href="/task-${id}">open</a></button</td>
        </tr>
        `);
      }
    }
  }
}

export const listPageComponent = new ListPageComponent({
  selector: '#app-list-page',
  template: require('./html/list.html'),
  title: 'Tasks list'
});
