/**
 * Displays configuration items for a data provider (e.g. X-Plane). Supports boolean configuration
 * items (Enabled / Disabled) and text inputs. Displays a descriptive text next to each button or
 * text input.
 */

import React from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";

export default function ProviderConfigurations({ configuration }) {

    const configurationItems = [];

    for (let [key, value] of Object.entries(configuration)) {
        if (key != "provider") {

            const itemName = getItemDisplayName(key);

            switch (typeof (value)) {
                case "boolean": {
                    configurationItems.push(
                        <View style={styles.itemContainer}>
                            <Text>{itemName}</Text>
                            {value ? (
                                <Button title="Enabled" />
                            ) : (
                                    <Button title="Disabled" />
                                )
                            }
                        </View>
                    );
                }
                case "string": {
                    configurationItems.push(
                        <View style={styles.itemContainer}>
                            <Text>{itemName}</Text>
                            <TextInput maxLength={20} style={styles.textInput} />
                        </View>
                    );
                }

            }
        }
    }

    return (
        <View>
            {
                configurationItems
            }
        </View>
    );
}



/**
 * Transforms a string name by replacing underscores with spaces, changing the first letter to a capital letter, and adding a colon at the end.
 * 
 * @example "automated_search" -> "Automated search:"
 * @param {*} configurationName the title of a configuration item that is transformed
 */
function getItemDisplayName(configurationName) {

    return configurationName.charAt(0).toUpperCase() + configurationName.substring(1).replace(/_/, " ") + ": ";
}


const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        padding: 4,
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    iconContainer: {
        marginRight: 10,
    },
    textInput: {
        borderColor: "gray",
        borderWidth: 1,
        height: 30,
        backgroundColor: "white",
        width: 150,
        textAlign: 'right'
    }
});