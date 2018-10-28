import React, { Component } from 'react'
import { AppState, View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

import store from "../flux/store";
import actions from "../flux/actions";

import ListNameModal from "./modals/ListNameModal";
import ConfirmDialog from './modals/ConfirmDialog';

export default class ListScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        const title = navigation.getParam('type', 'Lists');
        return {
            title: title,
            headerStyle: {
                backgroundColor: title === 'Shopping' ? '#bae1ff' : '#FFCDD1'
            },
            headerTintColor: '#fff',
            headerRight: (
                <TouchableOpacity 
                    style={{marginRight: 20}}
                    onPress={navigation.getParam('showAddModal')}
                >
                    <Text style={{color: '#fff', fontSize: 30}}>
                        +
                    </Text>
                </TouchableOpacity>
            ),
        }
    };

    socket = null;

    constructor(props) {
        super(props);
        this.socket = props.screenProps;
        this.state = {
            ...store.getState(), 
            appState: AppState.currentState,
            showAddModal: false, 
            showConfirmModal: false, 
            showLoading: false};
    }

    componentDidMount() {
        store.listen(this.onChange);
        AppState.addEventListener('change', this._handleAppStateChange);
        this.showLoading(true);
        actions.setCurrentList({});
        this.props.navigation.setParams({showAddModal: this.showAddModal})
        
        // Add callbacks to the socket object
        this.socket.on('send lists', lists => {
            this.showLoading(false)
            if (typeof lists === 'object' && lists.hasOwnProperty('error')) {
                alert(lists.error);
            } else {
                actions.setLists(lists);
            }
        })

        this.socket.on('add list', list => {
            if (list.hasOwnProperty('error')) {
                alert(list.error);
            } else if (list.type === this.state.type) {
                actions.addToLists(list);
            }
        })

        this.socket.on('remove list', id => {
            if (typeof id === 'object' && id.hasOwnProperty('error')) {
                alert(id.error);
            } else {
                actions.deleteList(id);
            }
        }) 

        this.socket.emit('get lists', {type: this.state.type});
        //actions.fetchLists(this.state.type);

    }

    componentWillUnmount() {
        store.unlisten(this.onChange);
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.socket.removeAllListeners('send lists');
        this.socket.removeAllListeners('add list');
        this.socket.removeAllListeners('remove list');
    }

    onChange = state => {
        this.setState({...state});
    }

    _handleAppStateChange = nextState => {
        // Refresh data from server after returning to the app
        if(this.state.appState.match(/inactive|background/) && nextState === 'active') {
            this.showLoading(true);
            this.socket.emit('get lists', {type: this.state.type});
        }
        this.setState({appState: nextState});
    }

    showAddModal = () => {
        this.setState({showAddModal: !this.state.showAddModal});
    }

    showConfirmModal = id => {
        this.setState({showConfirmModal: !this.state.showConfirmModal, idToDelete: id});
    }

    showLoading = show => {
        this.setState({showLoading: show})
    }

    createList = listname => {
        this.socket.emit('create list', {type: this.state.type, name: listname, creator: this.state.username});
    }

    confirmDelete = () => {
        if (this.state.idToDelete && this.state.idToDelete !== '') {
            this.socket.emit('delete list', {id: this.state.idToDelete});
            this.setState({idToDelete: ''});
        } 
    }

    navigateToList = (id, name, creator) => {
        actions.setCurrentList({id, name, creator});
        this.props.navigation.navigate('FilteredList', {name: name, type: this.state.type});
    }

    render() {
        return (
            <View>
                <ListNameModal 
                    visible={this.state.showAddModal} 
                    setVisible={this.showAddModal} 
                    confirmName={this.createList}
                />
                <ConfirmDialog 
                    visible={this.state.showConfirmModal}
                    setVisible={this.showConfirmModal}
                    title="Delete List"
                    text="Are you sure you want to delete this list?"
                    confirm={this.confirmDelete}
                />
                <FlatList 
                    data={this.state.lists}
                    renderItem={({item}) => <ListListitem listitem={item} user={this.state.username} onPress={this.navigateToList} longPress={() => this.showConfirmModal(item.id)}/>}
                    keyExtractor={item => item.id}
                />
                {this.state.showLoading && <ActivityIndicator
                    animating={this.state.showLoading}
                    size={75}
                    style={{marginTop: '50%'}}
                    color={'#777'}
                />}
            </View>
        )
    }

};

const ListListitem = ({listitem, user, onPress, longPress}) => {
    return (
        <TouchableOpacity 
            onPress={() => onPress(listitem.id, listitem.name, listitem.creator)}
            onLongPress={() => longPress()}
        >
            <View style={itemStyle.container}> 
                <Text style={itemStyle.name}>
                    {listitem.name}
                </Text>
                <Text style={{color: listitem.creator === user ? '#ffcccc' : '#aec6cf'}}>
                    {listitem.creator}
                </Text>
            </View>
        </TouchableOpacity>
    )
};

const itemStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    name: {
        fontWeight: 'bold'
    }
})