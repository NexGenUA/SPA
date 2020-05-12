const util = {
  delay(ms) {
    return new Promise((res, rej) => {
      setTimeout(() => res(), ms)
    })
  },

  getIds() {
    const ids = new Set();
    if (localStorage.length) {
      for (const id of Object.values(localStorage)) {
        ids.add(JSON.parse(id).id);
      }
    }
    return ids;
  },

  hover() {
    const hover = document.createElement('div');
    hover.classList.add('hover-modal');
    hover.innerHTML = `<div class="lds-spinner">
      <div></div><div></div><div></div>
      <div></div><div></div><div></div>
      <div></div><div></div><div></div>
      <div></div><div></div><div></div>
      </div>`;
    document.body.append(hover);
    return hover;
  }
};

export { util };
