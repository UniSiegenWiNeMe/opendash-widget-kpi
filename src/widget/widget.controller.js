const UNITS = {
  0: 'V',
  1: 'W',
  2: 'kWh',
  3: 'COS-Phi',
  4: 'm3',
  5: '°C',
};

let $data;

export default class WidgetController {

  static $inject = ['od.data.service'];

  constructor(data) {
    $data = data;
  }

  $onInit() {
    this.state.alert = false;

    if (!this.config.item || !this.config.iconside) {
      this.state.config = false;
      return;
    }

    if (this.config.iconside == "Links") {
      this.left = true;
      this.right = false;
    } else {
      this.left = false;
      this.right = true;
    }

    let newValue = this.config.item;
    // Cool Angular.. mach halt nen String draus.
    // settings.controller.js:10
    // settings.template.html:2-3
    newValue = JSON.parse(newValue);

    let id = newValue[0];
    let valueIndex = newValue[1];

    let item = this.$dataStore.get(id);

    if (!item || !item.value) {
      console.error('KPI Widget Item Not Found..', id);
      this.state.config = false;
      return;
    }

    item.liveValues((values) => {
      let value = parseFloat(values.value[0]).toFixed((this.config.type === 0) ? 1 : 2);

      this.dataValue = `${value} ${UNITS[this.config.type]}`;
      var that = this;
      setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 200);
      this.timeValue = "";
      this.loading = false;
    });
  }
}