export class Modal {
  constructor(config) {
    this.template = config.template;
    this.selector = config.selector;
  }

  render() {
    const modal =  document.createElement('div');
    const hover = document.createElement('div');
    const month = document.createElement('ul');
    const years = document.createElement('ul');

    modal.classList.add(this.selector.slice(1));
    hover.classList.add('hover-modal');
    month.classList.add('month-modal');
    years.classList.add('years-modal');

    modal.innerHTML = this.template;

    document.body.append(hover);
    hover.append(modal, month, years);
  }
}
