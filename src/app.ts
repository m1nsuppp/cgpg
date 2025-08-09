import { createTableConfigurator } from './table-configurator';

(() => {
  const configurator = createTableConfigurator();
  void configurator.run();
})();
