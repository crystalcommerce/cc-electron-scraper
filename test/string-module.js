const vm = require('vm');

const myModuleCode = `
  function myModuleFunction() {
    console.log('Hello, world!');
  }

  module.exports = myModuleFunction;
`;

const myModule = {};
const script = new vm.Script(myModuleCode);
const context = new vm.createContext({
  module,
  exports: myModule,
});

script.runInContext(context);

const myModuleFunction = myModule.exports;
myModuleFunction(); // Output: Hello, world!