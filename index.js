// This file is the single-entrypoint for the Max patch.
// When this file is executed via `node.script start` in the Max patch,
// this program will launch an Electron app as a child process, and connect to it by socket.io

const MaxAPI = require("max-api");
const io = require("socket.io")();
const electron = require("electron");
const proc = require("child_process");
const child = proc.spawn(electron, ["."]);

io.on("connection", (socket) => {
	console.log("Socket is connected with Electron App");

	socket.on("dispatch", (data) => {

		//var mydata = JSON.parse(data);
	//	MaxAPI.outlet(mydata);
	//data = data.split(",")
	data = data.replace(/^data:image\/png;base64,/, '');
	binaryData = new Buffer(data, 'base64').toString('binary');

	require("fs").writeFile("out.png", binaryData, "binary", function(err) {
	  console.log(err); // writes out file without error, but it's not a valid image
		MaxAPI.post(data.length)

	});




//	MaxAPI.outlet(mydata)
//	MaxAPI.post(mydata)



		/*
		MaxAPI.outlet("0 " + mydata.reds.split(' '));
		MaxAPI.outlet("1 " + mydata.greens.split(' '));
		MaxAPI.outlet("2 " + mydata.blues.split(' '));*/
	});

});

io.listen(3000);

// This will ensure that when this parent process is killed in maxpat (either by `node.script stop` or Max is shutdown for some reason),
// it will terminate the child process, the Electron app.
process.on("exit", () => {
	child.kill();
});
