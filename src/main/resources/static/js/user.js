document.addEventListener("DOMContentLoaded", () => {
    const apiURL = "/api/user";
    const loadUsers = async () => {
        const response = await fetch(apiURL);
        const user = await response.json();
        renderUserTable(user);
    };
    const renderUserTable = (user) => {
        const tableBody = document.getElementById("user-body");
        tableBody.innerHTML = "";
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.surname}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(role => role.name).join(", ").replaceAll("ROLE_", "")}</td>
            `;
        tableBody.appendChild(row);
    };
    loadUsers();
});