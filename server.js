var	express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	client = require('socket.io').listen(server).sockets,
	bot = require('./bot/dialog');


server.listen(8081);
app.use(express.static('public'))
app.get('/', function (req, res) {
res.sendFile(__dirname + '/index.html');
});
	client.on('connection', function(socket) {
		//wait for input
		var sendStatus = function(s){
				socket.emit('status', s);
			};
			socket.emit('init', []);
		//Emit messages

		socket.on('input', function(data){
			var name = data.name,
				message = data.message,
				whitespacePattern = /^\s*$/;

			if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
				sendStatus("Name and message is required.");
			} else {
					bot.callBot(data.message, data.contextId)
						.then(result => {
							return bot.doNext(result);
						})
						.then(result => {
							console.log(result);
							switch (result.doNext) {
								case 'answer':
									socket.emit('output', [{
										name: 'AwesomeO',
										message: result.botAnswer,
										contextId: result.contextId
									}])
									sendStatus({
										message: "Message sent",
										clear: true
									});
									break;
								case 'action':
									bot.doAction(result)
										.then(actionResult => {
											Promise.resolve(actionResult.result).then(message => {
												if(message !== null){
													socket.emit('output', [{
														name: 'AwesomeO',
														message: message,
														contextId: null
													}])
												}
											});

										})
									break;
								default:

							}
						})
				}
					})
					//Emit lates message to ALL clients
});

//var socket = io.connect('http://127.0.0.1:8081');
