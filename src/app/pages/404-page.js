import { Component } from "../../lib";

class NotFoundPageComponent extends Component {
  constructor(config) {
    super(config)
  }
}

export const notFoundPageComponent = new NotFoundPageComponent({
  selector: '#app-not-found-page',
  template: require('./html/404.html'),
  title: 'Page not found'
});
