import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationArrow, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { setDataProvider } from "../actions/actions";
import dataProviders from "../atoms/DataProviders";


function ProviderItem({ itemName, simulated, selectedProvider, disableTouch = false }) {

    return (
        <TouchableOpacity onPress={() => selectedProvider(itemName)} disabled={disableTouch}>
            <View style={styles.overallContainer}>
                {simulated ? (
                    <FontAwesomeIcon icon={faGamepad} size={20} color="gray" style={styles.iconContainer} />

                ) : (
                        <FontAwesomeIcon icon={faLocationArrow} size={20} color="gray" style={styles.iconContainer} />
                    )}
                <Text>{itemName}</Text>
            </View>
        </TouchableOpacity>
    );
}

ProviderItem.propTypes = {
    itemName: PropTypes.string.isRequired,
    simulated: PropTypes.bool.isRequired,
    selectedProvider: PropTypes.func.isRequired,
    disableTouch: PropTypes.bool,
};

const styles = StyleSheet.create({
    overallContainer: {
        flexDirection: 'row',
        padding: 12,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 5,
        marginTop: 5,
    },
    iconContainer: {
        marginRight: 10,
    }
});

function mapStateToProps(state, ownProps) {
    return {

    };
}

const mapDispatchToProps = dispatch => ({
    selectedProvider: dataProvider => dispatch(setDataProvider(dataProvider)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProviderItem);

