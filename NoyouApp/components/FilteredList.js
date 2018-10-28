import React, { Component } from 'react'
import { AppState, View, Text, FlatList, TouchableOpacity, StyleSheet, Picker, ActivityIndicator } from "react-native";
import { CheckBox } from "react-native-elements";

import store from "../flux/store";
import actions from "../flux/actions";

import ConfirmDialog from './modals/ConfirmDialog'
import AddItemModal from './modals/AddItemModal'

const shopSortOptions = ['Unchecked', 'Checked'];
const todoSortOptions = ['Date ascending, unchecked', 'Date ascending, checked', 'Date descending, unchecked', 'Date descending, checked']

const compareShoppingItemsUnchecked = (a,b) => {
    return (a.checked === b.checked)? 0 : a.checked? 1 : -1;
}

const compareShoppingItemsChecked = (a,b) => {
    return (a.checked === b.checked)? 0 : a.checked? -1 : 1;
}

const compareTodoAscUn = (a,b) => {
    if (a.checked && !b.checked ) {
        return 1;
    } else if (!a.checked && b.checked) {
        return -1;
    } else if (a.checked === b.checked) {
        if (a.due > b.due) {
            return 1;
        } else {
            return -1;
        }
    }
}

const compareTodoAscCh = (a,b) => {
    if (a.checked && !b.checked ) {
        return -1;
    } else if (!a.checked && b.checked) {
        return 1;
    } else if (a.checked === b.checked) {
        if (a.due > b.due) {
            return 1;
        } else {
            return -1;
        }
    }
}

const compareTodoDescUn = (a,b) => {
    if (a.checked && !b.checked ) {
        return 1;
    } else if (!a.checked && b.checked) {
        return -1;
    } else if (a.checked === b.checked) {
        if (a.due > b.due) {
            return -1;
        } else {
            return 1;
        }
    }
}

const compareTodoDescCh = (a,b) => {
    if (a.checked && !b.checked ) {
        return -1;
    } else if (!a.checked && b.checked) {
        return 1;
    } else if (a.checked === b.checked) {
        if (a.due > b.due) {
            return -1;
        } else {
            return 1;
        }
    }
}

export default class FilteredList extends Component {

    static navigationOptions = ({ navigation }) => {
        const title = navigation.getParam('name', 'List');
        const type = navigation.getParam('type');
        return {
            title: title,
            headerStyle: {
                backgroundColor: type === 'Shopping' ? '#bae1ff' : '#FFCDD1'
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
            sortBy: store.getState().type === 'Shopping' ? shopSortOptions[0] : todoSortOptions[0],
            itemsToDisplay: [],
            showAdd: false,
            showConfirm: false,
            idToDelete: '',
            showLoading: false
        };
    }

    componentDidMount() {
        store.listen(this.onChange);
        AppState.addEventListener('change', this._handleAppStateChange);
        this.showLoading(true);
        this.props.navigation.setParams({showAddModal: this.showAdd});

        this.socket.on('send items', items => {
            this.showLoading(false)
            if (typeof items === 'object' && items.hasOwnProperty('error')) {
                alert(items.error);
            } else {
                actions.setItems(items)
            }    
        })

        this.socket.on('send users', users => {
            if (typeof users === 'object' && users.hasOwnProperty('error')) {
                alert(users.error);
            } else {
                actions.setUsers(users)
            }
        })

        this.socket.on('update item', item => {
            if (item.hasOwnProperty('error')) {
                alert(item.error);
            } else {
                actions.updateItem(item);
            }
        })

        this.socket.on('add item', item => {
            if (item.hasOwnProperty('error')) {
                alert(item.error);
            } else {
                actions.addItem(item)
            }
        })

        this.socket.on('remove item', id => {
            if (typeof id === 'object' && id.hasOwnProperty('error')) {
                alert(id.error);
            } else {
                actions.deleteItem(id);
            }
        })

        this.socket.emit('get items', {listId: this.state.currentList.id});
        this.socket.emit('get users');

    }

    componentWillUnmount() {
        store.unlisten(this.onChange);
        AppState.removeEventListener('change', this._handleAppStateChange);
        this.socket.removeAllListeners('send items');
        this.socket.removeAllListeners('send users');
        this.socket.removeAllListeners('update item');
        this.socket.removeAllListeners('add item');
        this.socket.removeAllListeners('remove item');
    }

    onChange = state => {
        this.setState({...state, itemsToDisplay: this.sortItems(state.items, this.state.sortBy)})
    }

    _handleAppStateChange = nextState => {
        console.log('in handler');
        // Refresh data from server after returning to the app
        if(this.state.appState.match(/inactive|background/) && nextState === 'active') {
            this.showLoading(true);
            this.socket.emit('get items', {listId: this.state.currentList.id});
            this.socket.emit('get users');
        }
        this.setState({appState: nextState});
    }

    sortItems = (items, option) => {
        switch (option) {
            case shopSortOptions[0]:
                return [...items].sort(compareShoppingItemsUnchecked)
            case shopSortOptions[1]:
                return [...items].sort(compareShoppingItemsChecked)
            case todoSortOptions[0]:
                return [...items].sort(compareTodoAscUn)
            case todoSortOptions[1]:
                return [...items].sort(compareTodoAscCh)
            case todoSortOptions[2]:
                return [...items].sort(compareTodoDescUn)
            case todoSortOptions[3]:
                return [...items].sort(compareTodoDescCh)
            default:
                return [...items];
        }
    }

    setSortBy = option => {
        this.setState({sortBy: option, itemsToDisplay: this.sortItems(this.state.items, option)})
    }

    checkItem = (id, checked) => {
        this.socket.emit('check item', {id: id, checked: checked});
    }

    showConfirm = id => {
        this.setState({showConfirm: !this.state.showConfirm, idToDelete: id})
    }

    showAdd = () => {
        this.setState({showAdd: !this.state.showAdd});
    }

    showLoading = show => {
        this.setState({showLoading: show})
    }

    deleteItem = () => {
        if (this.state.idToDelete && this.state.idToDelete !== '') {
            this.socket.emit('delete item', {id: this.state.idToDelete});
            this.setState({idToDelete: ''});
        } 
    }

    addItem = (name, due, forUser) => {
        //console.log('addItemFunc', name);
        var newItem = null;
        if (this.state.type === 'Shopping') {
            newItem = {name: name, listId: this.state.currentList.id}
        } else {
            newItem = {name: name, due: due, for: forUser, listId: this.state.currentList.id}
        }
        this.socket.emit('create item', newItem);
    }

    render() {
        return (
            <View style={compStyles.container}>
            <ConfirmDialog 
                visible={this.state.showConfirm}
                title={'Delete item'} 
                text={'Are you sure you want to delete this item?'}
                setVisible={this.showConfirm}
                confirm={this.deleteItem}
            />
            <AddItemModal
                visible={this.state.showAdd}
                setVisible={this.showAdd}
                add={this.addItem}
                type={this.state.type}
                users={this.state.users}
            />
                <HeaderBar 
                    type={this.state.type}
                    sortOption={this.state.sortBy}
                    valueChanged={this.setSortBy}
                />
                <FlatList 
                    data={this.state.itemsToDisplay}
                    renderItem={({item}) => <Item item={item} onCheck={this.checkItem} username={this.state.username} showDialog={this.showConfirm}/>}
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

}

const HeaderBar = ({type, sortOption, valueChanged}) => {
    let shoppingOptions = type === 'Shopping' ? shopSortOptions : todoSortOptions
    return (
        <View style={headerStyles.bar}>
            <Text>Sort by:</Text>
            <Picker
                style={headerStyles.picker}
                selectedValue={sortOption}
                onValueChange={valueChanged}
            >
                {shoppingOptions.map((option, index) => <Picker.Item key={index} label={option} value={option}/>)}
            </Picker>
        </View>
    )
}

const Item = ({item, onCheck, username, showDialog}) => {
    let date = item.due ? new Date(item.due) : false
    return (
        <TouchableOpacity
            onPress={() => onCheck(item.id, !item.checked)}
            onLongPress={() => showDialog(item.id)}
        >
        <View style={itemStyle.container}>
            <View style={itemStyle.item}>
                <CheckBox 
                    center
                    containerStyle={itemStyle.box}
                    checked={item.checked}
                    onPress={() => onCheck(item.id, !item.checked)}
                />
                <Text style={[itemStyle.text, {textDecorationLine: item.checked ? 'line-through' : 'none'}]}>
                    {item.name}
                </Text>
            </View>
            <View style={itemStyle.dateNameContainer}>
                {date && <Text>Due date: {`${date.getDate()}.${`0${date.getMonth() + 1}`.substr(-2)}.${date.getFullYear()}, ${`0${date.getHours()}`.substr(-2)}:${`0${date.getMinutes()}`.substr(-2)}`}</Text>}
                {item.hasOwnProperty('for') && item.for !== '' && <Text style={{color: item.for === username ? '#ffcccc' : '#aec6cf'}}>{item.for}</Text>}
            </View>
        </View>
        </TouchableOpacity>
    )
}

const compStyles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start'
    }
})

const headerStyles = StyleSheet.create({
    bar: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        elevation: 4
    },
    picker: {
        height: 30,
        width: 250
    }
})


const itemStyle = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    box: {
        backgroundColor: '#fff',
        borderWidth: 0,
        padding: 0
    },
    text: {
        fontWeight: 'bold'
    },
    dateNameContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    }
})