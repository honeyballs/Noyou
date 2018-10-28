import alt from "../alt";
import actions from "./actions";

class AppStore {
   
    constructor() {

        // These variables are our store
        this.username = '';
        this.users = [];
        this.type = '';
        this.lists = [];
        this.currentList = {}
        this.items = []

        // Bind the action handlers to the actions
        this.bindListeners({
            handleSetUsername: actions.SET_USERNAME,
            handleSetUsers: actions.SET_USERS,
            handleSetType: actions.SET_TYPE,
            handleSetLists: actions.SET_LISTS,
            handleAddToLists: actions.ADD_TO_LISTS,
            handleDeleteList: actions.DELETE_LIST,
            handleSetCurrentList: actions.SET_CURRENT_LIST,
            handleSetItems: actions.SET_ITEMS,
            handleUpdateItem: actions.UPDATE_ITEM,
            handleAddItem: actions.ADD_ITEM,
            handleDeleteItem: actions.DELETE_ITEM
        })
    }

    handleSetUsername(username) {
        this.username = username
    }
    
    handleSetUsers(users) {
        this.users = users;
    }

    handleSetType(type) {
        this.type = type;
    }

    handleSetLists(lists) {
        this.lists = lists;
    }

    handleAddToLists(list) {
        this.lists = [...this.lists, list];
    }

    handleDeleteList(id) {
        this.lists = this.lists.filter(list => list.id !== id);
    }

    handleSetCurrentList(list) {
        this.currentList = list
    }

    handleSetItems(items) {
        this.items = items
    }

    handleUpdateItem(change) {
        this.items = this.items.map(oldItem => {
            if (oldItem.id === change.id) {
                return {...oldItem, checked: change.checked}
            } 
            return oldItem
        })
    }

    handleAddItem(item) {
        this.items = [...this.items, item]
    }

    handleDeleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
    }
}

export default alt.createStore(AppStore, 'AppStore');