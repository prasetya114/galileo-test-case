// Create app, http, and socket
var express = require('express');
var mraa = require('mraa');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// let everything from public directory served as static files
app.use('/static', express.static('public'));

// Define led object as output (pin 13)
var led = new mraa.Gpio(13);
led.dir(mraa.DIR_OUT);

// Define trig and echo as output (echo: pin 12, trig : print 11)
var btn = new mraa.Gpio(12);
btn.dir(mraa.DIR_IN);

// Routes
app.get('/', function(req, res)
{
    res.sendFile(__dirname+'/views/view.html');
});

app.get('/turn-on', function(req, res)
{
    led.write(1);
    res.send('turned on');
});

app.get('/turn-off', function(req, res)
{
    led.write(0);
    res.send('turned off');
});

// Socket
io.on('connection', function(socket)
{
    console.log('Socket connection openned');
    // socket event
    socket.on('disconnect', function()
    {
       console.log('Socket connection closed');
    });
});

	// function to detect btn state and send it to every clients
	function detect_button()
	{
	    state = btn.read();
	    io.emit('button state', state);
	    setTimeout(detect_button,100); // let's do it again after 1/10 second
	    if(state == 1)
	    {
	    	led.write(1);
	    	setTimeout(state,100);
	    	led.write(0);
	    	setTimeout(state,100);
	    	led.write(1);
	    	setTimeout(state,100);
	    	led.write(0);
	    	setTimeout(state,100);
	    	led.write(1);
	    	setTimeout(state,100);
	    	led.write(0);
	    	setTimeout(state,100);
	    	led.write(1);
	    	setTimeout(state,100);
	    	led.write(0);
	    	setTimeout(state,100);
	    	led.write(1);
	    	setTimeout(state,100);
	    	led.write(0);
	    	setTimeout(state,1500);
	    		
	    }else
	    {
	    	led.write(0);
	    }
	}
	detect_button(); // execute the function

	// Listen
	http.listen(8080, function()
	{
	    console.log('Listening request from port 8080, press Ctrl+C to end it');
	});
