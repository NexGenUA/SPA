const util = {
  delay(ms) {
    return new Promise((res, rej) => {
      setTimeout(() => res(), ms)
    })
  },

  async getIds() {
    const ids = new Set(['all', 'active', 'outdated', 'completed']);
    const hover = this.hover();
    const fetchData = await fetch('https://spa-project-app.firebaseio.com/tasks.json');
    const tasks = await fetchData.json();
    hover.remove();

    if (tasks) {

      localStorage.setItem('tasks', JSON.stringify(tasks));
      
      for (const key of Object.keys(tasks)) {
        ids.add(key);
      }
    }
    return ids;
  },

  hover() {
    const hover = document.createElement('div');
    hover.classList.add('hover-modal');
    hover.innerHTML = `<div class="linePreloader"></div>`;
    document.body.append(hover);
    return hover;
  }
};

export { util };
