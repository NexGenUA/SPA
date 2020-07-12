import { LocalStorage, util, router } from "lib";

export class MainModule {
  constructor(config) {
    this.components = config.components;
    this.mainComponent = config.main;
    this.routes = config.routes;
  }

  start() {
    this.init();
    if (this.routes) this.initRoutes();
  }

  init() {
    this.mainComponent.render();
    this.components.forEach(this.renderComponent.bind(this));
    this.renderRoute();
  }

  initRoutes() {
    document.querySelector('#main-container').addEventListener('click', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL' || e.target.classList.contains('page-number')) {
        return;
      }
      e.preventDefault();
      let state;
      const link = e.target;
      if (link.tagName !== 'A') return;
      const newLink = link.getAttribute('href');
      state = {
        page: newLink === 'list' ? 'list?filter=all&page=1' : newLink,
      };
      history.pushState(state, '', state.page);
      this.renderRoute();
    });

    window.addEventListener('popstate', () => {
      this.renderRoute();
    })
  }

  async renderRoute() {


    const url = router.getUrl();

    let route = this.routes.find(r => r.path === url);
    
    if (!route) {
      const ids = await util.getIds();
      const id = url.slice(4);     

      if (ids.has(id)) {
        const tasks = LocalStorage.read('tasks');
        localStorage.clear();
        const task = tasks[id];
        LocalStorage.write(id, task);

        route = this.routes[1];
      } else {
        route = this.routes[0];
      }
    }

    const path = location.pathname + location.search;
    const check = await fetch(location.href);
    if (check.status === 404 || path === '/list') {
      route = this.routes[0];
    }

    document.querySelector('#router-outlet').innerHTML = `<div id="${route.component.selector.slice(1)}"></div>`;
    document.title = route.component.title;
    this.renderComponent(route.component);
    setActiveLink();
  }

  renderComponent(c) {
    c.render();
    if (c.onLoad) c.onLoad();
  }

}

function setActiveLink() {
  for (const link of document.querySelectorAll('.menu a')) {
    if (link.pathname === location.pathname) {
      link.classList.add('active-menu-link');
    } else {
      link.classList.remove('active-menu-link');
    }
  }
}

