import { router } from "../tools/router";
import { util } from "../tools/util";

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
      e.preventDefault();
      let state;
      const link = e.target;
      if (link.tagName !== 'A') return;
      state = {
        page: link.getAttribute('href')
      };
      history.pushState(state, '', state.page);
      this.renderRoute();
    });

    window.addEventListener('popstate', () => {
      this.renderRoute();
    })
  }

  renderRoute() {
    const ids = util.getIds();
    const url = router.getUrl();
    let route = this.routes.find(r => r.path === url);
    if (!route && ids.has(+url.slice(5))) route = this.routes[1];
    if (!route) route = this.routes[0];
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

