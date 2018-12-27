const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector('#add-cafe-form');

//create element and renderretrorant
function renderRestorant(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'X';

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);
    
    //deleting the content
     
    cross.addEventListener('click', (e) => {
        //e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        //doc is used to chose only the specific element
        db.collection('restorant').doc(id).delete();
    })
}

//get the data
//this is a synchronous call so we use then method inside it
//we can also query the data using
// where('name','conditions', 'value' ) 
//use where b/w collection and get() functions
// db.collection('restorant').orderBy('name').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         //.data() is used to show the data at console 
//         renderRestorant(doc);
//     })
// });

//save the data

form.addEventListener('submit', (e) => {
    e.preventDefault();

    db.collection('restorant').add({
        name: form.name.value,
        city: form.city.value
    });

    form.name.value = '';
    form.city.value = '';
});
//real time data

db.collection('restorant').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added') {
            renderRestorant(change.doc);
        }
        else if(change.type == 'removed') {
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    })
})