const uuid = require('uuid/v1');
const firestore = require('@google-cloud/firestore')

const db = new firestore({
  projectId: '<YOUR PROJECT ID>',
  keyFilename: '<YOUR KEYFILE>',
});

function createUser(name, callback) {
    let newUser = {id: uuid(), name: name}
    let dbRef = db.collection('users').doc(newUser.id);
    dbRef.set(newUser)
        .then(res => {
            callback(newUser)
        })
        .catch(err => {
            console.log('Error creating user', err);
            callback({error: 'Could not create the user.'})
        })
}

function getUsers(callback) {
    db.collection('users').get()
        .then( snapshot => {
            let users = []
            snapshot.forEach( doc => {
                users.push(doc.data())
            })
            callback(users);
        })
        .catch(err => {
            console.log('Error getting users', err)
            callback({error: 'Could not fetch users.'})
        })
}

function getLists(type, callback) {
    let listsCollection = db.collection('lists');
    listsCollection.where('type', '==', type).get()
        .then( snapshot => {
            let lists = []
            snapshot.forEach( doc => {
                lists.push(doc.data())
            })
            callback(lists);
        })
        .catch(err => {
            console.log('Error getting lists', err)
            callback({error: 'Could not fetch lists.'})
        })
}

function createList(params, callback) {
    const newList = {...params, id: uuid()}
    let dbRef = db.collection('lists').doc(newList.id);
    dbRef.set(newList)
        .then(res => {
            callback(newList)
        })
        .catch(err => {
            console.log('Error creating list', err);
            callback({error: 'Could not create the list.'})
        })
}

function deleteList(id, callback) {
    db.collection('lists').doc(id).delete()
        .then(deleted => {
            callback(id);
        })
        .catch(err => {
            console.log('Error deleting list', err);
            callback({error: 'Could not delete the list.'})
        })
}

function getItems(listId, callback) {
    let itemsCollection = db.collection('items');
    itemsCollection.where('listId', '==', listId).get()
        .then( snapshot => {
            let items = []
            snapshot.forEach( doc => {
                items.push(doc.data())
            })
            callback(items);
        })
        .catch(err => {
            console.log('Error getting items', err)
            callback({error: 'Could not fetch items.'})
        })
}

function addItem(params, callback) {
    const newItem = {...params, checked: false, id: uuid()}
    let dbRef = db.collection('items').doc(newItem.id);
    dbRef.set(newItem)
        .then(res => {
            callback(newItem)
        })
        .catch(err => {
            console.log('Error creating item', err);
            callback({error: 'Could not create the item.'})
        })
}

function deleteItem(id, callback) {
    db.collection('items').doc(id).delete()
        .then(deleted => {
            callback(id);
        })
        .catch(err => {
            console.log('Error deleting item', err);
            callback({error: 'Could not delete the item.'})
        })
}

function checkItem(id, checked, callback) {
    db.collection('items').doc(id).update({checked: checked})
        .then(updated => {
            callback({id: id, checked: checked});
        })
        .catch(err => {
            console.log('Error checking item', err);
            callback({error: 'Could not check item.'})
        })
}

module.exports = {
    createUser,
    getUsers,
    getLists,
    createList,
    deleteList,
    getItems,
    addItem,
    deleteItem,
    checkItem
}