function openForm() {
    document.getElementById('myForm').style.display = 'flex';
};

function closeForm() {
    document.getElementById('myForm').style.display = 'none';
    document.getElementById('editFormContainer').style.display = "none";
};


const buatCard = (data) => {
    const createdDate = data.createdAt 
        ? new Date(data.createdAt).toLocaleDateString('id-ID', {day : 'numeric', month : 'short', year : 'numeric', hour : '2-digit', minute : '2-digit'})
        : 'Tanggal tidak Tersedia';
        
    const updatedDate = data.updatedAt
        ? new Date(data.updatedAt).toLocaleDateString('id-ID', {day : 'numeric', month : 'short', year : 'numeric', hour : '2-digit', minute : '2-digit'})
        : '-';
    
    const markupCard = `
        <div class="card" id="note${data.id}">
            <div class="card-title" id="title${data.id}">${data.title}</div>
            
            <div class="card-date-info">
                <strong>ID: #${data.id}</strong><br>
                <small>Dibuat: ${createdDate}</small>
                <small id="updatedAt${data.id}">Diupdate: ${updatedDate}</small>
            </div>
            
            <div class="card-note-section" id="userNote${data.id}">${data.userNote}</div>
            <div class="card-button">
                <button class="btn-card btn-blue" onclick="editNote(${data.id})">Edit</button>
                <button class="btn-card btn-red" onclick="deleteNote(${data.id})">Delete</button>
            </div>
        </div>    
    `;
    document.getElementById('card-container').insertAdjacentHTML('beforeend', markupCard);
};

// Input New Data or Note
const inputData = async (formData) => {
    try {
        const response = await fetch('http://localhost:3000/notes', {
          method: 'POST',
          headers : {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(formData)
        });
    
        const data = await response.json();
        console.log(data);
        return data.data;
    } catch (error) {
        console.log(error);
        return null;
    }

};

const formEl = document.querySelector(".form-container");
formEl.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const formData = new FormData(formEl);
    console.log(formData);
    const data = Object.fromEntries(formData);
    console.log(data);
    const dataBaru = await inputData(data);
    console.log(dataBaru);
    if (dataBaru) {
        buatCard(dataBaru);
    }
    formEl.reset();
    closeForm();
});

// GET ALL Notes
const getData = async () => {
    try {
        const response = await fetch("http://localhost:3000/notes");
        const data = await response.json();
        const noteData = data.data;
        console.log(data);
        console.log(noteData);
        noteData.forEach((notes) => {
            buatCard(notes);
        });
    } catch (error) {
        console.log(error);
    }
};

getData();


// Edit Data or Note
const editData = async (formData, id) => {
    try {
        const response = await fetch(`http://localhost:3000/notes/${id}`, {
          method: 'PUT',
          headers : {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(formData)
        });
    
        const data = await response.json();
        console.log(data);
        return data.data;
    } catch (error) {
        console.log(error);
        return null;
    }

};

const updateCard = (id, updatedData) => {
    document.getElementById(`title${id}`).textContent = `${updatedData.title}`;
    document.getElementById(`userNote${id}`).textContent = updatedData.userNote;

    if (updatedData.updatedAt) {
        const newUpdatedData = new Date(updatedData.updatedAt).toLocaleDateString('id-ID', {day : 'numeric', month : 'short', year : 'numeric', hour : '2-digit', minute : '2-digit'});
        document.getElementById(`updatedAt${id}`).textContent = `Diupdate: ${newUpdatedData}`;
    };
};

const editNote = (id) => {
    document.getElementById('editFormContainer').style.display = "flex";
    
    const title = document.getElementById(`title${id}`).textContent;
    document.getElementById('editedTitleInput').value = title;
    
    const userNote = document.getElementById(`userNote${id}`).textContent;
    document.getElementById('editedNotesInput').value = userNote;

    const editFormEl = document.querySelector('.editForm');
    editFormEl.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(editFormEl);
        console.log(formData);
        
        const data = Object.fromEntries(formData);
        console.log(data);

        const updatedData = await editData(data, id);
        
        console.log(updatedData);
        
        if (updatedData) {
            updateCard(id, updatedData);
        }
        editFormEl.reset();
        closeForm()
    }, {once: true});
}

// Delete Data atau Note
const deleteData = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/notes/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log(data);
        return data.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const deleteNote = async (id) => {
    try {
        const data = await deleteData(id);
        console.log(data);
        if (data) {
            const deletedCard = document.getElementById(`note${id}`);
            deletedCard.remove();
        }
    } catch (error) {
        console.log(error);
    }
};

// Fitur Search Bar
const searchBar = document.getElementById('search_bar');
const noResultMessage = document.getElementById('no-result-message');
searchBar.addEventListener('input', (event) => {
    const keyword = event.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    let adaCatatanYangCocok = false;

    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const noteContent = card.querySelector('.card-note-section').textContent.toLowerCase();

        if (title.includes(keyword) || noteContent.includes(keyword)) {
            card.style.display = "flex";
            adaCatatanYangCocok = true;
        } else {
            card.style.display = "none";
        };
    });

    if (!adaCatatanYangCocok && cards.length > 0) {
        noResultMessage.style.display = 'block';
    } else {
        noResultMessage.style.display = 'none';
    };
});

const searchForm = searchBar.closest('form');
if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
    });
};