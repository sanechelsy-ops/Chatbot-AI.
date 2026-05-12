// Array to store all expenses
let expenses = [];

// Run this when page loads
window.onload = function() {
    // Set today's date in the date input
    document.getElementById("date").valueAsDate = new Date();
    
    // Attach event listener to form
    document.getElementById("expenseForm").addEventListener("submit", addExpense);
    
    // Attach event listener to filter dropdown
    document.getElementById("filter").addEventListener("change", showExpenses);
    
    // Load any saved expenses
    loadExpenses();
};

// Function to add a new expense
function addExpense(event) {
    // Stop form from refreshing the page
    event.preventDefault();
    
    // Get values from form
    let desc = document.getElementById("desc").value;
    let amount = document.getElementById("amount").value;
    let category = document.getElementById("category").value;
    let date = document.getElementById("date").value;
    
    // Check if all fields are filled
    if (desc === "" || amount === "" || category === "" || date === "") {
        alert("Please fill all fields");
        return;
    }
    
    // Create expense object
    let expense = {
        id: Date.now(),
        description: desc,
        amount: parseFloat(amount),
        category: category,
        date: date
    };
    
    // Add to array
    expenses.push(expense);
    
    // Save to local storage
    saveExpenses();
    
    // Clear the form
    document.getElementById("expenseForm").reset();
    document.getElementById("date").valueAsDate = new Date();
    
    // Update the display
    showExpenses();
    updateSummary();
}

// Function to delete an expense
function deleteExpense(id) {
    // Find the expense with matching id and remove it
    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i].id === id) {
            expenses.splice(i, 1);
            break;
        }
    }
    
    // Save and update display
    saveExpenses();
    showExpenses();
    updateSummary();
}

// Function to display expenses in table
function showExpenses() {
    let tbody = document.getElementById("expenseBody");
    let filter = document.getElementById("filter").value;
    let emptyMsg = document.getElementById("emptyMsg");
    let table = document.getElementById("expenseTable");
    
    // Clear the table body
    tbody.innerHTML = "";
    
    // Filter expenses if needed
    let displayList = expenses;
    if (filter !== "All") {
        displayList = [];
        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].category === filter) {
                displayList.push(expenses[i]);
            }
        }
    }
    
    // Check if list is empty
    if (displayList.length === 0) {
        table.classList.add("hidden");
        emptyMsg.classList.remove("hidden");
        return;
    }
    
    // Show table and hide empty message
    table.classList.remove("hidden");
    emptyMsg.classList.add("hidden");
    
    // Add each expense as a table row
    for (let i = 0; i < displayList.length; i++) {
        let exp = displayList[i];
        
        let row = document.createElement("tr");
        
        // Date cell
        let dateCell = document.createElement("td");
        dateCell.textContent = formatDate(exp.date);
        row.appendChild(dateCell);
        
        // Description cell
        let descCell = document.createElement("td");
        descCell.textContent = exp.description;
        row.appendChild(descCell);
        
        // Category cell
        let catCell = document.createElement("td");
        catCell.textContent = exp.category;
        row.appendChild(catCell);
        
        // Amount cell
        let amtCell = document.createElement("td");
        amtCell.textContent = "KES " + exp.amount.toFixed(2);
        row.appendChild(amtCell);
        
        // Delete button cell
        let actionCell = document.createElement("td");
        let delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "delete-btn";
        delBtn.onclick = function() {
            deleteExpense(exp.id);
        };
        actionCell.appendChild(delBtn);
        row.appendChild(actionCell);
        
        // Add row to table
        tbody.appendChild(row);
    }
}

// Function to update summary numbers
function updateSummary() {
    let total = 0;
    
    for (let i = 0; i < expenses.length; i++) {
        total = total + expenses[i].amount;
    }
    
    document.getElementById("totalAmount").textContent = "KES " + total.toFixed(2);
    document.getElementById("itemCount").textContent = expenses.length;
}

// Function to save to local storage
function saveExpenses() {
    localStorage.setItem("myExpenses", JSON.stringify(expenses));
}

// Function to load from local storage
function loadExpenses() {
    let saved = localStorage.getItem("myExpenses");
    if (saved !== null) {
        expenses = JSON.parse(saved);
        showExpenses();
        updateSummary();
    }
}

// Function to format date nicely
function formatDate(dateString) {
    let parts = dateString.split("-");
    let year = parts[0];
    let month = parts[1];
    let day = parts[2];
    return day + "/" + month + "/" + year;
}