
const titleInput = document.getElementById('taskTitle');
const descInput = document.getElementById('taskDescription');
const addBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

addBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    if (!title || !desc) {
        alert('Please enter both title and description.');
        return;
    }
    createTaskElement(title, desc);
    titleInput.value = '';
    descInput.value = '';
    titleInput.focus();
});

function createTaskElement(title, desc) {

    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';

    const header = document.createElement('div');
    header.className = 'task-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'task-title';
    titleEl.textContent = title;

    header.appendChild(titleEl);

    taskDiv.appendChild(header);

    const descEl = document.createElement('p');
    descEl.className = 'task-desc';
    descEl.textContent = desc;
    taskDiv.appendChild(descEl);

    const controls = document.createElement('div');
    controls.className = 'controls';

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Mark as Completed';
    completeBtn.addEventListener('click', () => {
        const completed = titleEl.classList.toggle('completed');
        descEl.classList.toggle('completed', completed);
        completeBtn.textContent = completed ? 'Mark as Incomplete' : 'Mark as Completed';
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
        if (editBtn.dataset.editing === 'true') {

            const newTitle = taskDiv.querySelector('input[data-role="edit-title"]').value.trim();
            const newDesc = taskDiv.querySelector('textarea[data-role="edit-desc"]').value.trim();
            if (!newTitle || !newDesc) {
                alert('Title and description cannot be empty.');
                return;
            }
            titleEl.textContent = newTitle;
            descEl.textContent = newDesc;
            const titleInputEl = taskDiv.querySelector('input[data-role="edit-title"]');
            const descInputEl = taskDiv.querySelector('textarea[data-role="edit-desc"]');
            if (titleInputEl) titleInputEl.remove();
            if (descInputEl) descInputEl.remove();
            titleEl.style.display = '';
            descEl.style.display = '';
            editBtn.textContent = 'Edit';
            editBtn.dataset.editing = 'false';
        } else {
            titleEl.style.display = 'none';
            descEl.style.display = 'none';

            const editTitle = document.createElement('input');
            editTitle.className = 'inline-input';
            editTitle.setAttribute('data-role', 'edit-title');
            editTitle.value = titleEl.textContent;

            const editDesc = document.createElement('textarea');
            editDesc.className = 'inline-input';
            editDesc.setAttribute('data-role', 'edit-desc');
            editDesc.rows = 3;
            editDesc.value = descEl.textContent;

            taskDiv.insertBefore(editTitle, descEl);
            taskDiv.insertBefore(editDesc, descEl);

            editBtn.textContent = 'Save';
            editBtn.dataset.editing = 'true';
            editTitle.focus();
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        if (confirm('Delete this task?')) taskDiv.remove();
    });

    controls.appendChild(completeBtn);
    controls.appendChild(editBtn);
    controls.appendChild(deleteBtn);

    taskDiv.appendChild(controls);
    taskList.appendChild(taskDiv);
}

titleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addBtn.click();
    }
});