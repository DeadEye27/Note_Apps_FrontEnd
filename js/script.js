function openForm() {
    document.getElementById('myForm').style.display = 'flex';
}

function closeForm() {
    document.getElementById('myForm').style.display = 'none';
}

// GET ALL Notes
fetch("http://localhost:3000/notes")
    .then(res => {
        return res.json();
        console.log(res);
        
    })
    .then(data => {
        console.log(data);
        const Data = data.data;
        console.log(Data);
        Data.forEach((notes, index) => {
            const markupCard = `<div class="card" id="note${index+1}"></div>`;
            document.getElementById('card-container').insertAdjacentHTML('beforeend', markupCard);

            const markupTitle = `<div class="card-title">${notes.title}</div>`;
            document.getElementById(`note${index+1}`).insertAdjacentHTML('beforeend', markupTitle);

            const markupContent = `<div class="card-note-section">${notes.userNote}</div>`;
            document.getElementById(`note${index+1}`).insertAdjacentHTML('beforeend', markupContent);

            const markupButton = `<div class="card-button">pin, edit, delete</div>`;
            document.getElementById(`note${index+1}`).insertAdjacentHTML('beforeend', markupButton);
        });
    })