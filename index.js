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
	MaxAPI.post(data.length, data)



	var mydata = {
		"reds": [],
		"greens": [],
		"blues": []
	};

	var j = 0;
	for (var i = 0; i < data.length; i+=12) {
		mydata.reds[j] = parseInt(data.substring(i, i+3))
		mydata.greens[j] = parseInt(data.substring(i+4, i+6))
		mydata.blues[j] = parseInt(data.substring(i+7, i+9))
		j++;
	}

	MaxAPI.outlet(mydata)
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
