import alt from "../alt";


const MyActions = alt.generateActions('setUsername', 'setUsers', 'setType', 'setLists', 'addToLists', 'deleteList', 
                                    'setCurrentList', 'setItems', 'updateItem', 'addItem', 'deleteItem');

export default MyActions;