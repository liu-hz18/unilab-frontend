// const ansicolor = require("ansicolor").nice;

function test(content) {
  return content.replaceAll("[0;m","[0m").replaceAll("[0K","").replaceAll(/section_(start|end):\d+:[a-zA-Z0-9_]+/g,"");
  // return content
}

export{test}
