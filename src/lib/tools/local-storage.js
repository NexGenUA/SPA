export class LocalStorage {
  static write(key, value) {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
  }

  static read(key) {
    const json = localStorage.getItem(key);

    if (!json) {
      return null;
    }

    return JSON.parse(json);
  }
}