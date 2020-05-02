/**
 * Shows the connection status (boolean) to a data provider (e.g. X-Plane). Optionally
 * displays a configuration button that indicates that the user wants to configure the
 * data provider.
 */

import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faWifi, faPlug, faCog } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

export default function ConnectionStatus({ dataProvider, connected, allowConfiguration = true }) {

    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('DataProviderScreen')} disabled={!allowConfiguration}>

            <View style={getContainerStyle(connected)}>

                <View style={styles.statusDescriptionContainer}>
                    {
                        connected ? (
                            <FontAwesomeIcon icon={faWifi} style={styles.connectedSymbol} size={20} />
                        ) : (
                                <FontAwesomeIcon icon={faPlug} style={styles.disconnectedSymbol} size={20} />

                            )
                    }

                    <Text>Data provider: {dataProvider}</Text>

                    {
                        connected ? (
                            <Text style={styles.statusContainerConnected}>(Connected)</Text>
                        ) : (
                                <Text style={styles.statusContainerDisconnected}>(Disconnected)</Text>
                            )
                    }
                </View>

                {allowConfiguration &&
                    <FontAwesomeIcon icon={faCog} size={22} color="gray" />
                }
            </View>
        </TouchableOpacity>
    );
}

function getContainerStyle(connected) {

    if (connected) {
        return {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            alignItems: 'center',
            backgroundColor: 'rgb(236, 250, 240)',
            borderRadius: 5,
            borderColor: '#0D953A',
            borderWidth: 2,
            marginBottom: 15,
        }
    } else {
        return {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            alignItems: 'center',
            backgroundColor: 'rgb(255, 204, 204)',
            borderRadius: 5,
            borderColor: 'red',
            borderWidth: 2,
            marginBottom: 15,
        }
    }
}

const styles = StyleSheet.create({
    statusDescriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusContainerConnected: {
        paddingLeft: 4,
        color: 'green',
    },
    statusContainerDisconnected: {
        paddingLeft: 4,
        color: 'red',
    },
    connectedSymbol: {
        color: 'green',
        marginRight: 7,
    },
    disconnectedSymbol: {
        color: 'red',
        marginRight: 7,
    }
});

ConnectionStatus.propTypes = {
    dataProvider: PropTypes.string.isRequired,
    connected: PropTypes.bool.isRequired,
    allowConfiguration: PropTypes.bool,
};