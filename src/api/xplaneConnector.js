/**
 * Manages interaction with an X-Plane server. Sends a UDP request for flight data
 * to X-Plane and receives flight data information on a specified UDP port.
 * 
 * @author Sebastian Feger
 */

import React from 'react';
import PropTypes from "prop-types";
import { signalRPOSDataReceived, singalDataRefReceived, connectionStatusChanged, connectionStatus } from "../actions/actions";

import datarefs from "../atoms/XPlaneDataRefs";

const xplaneMessages = {
    GET_XPLANE_RPOS_OUTPUT: "RPOS05",
    STOP_XPLANE_OUTPUT: "RPOS000",
};

const dgram = require('react-native-udp');
const socket = dgram.createSocket('udp4');
var socketBound = false;

var timestampLastMessageReceived = 0;
var watchdogTimer;

var currentlyConnected = false;
var remoteAddress;

var store;

const RREF_REQUEST = {
    INDICATED_AIRSPEED: { id: 1, dataref: "sim/flightmodel/position/indicated_airspeed", frequency: 5 },
    ENGINE_RPM: { id: 2, dataref: "sim/cockpit2/engine/indicators/engine_speed_rpm[0]", frequency: 2 },
};

export default class XPlaneConnector extends React.Component {

    constructor(props) {
        super(props);
        console.log("Creating X-Plane connector");

        this.store = props.store;
        this.remoteAddress = props.remoteAddress;

        this.bindToPort();

        this.requestXPlaneOutput(props.remoteAddress);
        this.listenToXPLANEOutput();

        this.startConnectionWatchdog();
    }


    render() {
        return null;
    }

    /**
     * Checks for incoming messages from X-Plane. If message reception is interrupted for more
     * than one second, a change in the connection status is signaled. 
     */
    startConnectionWatchdog() {
        watchdogTimer = setInterval(function () { this.checkConnectionStatus() }.bind(this), 500);
    }

    /**
     * Cancels checks for X-Plane message reception.
     */
    stopConnectionWatchdog() {
        clearInterval(watchdogTimer);
    }

    /**
     * Informs about changes in the connection to X-Plane. Attempts to restart information flow
     * in case of missing connection.
     */
    checkConnectionStatus() {
        if (new Date().getTime() - timestampLastMessageReceived > 1000) {

            if (currentlyConnected) {
                currentlyConnected = false;
                this.store.dispatch(connectionStatusChanged(connectionStatus.NOT_CONNECTED));
            }

            this.requestXPlaneOutput(this.remoteAddress);

        } else {
            if (!currentlyConnected) {
                currentlyConnected = true;
                this.store.dispatch(connectionStatusChanged(connectionStatus.CONNECTED));
            }
        }
    }

    listenToXPLANEOutput() {

        socket.on('message', (msg) => {
            this.analyzeXPLANEResponse(msg);
            timestampLastMessageReceived = new Date().getTime();
        });
    }

    /**
 * @param {*} port to which the sockets binds. Defaults to 49000.
 */
    bindToPort(port = 49005) {

        if (!socketBound) {
            socket.bind(port);
            socketBound = true;
        }
    }


    /**
     * Analyzes an X-Plane response. Currently implements analyses for RPOS messages.
     * 
     * @param {byte array} msg to be analyzed
     */
    analyzeXPLANEResponse(msg) {

        const commandString = String.fromCharCode(msg[0], msg[1], msg[2], msg[3]);

        switch (commandString) {
            case "RPOS":
                this.analyzeRPOSMessage(msg);
                break;
            case "RREF":
                this.analyzeRREFMessage(msg);
                break;
            default:
                console.log("Received unknown message");
        }
    }

    /**
 * @param {byte array} byteArray expects either 4 or 8 bytes of data with the byte at
 * index 0 representing the little endian of the information.
 * @returns a Float32 or Float64 that represents the specified data, depending 
 * on the length of byteArray (4 bytes or 8 bytes).
 */
    constructFloat(byteArray) {

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
    requestXPlaneOutput(remoteAddress) {

        this.sendMessage(xplaneMessages.GET_XPLANE_RPOS_OUTPUT, remoteAddress);

        const iasREF = RREF_REQUEST.INDICATED_AIRSPEED;
        this.sendRREFRequest(iasREF.frequency, iasREF.id, iasREF.dataref, remoteAddress);

        const rpmREF = RREF_REQUEST.ENGINE_RPM;
        this.sendRREFRequest(rpmREF.frequency, rpmREF.id, rpmREF.dataref, remoteAddress);
    }

    /**
     * Sends an RREF request to XPlane to request data from a specific dataframe.
     * 
     * @param {int} requestID, the unique ID for this request. Will be sent back by XPlane
     * @param {string} dataRef, the name of the dataref to be read
     */
    sendRREFRequest(frequency, requestID, dataRef, remoteAddress) {

        var buffer = new Uint8Array(413);

        const command = "RREF0";

        for (var i = 0, l = command.length; i < l; i++) {
            buffer[i] = command.charCodeAt(i);
        }

        buffer[5] = frequency;
        buffer[12] = requestID;

        for (var i = 0, l = dataRef.length; i < l; i++) {
            buffer[13 + i] = dataRef.charCodeAt(i);
        }

        socket.send(buffer, 0, buffer.length, 49000, remoteAddress, function (err) {
            console.log('XPlane _RREF_ Data Request sent');
        });
    }
    /**
     * @param {string} message to be sent to the simulator
     */
    sendMessage(message, remoteAddress) {

        var buffer = this.toByteArray(message);

        socket.send(buffer, 0, buffer.length, 49000, remoteAddress, function (err) {
            console.log('XPlane Data Request sent');
        });
    }

    toByteArray(obj) {
        var uint = new Uint8Array(obj.length);
        for (var i = 0, l = obj.length; i < l; i++) {
            uint[i] = obj.charCodeAt(i);
        }
        return new Uint8Array(uint);
    }

    /**
     * Extracts the following RPOS information: Heading (deg), Elevation ASL (meters), 
     * Elevation AGL (meters), Roll (deg).
     * 
     * @param {byte array} msg the complete RPOS X-Plane message
     */
    analyzeRPOSMessage(msg) {

        //let longitude = constructFloat(msg.slice(5, 13)); //longitude
        const feetConversion = 3.28084;

        let heading = this.constructFloat(msg.slice(37, 41));
        let elevationASL = this.constructFloat(msg.slice(21, 29)); // meters
        let elevationAGL = this.constructFloat(msg.slice(29, 33)); // meters
        let roll = this.constructFloat(msg.slice(41, 45));

        let aglInFeet = elevationAGL * feetConversion;
        let aslInFeet = elevationASL * feetConversion;

        this.store.dispatch(signalRPOSDataReceived(heading = heading, elevASL = aslInFeet, elevAGL = aglInFeet, roll = roll));
    }

    analyzeRREFMessage(msg) {

        const id = msg[8];
        const value = this.constructFloat(msg.slice(9, 13));

        switch (id) {
            case RREF_REQUEST.INDICATED_AIRSPEED.id:
                this.store.dispatch(singalDataRefReceived(datarefs.INDICATED_AIRSPEED, value));
                break;
            case RREF_REQUEST.ENGINE_RPM.id:
                this.store.dispatch(singalDataRefReceived(datarefs.ENGINE_RPM, value));
                break;
            default: console.log("Received unknown RREF dataframe");
        }
    }

}
