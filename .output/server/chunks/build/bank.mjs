import { defineStore } from 'pinia';

const useBankStore = defineStore("bank", {
  state: () => ({
    isOpenMenu: false
  }),
  actions: {
    func() {
      console.log("console log eheheh");
    }
  }
});

export { useBankStore as u };
//# sourceMappingURL=bank.mjs.map
