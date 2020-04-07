/**
 * Manages interaction with an X-Plane server. Sends a UDP request for flight data
 * to X-Plane and receives flight data information on a specified UDP port.
 * 
 * @author Sebastian Feger
 */

import React from 'react';
import PropTypes from "prop-types";
import { signalRPOSDataReceived } from "../actions/actions";


const xplaneMessages = {
    GET_XPLANE_OUTPUT: "RPOS010",
    STOP_XPLANE_OUTPUT: "RPOS000",
};

const dgram = require('react-native-udp');
const socket = dgram.createSocket('udp4');
var socketBound = false;
var store;

export default class XPlaneConnector extends React.Component {


    constructor(props) {
        super(props);
        console.log("Creating X-Plane connector");

        this.store = props.store;

        this.bindToPort();
        this.requestXPlaneOutput(props.remoteAddress);
        this.listenToXPLANEOutput();
    }


    render() {
        return null;
    }

    listenToXPLANEOutput() {

        socket.on('message', (msg) => {
            this.analyzeXPLANEResponse(msg);
        })
    }

    /**
 * @param {*} port to which the sockets binds. Defaults to 49000.
 */
    bindToPort(port = 49000) {

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

        this.analyzeRPOSMessage(msg);

        //@todo get this working
        /*switch (bytesToString(msg.slice(0, 4))) {
            case "RPOS":
                analyzeRPOSMessage(msg);
                break;
            default:
                console.log("Received unknown message");
        }*/
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
        this.sendMessage(xplaneMessages.GET_XPLANE_OUTPUT, remoteAddress);
    }

    /**
     * @param {*} message to be sent to the simulator
     */
    sendMessage(message, remoteAddress) {
        var buf = this.toByteArray(message, remoteAddress);

        socket.send(buf, 0, buf.length, 49000, remoteAddress, function (err) {
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

    bytesToString(byteArray) {
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


}
