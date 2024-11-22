document.addEventListener("DOMContentLoaded", () => {
    const apiURL = "/api/admin";

    const loadUsers = async () => {
        const response = await fetch(apiURL);
        const users = await response.json();
        renderUsersTable(users);
    };

    const renderUsersTable = (users) => {
        const tableBody = document.getElementById("table-body");
        tableBody.innerHTML = "";
        users.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.surname}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(role => role.name).join(", ").replaceAll("ROLE_", "")}</td>
            <td><button class="btn btn-info btn-sm edit-btn" data-id="${user.id}">Edit</button></td>
            <td><button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
    };

    const getUserRoles = (form) => {
        const formData = new FormData(form)
        const user = Object.fromEntries(formData.entries());
        user.roles = Array.from(form.roles.selectedOptions).map(option => ({id: parseInt(option.value)}));
        return user;
    }
    // Добавление
    const addUser = async (event) => {
        event.preventDefault();
        const user = getUserRoles(event.target);

       await fetch(apiURL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user),
        });

        loadUsers()
        event.target.reset();
    };
// Редактирование
    const populateEditModal = (user) => {
        document.getElementById("editId").value = user.id;
        document.getElementById("editName").value = user.name;
        document.getElementById("editSurname").value = user.surname;
        document.getElementById("editAge").value = user.age;
        document.getElementById("editEmail").value = user.email;
        document.getElementById("editPassword").value = "";
        const rolesSelect = document.getElementById("editRoles");
        Array.from(rolesSelect.options).forEach(option => {
            option.selected = user.roles.some(role => role.id === parseInt(option.value));
        });

        const modalElement = document.getElementById('editUserModal');
        const editUserModal = new bootstrap.Modal(modalElement);
        editUserModal.show();

    };

    const editUser = async (id) => {
        const response = await fetch(`${apiURL}/${id}`);
        const user = await response.json();
        populateEditModal(user);
    };

    const saveEditUser = async (event) => {
        event.preventDefault();
        const user = getUserRoles(event.target);

        await fetch(`${apiURL}/${user.id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        });

        loadUsers();
        closeModal('editUserModal');
    };
// Удаление
    const populateDeleteModal = (user) => {
        document.getElementById("deleteId").value = user.id;
        document.getElementById("deleteName").value = user.name;
        document.getElementById("deleteSurname").value = user.surname;
        document.getElementById("deleteAge").value = user.age;
        document.getElementById("deleteEmail").value = user.email;
        const modalElement = document.getElementById('deleteUserModal');
        const deleteUserModal = new bootstrap.Modal(modalElement);
        deleteUserModal.show();
    };

    const deleteUser = async (id) => {
        const response = await fetch(`${apiURL}/${id}`)
        const user = await response.json();
        populateDeleteModal(user);
    };

    const confirmDeleteUser = async (event) => {
        event.preventDefault();
        const userID = document.getElementById("deleteId").value;
        await fetch(`${apiURL}/${userID}`, {
            method: "DELETE"
        });

        loadUsers();
        closeModal('deleteUserModal')
    }
    // Закрытие модалки
    const closeModal = (modalId) => {
        const modalElement = document.getElementById(modalId);
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
    };

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-btn")) {
            const id = event.target.getAttribute("data-id");
            editUser(id);
        }
        if (event.target.classList.contains("delete-btn")) {
            const id = event.target.getAttribute("data-id");
            deleteUser(id);
        }
    });

    document.getElementById("new-user-form").addEventListener("submit", addUser);
    document.getElementById("edit-user-form").addEventListener("submit", saveEditUser);
    document.getElementById("delete-user-form").addEventListener("submit", confirmDeleteUser);

    loadUsers();
});