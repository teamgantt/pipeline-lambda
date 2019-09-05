const bg = require('../');

// node test/smoke-test.js

(async function () {
  console.log('Describe Environments');
  console.log();
  const environments = await bg.describeEnvironments();
  console.log(environments);
  console.log();
  const {Environments: [env]} = environments;

  console.log('Get Environment');
  console.log();
  const environment = await bg.getEnvironment(env.environmentName);
  console.log(environment);
  console.log();

  console.log('Get Configuration Template');
  console.log();
  const config = await bg.getConfigurationTemplate(environment);
  console.log(config);
  console.log();
})();
