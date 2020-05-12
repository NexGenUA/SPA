import { Component } from "../../lib";

class AppHeader extends Component{
  constructor(config) {
    super(config)
  }
}

export const appHeader = new AppHeader({
  selector: '#header',
  template: require('../pages/html/header.html')
});
