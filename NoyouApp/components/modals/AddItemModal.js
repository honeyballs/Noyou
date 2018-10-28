import React, { Component } from 'react'
import PropTypes from 'prop-types';  
import { View, Modal, Text, TouchableOpacity, TextInput, StyleSheet, Picker } from "react-native";
import DateTimePicker from 'react-native-modal-datetime-picker'

class ListNameModal extends Component {

    state = {
        name: '',
        due: 0,
        dateToDisplay: '',
        for: '',
        showDateModal: false
    }

    showDatePicker = () => {
        this.setState({showDateModal: !this.state.showDateModal})
    }

    confirmDatePick = date => {
        let due = date.getTime();
        let textDate = `${date.getDate()}.${`0${date.getMonth() + 1}`.substr(-2)}.${date.getFullYear()}, ${`0${date.getHours()}`.substr(-2)}:${`0${date.getMinutes()}`.substr(-2)}`;
        this.setState({due: due, dateToDisplay: textDate});
        this.showDatePicker()
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    this.props.setVisible();
            }}>
            <DateTimePicker 
                isVisible={this.state.showDateModal}
                onCancel={this.showDatePicker}
                onConfirm={this.confirmDatePick}
                mode='datetime'
            />
                <View style={styles.modal}>
                    <View style={styles.dialog}>
                        <Text style={styles.title}>Create item</Text>
                        <Text style={styles.label}>Name this item</Text>
                        <TextInput 
                            style={styles.input}
                            multiline={false}
                            autoCapitalize='words'
                            onChangeText={ text => this.setState({name: text})}
                            value={this.state.name}
                            placeholder='Item name'
                        />
                        {this.props.type === 'Todo' && (
                            <View>
                                <Text style={styles.label}>Who should do this task?</Text>
                                <Picker
                                    selectedValue={this.state.for}
                                    style={{height: 30, width: 200}}
                                    onValueChange={value => this.setState({for: value})}
                                >
                                    {[...this.props.users, {name: 'Whoever'}].map((user, index) => <Picker.Item key={index} value={user.name === 'Whoever' ? '' : user.name} label={user.name} />)}
                                </Picker>
                                <Text style={styles.label}>When is it due?</Text>
                                <TouchableOpacity onPress={() => this.showDatePicker()}>
                                    <Text style={styles.dateText}>{this.state.dateToDisplay === '' ? 'Touch here to pick a date' : this.state.dateToDisplay}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={styles.buttonBar}>
                            <TouchableOpacity onPress={() => {
                                this.props.setVisible();
                            }}>
                                <Text style={styles.okButton}>
                                    CANCEL
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if (this.state.name === '' || (this.state.due === 0) && this.props.type === 'Todo') {
                                    alert('Please enter the item name and the due date (if required).');
                                } else {
                                    this.setState({name: ''});
                                    this.props.add(this.state.name, this.state.due, this.state.for);
                                    this.props.setVisible();
                                }
                            }}>
                                <Text style={styles.okButton}>
                                    ADD
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
    label: {
        marginTop: 10,
        fontWeight: 'bold'
    },
    dateText: {
        color: '#000',
        marginTop: 5
    },
    buttonBar: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    okButton: {
        fontWeight: 'bold',
        color: 'darkgreen',
        marginLeft: 20
    }
})

ListNameModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setVisible: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired
}

export default ListNameModal;


