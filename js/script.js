function openForm() {
    document.getElementById('myForm').style.display = 'flex';
};

function closeForm() {
    document.getElementById('myForm').style.display = 'none';
};

const buatCard = (data) => {
    const markupCard = `
        <div class="card" id="note${data.id}">
            <div class="card-title">${data.title}</div>
            <div class="card-note-section">${data.userNote}</div>
            <div class="card-button">
                <button onclick="editNote(${data.id})">Edit</button>
                <button onclick="deleteNote(${data.id})">Delete</button>
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

}
const formEl = document.querySelector(".form-container");
formEl.addEventListener("submit", async (event)=>{
    event.preventDefault();
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);

    const dataBaru = await inputData(data);
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

