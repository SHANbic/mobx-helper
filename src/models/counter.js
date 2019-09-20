import { observable, computed, action, configure } from "mobx";

configure({ enforceActions: 'observed' }); // strict mode

export default class Counter {
  @observable count = 0;

  @computed get square() {
    return this.count ** 2;
  }

  @action add() {
    this.count++;
  }

  @action remove() {
    this.count--;
  }
}
