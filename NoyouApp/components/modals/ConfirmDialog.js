import React, { Component } from 'react'
import PropTypes from 'prop-types';  
import { View, Modal, Text, TouchableOpacity, StyleSheet } from "react-native";

class ConfirmDialog extends Component {
    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    this.props.setVisible();
                }}>
                <View style={styles.modal}>
                    <View style={styles.dialog}>
                        <Text style={styles.title}>
                            {this.props.title}
                        </Text>
                        <Text>
                            {this.props.text}
                        </Text>
                        <View style={styles.buttonBar}>
                            <TouchableOpacity onPress={() => {
                                this.props.setVisible();
                            }}>
                                <Text style={styles.okButton}>
                                    CANCEL
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.props.confirm();
                                this.props.setVisible();
                            }}>
                                <Text style={styles.okButton}>
                                    OK
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: '#00000080',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15
    },
    dialog: {
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15
    },
    buttonBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 15
    },
    okButton: {
        fontWeight: 'bold',
        color: 'darkgreen',
        marginLeft: 20
    }
})

ConfirmDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    confirm: PropTypes.func.isRequired
}

export default ConfirmDialog;


