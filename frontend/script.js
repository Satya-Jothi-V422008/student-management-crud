// Spring Boot REST API URL
const API_URL = "http://localhost:8080/api/students";

// Used when editing a student
let editingId = null;


// Get HTML elements
const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const search = document.getElementById("search");
const message = document.getElementById("message");


// ===============================
// CREATE / UPDATE STUDENT
// ===============================

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Get values from form
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value;
    const year = document.getElementById("year").value;
    const phone = document.getElementById("phone").value.trim();


    // Phone validation
    if (phone.length !== 10 || isNaN(phone)) {

        showMessage(
            "Phone number must contain exactly 10 digits.",
            true
        );

        return;
    }


    // Student object
    const student = {
        name: name,
        email: email,
        department: department,
        year: year,
        phone: phone
    };


    try {

        // ===============================
        // CREATE
        // ===============================

        if (editingId === null) {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(student)

            });


            if (!response.ok) {
                throw new Error("Failed to add student");
            }


            showMessage("Student added successfully!");

        }


        // ===============================
        // UPDATE
        // ===============================

        else {

            const response = await fetch(
                `${API_URL}/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(student)
                }
            );


            if (!response.ok) {
                throw new Error("Failed to update student");
            }


            showMessage("Student updated successfully!");

        }


        resetForm();

        loadStudents();

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Unable to connect to the server.",
            true
        );

    }

});


// ===============================
// READ / LOAD STUDENTS
// ===============================

async function loadStudents() {

    try {

        const response = await fetch(API_URL);


        if (!response.ok) {
            throw new Error("Failed to load students");
        }


        const students = await response.json();


        displayStudents(students);

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Unable to load students.",
            true
        );

    }

}


// ===============================
// DISPLAY STUDENTS
// ===============================

function displayStudents(students) {

    // Clear existing table rows
    table.innerHTML = "";


    // Get search text
    const searchText = search.value.toLowerCase();


    // Filter students
    const filteredStudents = students.filter(student =>

        student.name.toLowerCase().includes(searchText) ||

        student.email.toLowerCase().includes(searchText) ||

        student.department.toLowerCase().includes(searchText)

    );


    // If there are no records
    if (filteredStudents.length === 0) {

        document.getElementById("emptyMessage").style.display =
            "block";

        return;

    }


    document.getElementById("emptyMessage").style.display =
        "none";


    // Display each student
    filteredStudents.forEach(student => {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>${student.email}</td>

            <td>${student.department}</td>

            <td>${student.year}</td>

            <td>${student.phone}</td>

            <td>

                <button
                    class="action-btn edit-btn"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// ===============================
// UPDATE / EDIT STUDENT
// ===============================

async function editStudent(id) {

    try {

        const response = await fetch(
            `${API_URL}/${id}`
        );


        if (!response.ok) {
            throw new Error("Student not found");
        }


        const student = await response.json();


        // Store the ID being edited
        editingId = id;


        // Put existing values into form
        document.getElementById("name").value =
            student.name;

        document.getElementById("email").value =
            student.email;

        document.getElementById("department").value =
            student.department;

        document.getElementById("year").value =
            student.year;

        document.getElementById("phone").value =
            student.phone;


        // Change form title
        document.getElementById("formTitle").textContent =
            "Edit Student";


        // Change button text
        document.getElementById("submitBtn").textContent =
            "Update Student";


        // Show cancel button
        document.getElementById("cancelBtn").style.display =
            "inline-block";


        // Scroll to form
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Unable to load student.",
            true
        );

    }

}


// ===============================
// DELETE STUDENT
// ===============================

async function deleteStudent(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error("Failed to delete student");
        }


        showMessage("Student deleted successfully!");


        // Refresh table
        loadStudents();

    }

    catch (error) {

        console.error(error);

        showMessage(
            "Unable to delete student.",
            true
        );

    }

}


// ===============================
// RESET FORM
// ===============================

function resetForm() {

    form.reset();


    // Exit edit mode
    editingId = null;


    // Restore original form title
    document.getElementById("formTitle").textContent =
        "Add Student";


    // Restore button text
    document.getElementById("submitBtn").textContent =
        "Add Student";


    // Hide cancel button
    document.getElementById("cancelBtn").style.display =
        "none";

}


// ===============================
// SHOW MESSAGE
// ===============================

function showMessage(text, error = false) {

    message.textContent = text;

    message.style.color =
        error ? "red" : "green";


    setTimeout(() => {

        message.textContent = "";

    }, 3000);

}


// ===============================
// SEARCH STUDENTS
// ===============================

search.addEventListener(
    "input",
    loadStudents
);


// ===============================
// LOAD DATA WHEN PAGE OPENS
// ===============================

loadStudents();