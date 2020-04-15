import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { connect } from 'react-redux';


function ConnectionStatus() {

    return (
        <View style={styles.itemContainer}>
            <Text>Data provider: SimName</Text>
            <Text style={styles.statusContainer}>(Connected)</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        borderColor: 'green',
        borderWidth: 2,
        marginBottom: 15,
    },
    statusContainer: {
        paddingLeft: 4,
        color: 'green',
    }
});

function mapStateToProps(state, ownProps) {
    return {

    };
}

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionStatus)
