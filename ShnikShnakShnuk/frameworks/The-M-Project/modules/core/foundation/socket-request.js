// ==========================================================================
// Project:   The M-Project - Mobile HTML5 Application Framework
// Copyright: (c) 2010 M-Way Solutions GmbH. All rights reserved.
//            (c) 2011 panacoda GmbH. All rights reserved.
// Creator:   Marita Klein
// Date:      28.10.2011
// License:   Dual licensed under the MIT or GPL Version 2 licenses.
//            http://github.com/mwaylabs/The-M-Project/blob/master/MIT-LICENSE
//            http://github.com/mwaylabs/The-M-Project/blob/master/GPL-LICENSE
// ==========================================================================

m_require('core/foundation/object.js');

/**
 * @class
 *
 * The root class for socket-requests. Uses Socket-IO to sending end receiving messages of a socket-port.
 * functions are send(), receive() and close()
 * On first call of this methods, the connection will be initialized.
 * So all listeners (onConnect, onDisconnect, onError) should be specified at the first call.
 * Later it is not necessary, but you can override them. To clear a callback, leave it empty (e.g.: callbacks: onError:{})
 *
 * Callbacks are: onConnect, onDisconnect, onError, onMessage(for receive data)
 * Form: "callbacks: {onMessage:{target: MyApp.MyController, action: 'writeMessage'}, onError:{...}}"
 *
 * @extends M.Object
 */
M.SocketRequest = M.Object.extend(
    /** @scope M.Request.prototype */ {

        /**
         * The type of this object.
         *
         * @type String
         */
        type: 'M.SocketRequest',



        /**
         * holds all socket-connections, and corresponding channel-callbacks
         *
         * @type Object-Array
         */
        socketConnection: [],


        /**
         * sends message to given url-socket-connection and channel,
         * creates new connection if it is not yet existing.
         *
         * @param obj with structure: {url: 'http://myurl.de:8080', channel: 'message', messag: 'hi there'}
         */
        send: function(obj) {
            var socket = this.getSocket(obj.url);

            //send message
            socket.emit(obj.channel, obj.message);

            //add listeners
            if (typeof (obj.callbacks) !== 'undefined')
                this.setListener(socket, obj.callbacks);
        },

        /**
         * listen on message to given url-socket-connection and channel,
         * creates new connection if it is not yet existing.
         *
         * @param obj with structure: {url: 'http://myurl.de:8080', channel: 'message', callbacks: {onMessage:{target: MyApp.MyController, action: 'writeMessage'}}}
         */
        receive: function(obj) {
            var socket = this.getSocket(obj.url);
            var that = this;

            //remove existing listener (to override)
            socket.removeAllListeners(obj.channel);
            //socket successful connected
            socket.on(obj.channel, function (data) {
                //bind all answers to given target
                that.bindToCaller(obj.callbacks.onMessage.target, obj.callbacks.onMessage.target[obj.callbacks.onMessage.action], [data])();
            });

            //add listeners
            if (typeof (obj.callbacks) !== 'undefined')
                this.setListener(socket, obj.callbacks);


        },

        /**
         * Close the connection.
         *
         * @return Boolean indicating whether connection was closed.
         */
        close: function(obj) {
//            var socket = this.getSocket(obj.url);

            var socket = {};
            var socketArray = [];

            //search for connection
            for (var i = 0; i < this.socketConnection.length; i++) {
                var socketURL = this.socketConnection[i].socket.options.host + ':'
                    + this.socketConnection[i].socket.options.port;
                socketURL += this.socketConnection[i].name;

                //if socket-connection is matching
                if (obj.url.indexOf(socketURL) !== -1) {
                    socket = this.socketConnection[i];
                }
                //add to tem-array if not containing
                else {
                    socketArray.push(this.socketConnection[i]);
                }
            }
            if (typeof(socket.socket) !== 'undefined') {
                //add listeners
                if (typeof (obj.callbacks) !== 'undefined')
                    this.setListener(socket, obj.callbacks);

                socket.disconnect();
                //disconnection succsessful:
                if (socket.socket.connected === false) {
                    this.set('socketConnection', socketArray);
                }
            }
            else {
                M.Logger.log('No open connection to ' + obj.url, M.WARN);
            }
        },


        /**
         *  Checks if socket-connection still exist (in 'socketConnection',
         *  or creates a new one and adds it to this array.
         *
         *  Returns this socket-object
         * @param url
         * @return socket-object to emit and listen
         */
        getSocket: function(url) {
            var socket = {};
            var index = -1;

//            var host = url.substr()

            //search for exsisting connection
            for (var i = 0; i < this.socketConnection.length; i++) {

                //generate url
                var socketURL = this.socketConnection[i].socket.options.host + ':'
                    + this.socketConnection[i].socket.options.port;

                //add possible url-path
                socketURL += this.socketConnection[i].name;

                if (url.indexOf(socketURL) !== -1) {
                    index = i;
                    break;
                }
            }

            //if not containing:
            if (index === -1) {
                //init secure-connection
                if (url.indexOf('https') !== -1) {
                    socket = io.connect(url, {secure: true});
                }
                else {
                    socket = io.connect(url);
                }
                this.socketConnection.push(socket);
            }
            //if socket-connection still exist:
            else {
                socket = this.socketConnection[index];
            }

            return socket;
        },


        /**
         * Adds error, connected and disconnected listeners
         * (if given in obj)
         * @param socket on which to listen
         * @param obj including the callback-methods
         */
        setListener: function(socket, obj) {
            var that = this;
            //allways send error messages (M.Logger-messages)-----------------------------
            //clear existing error-callbacks:
            socket.removeAllListeners('error');
            socket.socket.removeAllListeners('error');
            socket.removeAllListeners('connect_failed');
            socket.socket.removeAllListeners('connect_failed');

            // if connection, failed:
            socket.on('error', function(e) {

                if (typeof(obj.onError) !== 'undefined' && typeof(obj.onError.target) !== 'undefined') {
                    that.bindToCaller(obj.onError.target, obj.onError.target[obj.onError.action], [])();
                }
                else {
                    M.Logger.log("Error occurred while Socket-connection!", M.ERR);
                }
            });

            socket.socket.on('error', function(e) {

                if (typeof(obj.onError) !== 'undefined' && typeof(obj.onError.target) !== 'undefined') {
                    that.bindToCaller(obj.onError.target, obj.onError.target[obj.onError.action], [])();
                }
                else {
                    M.Logger.log("Error occurred while Socket-connection!", M.ERR);
                }
            });

            socket.on('connect_failed', function(e) {

                if (typeof(obj.onError) !== 'undefined' && typeof(obj.onError.target) !== 'undefined') {
                    that.bindToCaller(obj.onError.target, obj.onError.target[obj.onError.action], [])();
                }
                else {
                    M.Logger.log("Error occurred while Socket-connection!", M.ERR);
                }
            });

            socket.socket.on('connect_failed', function(e) {

                if (typeof(obj.onError) !== 'undefined' && typeof(obj.onError.target) !== 'undefined') {
                    that.bindToCaller(obj.onError.target, obj.onError.target[obj.onError.action], [])();
                }
                else {
                    M.Logger.log("Error occurred while Socket-connection!", M.ERR);
                }
            });
            //------------------------------------------------------------

            //on connect
            if (typeof(obj.onConnect) !== 'undefined') {
                //delete listener (if specified)
                socket.removeAllListeners('connect');
                //add new listener (if specified --> not: onConnect: {} )
                if (typeof(obj.onConnect.target) !== 'undefined') {
                    socket.on('connect', function() {
                        that.bindToCaller(obj.onConnect.target, obj.onConnect.target[obj.onConnect.action], [])();
                    });
                }
            }

            //on disconnect
            if (typeof(obj.onDisconnect) !== 'undefined') {
                //delete listener (if specified)
                socket.removeAllListeners('disconnect');
                //add new listener (if specified --> not: onDisconnect: {} )
                if (typeof(obj.onDisconnect.target) !== 'undefined') {
                    socket.on('disconnect', function() {
                        that.bindToCaller(obj.onDisconnect.target, obj.onDisconnect.target[obj.onDisconnect.action], [])();
                    });
                }
            }
        }
    });