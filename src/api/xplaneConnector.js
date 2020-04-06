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

    analyzeRPOSMessage([
        82,
        80,
        79,
        83,
        52,
        52,
        65,
        19,
        96,
        42,
        112,
        21,
        192,
        238,
        206,
        18,
        151,
        80,
        19,
        66,
        64,
        0,
        0,
        240,
        241,
        196,
        163,
        18,
        64,
        137,
        53,
        170,
        61,
        14,
        103,
        134,
        63,
        72,
        191,
        174,
        66,
        212,
        156,
        183,
        61,
        158,
        203,
        153,
        183,
        9,
        194,
        246,
        54,
        249,
        221,
        138,
        184,
        144,
        135,
        115,
        184,
        6,
        167,
        50,
        183,
        120,
        248,
        192,
        181,
    ]);

    //bind();
    //listenToXPlaneOutput();
    //requestXPlaneOutput(remoteAddress);
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
        analyzeXPLANEResponse(msg);
    });
}

/**
 * Analyzes an X-Plane response. Currently implements analyses for RPOS messages.
 * 
 * @param {byte array} msg to be analyzed
 */
function analyzeXPLANEResponse(msg) {

    switch (bytesToString(msg.slice(0, 4))) {
        case "RPOS":
            analyzeRPOSMessage(msg);
            break;
        default:
            console.log("Received unknown message");
    }
}

function bytesToString(byteArray) {
    var result = "";
    for (var i = 0; i < byteArray.length; i++) {
        result += String.fromCharCode(parseInt(byteArray[i], 2));
    }
    return result;
}


/**
 * Extracts the following RPOS information: Heading (deg), Elevation ASL (meters), 
 * Elevation AGL (meters), Roll (deg).
 * 
 * @param {byte array} msg the complete RPOS X-Plane message
 */
function analyzeRPOSMessage(msg) {

    console.log("Received RPOS message. Analyzing now.");

    //let longitude = constructFloat(msg.slice(5, 13)); //longitude

    let heading = constructFloat(msg.slice(37, 41));
    let elevationASL = constructFloat(msg.slice(21, 29)); // meters
    let elevationAGL = constructFloat(msg.slice(29, 33)); // meters
    let roll = constructFloat(msg.slice(41, 45));
}

/**
 * @param {byte array} byteArray expects either 4 or 8 bytes of data with the byte at
 * index 0 representing the little endian of the information.
 * @returns a Float32 or Float64 that represents the specified data, depending 
 * on the length of byteArray (4 bytes or 8 bytes).
 */
function constructFloat(byteArray) {

    var reversedData = byteArray.reverse();

    var buffer = new ArrayBuffer(byteArray.length);
    var view = new DataView(buffer);
    reversedData.forEach(function (b, i) {
        view.setUint8(i, b);
    });

    if (byteArray.length == 4) {
        return view.getFloat32(0);
    } else {
        return view.getFloat64(0);
    }
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
