/**
 * Manages interaction with an X-Plane server. Sends a UDP request for flight data
 * to X-Plane and receives flight data information on a specified UDP port.
 * 
 * @author Sebastian Feger
 */

import React from 'react';
import PropTypes from "prop-types";

const xplaneMessages = {
    GET_XPLANE_OUTPUT: "RPOS010",
    STOP_XPLANE_OUTPUT: "RPOS000",
};

const dgram = require('react-native-udp');
const socket = dgram.createSocket('udp4');
var socketBound = false;

export default function xplaneConnector(remoteAddress) {

    console.log("Creating X-Plane connector");

    bind();
    listenToXPlaneOutput();
    requestXPlaneOutput(remoteAddress);
}

/**
 * @param {*} port to which the sockets binds. Defaults to 49000.
 */
function bind(port = 49000) {

    if (!socketBound) {
        socket.bind(port);
        socketBound = true;
    }
}

/**
 * Listens for X-Plane responses.
 */
function listenToXPlaneOutput() {
    socket.on('message', function (msg, rinfo) {
        console.log('message was received', msg);
    });
}

/**
 * Sends a UDP request for flight data to an X-Plane server.
 * 
 * @param {*} remoteAddress of the host running X-Plane
 */
function requestXPlaneOutput(remoteAddress) {
    sendMessage(xplaneMessages.GET_XPLANE_OUTPUT, remoteAddress);
}

/**
 * @param {*} message to be sent to the simulator
 */
function sendMessage(message, remoteAddress) {
    var buf = toByteArray(message, remoteAddress);

    socket.send(buf, 0, buf.length, 49000, remoteAddress, function (err) {
        console.log('XPlane Data Request sent');
    });
}

function toByteArray(obj) {
    var uint = new Uint8Array(obj.length);
    for (var i = 0, l = obj.length; i < l; i++) {
        uint[i] = obj.charCodeAt(i);
    }

    return new Uint8Array(uint);
}
