// This file is the single-entrypoint for the Max patch.
// When this file is executed via `node.script start` in the Max patch,
// this program will launch an Electron app as a child process, and connect to it by socket.io

const MaxAPI = require("max-api");
const io = require("socket.io")();
const electron = require("electron");
const proc = require("child_process");
const child = proc.spawn(electron, ["."]);
const dgram = require('dgram')
const dsocket = dgram.createSocket('udp4');


dsocket.on('message', (msg, rinfo) => {
	var data = msg.toString('utf8').split(',').map(a => parseInt(a));
	offsetx = data[0];
	offsety = data[1];
	data = data.slice(2, data.length);

	var pixels = data.length / 4;
	var d = {
		reds: new Array(pixels),
		greens: new Array(pixels),
		blues: new Array(pixels),
		x: offsetx,
		y: offsety
	};

	for (var i = 0; i < data.length; i += 4) {
		d.reds[Math.floor(i / 4)] = data[i];
		d.greens[Math.floor(i / 4)] = data[i+1];
		d.blues[Math.floor(i / 4)] = data[i+2];
	}

	MaxAPI.outlet(d);
});

dsocket.on('listening', () => {
  const address = dsocket.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

dsocket.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  dsocket.close();
});

dsocket.bind({
	address: 'localhost',
	port: 9998
});

//const dgramserver
var stored_data = "";
var frame = 0;

io.on("connection", (socket) => {
	console.log("Socket is connected with Electron App");

	socket.on("dispatch", data => {
		data = data.split(' ');
		frame++;
		console.log(frame, data.length);
		  /*
			require("fs").writeFile("image.png", new Buffer(
				data.replace(/^data:image\/png;base64,/, ''), 'base64'
			).toString('binary'), "binary", function(err) {
				MaxAPI.outlet("image.png");
			});
			*/
	});
});

//io.listen(3000);

// This will ensure that when this parent process is killed in maxpat (either by `node.script stop` or Max is shutdown for some reason),
// it will terminate the child process, the Electron app.
process.on("exit", () => {
	child.kill();
	dsocket.close();
});
