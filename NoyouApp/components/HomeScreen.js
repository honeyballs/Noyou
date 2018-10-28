import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';

import store from "../flux/store";
import actions from "../flux/actions";

import NameModal from "./modals/NameModal";

export default class HomeScreen extends Component {
    
    static navigationOptions = {
        title: 'Noyou',
    };

    socket = null; 

    constructor(props) {
        super(props);
        this.state = {...store.getState(), showModal: false}
        this.socket = props.screenProps
    }

    componentDidMount() {  
        store.listen(this.onChange);
        actions.setCurrentList({});
        actions.setType('');
        this._loadName();
    }

    componentWillUnmount() {
        store.unlisten(this.onChange);
    }

    onChange = state => {
        this.setState({...state, showModal: this.state.showModal});
    }

    _loadName = async () => {
        try {
            const username = await AsyncStorage.getItem('USERNAME');
            if (username !== null) {
                actions.setUsername(username);
            } else {
                this.setModalVisible();
            }
        } catch (error) {
            console.log(error);
        }
    }

    _saveName = async (username) => {
        try {
            await AsyncStorage.setItem('USERNAME', username);
        } catch (error) {
            console.log(error);
        }
    }

    setModalVisible = () => {
        this.setState({showModal: !this.state.showModal});
    }

    setUserName = name => {
        this._saveName(name);
        actions.setUsername(name);
        this.socket.emit('create user', {name: name});
    }

    navigate = type => {
        actions.setType(type)
        this.props.navigation.navigate('Lists', {type: type})
    }
    
    render() {
        return (
            <View style={styles.container}>
                <NameModal visible={this.state.showModal} setVisible={this.setModalVisible} confirmName={this.setUserName}/>
                <Text style={styles.greeting}>
                    Hi, {this.state.username}!
                </Text>
                <TouchableOpacity style={styles.buttons}
                    onPress={() => this.navigate('Shopping')}>
                        <Text style={styles.text}>
                            Shopping
                        </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.buttons, styles.todoButton]}
                    onPress={() => this.navigate('Todo')}>
                        <Text style={styles.text}>
                            ToDo
                        </Text>
                </TouchableOpacity>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        padding: 15
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'flex-start'
    },
    buttons: {
        flex: 1,
        width: '100%',
        marginTop: 15,
        marginBottom: 15,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#bae1ff',
        borderRadius:10,
        borderWidth: 0,
        elevation: 3
    },
    todoButton: {
        backgroundColor: '#FFCDD1'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    }
});