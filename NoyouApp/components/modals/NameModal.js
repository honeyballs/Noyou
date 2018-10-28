import React, { Component } from 'react'
import PropTypes from 'prop-types';  
import { View, Modal, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";

class NameModal extends Component {

    state = {
        name: ''
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    alert("You won't be able to use the app without setting a name first.");
                }}>
                <View style={styles.modal}>
                    <View style={styles.dialog}>
                        <Text style={styles.title}>What's your name, cutie?</Text>
                        <TextInput 
                            style={styles.input}
                            multiline={false}
                            autoCapitalize='words'
                            onChangeText={ text => this.setState({name: text})}
                            value={this.state.name}
                            placeholder='Your name'
                        />
                        <View style={styles.buttonBar}>
                            <TouchableOpacity onPress={() => {
                                if (this.state.name === '') {
                                    alert('Please enter your name.');
                                } else {
                                    this.props.confirmName(this.state.name);
                                    this.props.setVisible();
                                }
                            }}>
                                <Text style={styles.okButton}>
                                    YEP, THAT'S ME
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
    input: {
        width: '100%',
        margin: 0,
    },
    buttonBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    okButton: {
        fontWeight: 'bold',
        color: 'darkgreen'
    }
})

NameModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    confirmName: PropTypes.func.isRequired
}

export default NameModal;


