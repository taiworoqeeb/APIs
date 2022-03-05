const authResolver = require('./usercontrollers');
const rootResolver = {
    ...authResolver
  };
  
  module.exports = rootResolver;