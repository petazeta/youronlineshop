/*
const defaultInstance="./server/context__main/main.mjs";
let defaultPort="6001";
let openBrowserinstances=false;
let interactive=false;
const instances=[];

for (let i=2; i<process.argv.length; i++) {
  if (process.argv[i]?.match(/^interactive$/)) {
    break;
  }
  if (process.argv[i]?.match(/^default-port=/)) {
  	defaultPort=process.argv[i].match(/^default-port=(\d+)/)[1];
  }
  if (process.argv[i]?.match(/^instances=/)) {
  	instances.concat(process.argv[i].match(/^instances=(.+)/)[1].split(","));
  }
  if (process.argv[i]?.match(/^open-browser-instances$/)) {
    openBrowserinstances=true;
  }
}
if (!instances.length) instances.push(defaultInstance + ":" + defaultPort);
for (const instance of instances) {
  const [myInstance, myPort]=instance.split(":");
  const {default: app} = await import(myInstance);
  let myServer=http.createServer(app);
  myServer.listen(myPort, ()=>{
    console.log("\n\x1b[35m%s\x1b[0m", myInstance + `:\n💻 Running development server on http://localhost:${myPort} (^C to quit)`);
    if (openBrowserinstances){
      console.log("\n✨ You can now preview \x1b[1m%s\x1b[0m", "Your Online Shop", "in your web browser.");
      import("./utils/openbrowser.mjs")
      .then(({default: openBrowser})=>openBrowser("http://localhost:" + myPort));
    }
    httpServerInstances.push(myServer)
  });
}
*/


/*
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("What is your name ? ", function (name) {
  rl.question("Where do you live ? ", function (country) {
    console.log(`${name}, is a citizen of ${country}`);
    rl.close();
  });
});

rl.on("close", function () {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});
https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
*/