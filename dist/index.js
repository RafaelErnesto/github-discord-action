const core = require('@actions/core');

try {

    console.log("Hello world!");
  
  } catch (error) {
  
    core.setFailed(error.message);
  
  }