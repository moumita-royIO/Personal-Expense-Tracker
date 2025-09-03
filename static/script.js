// A simple array to store our transactions
let transactions = [];

// Get references to the DOM elements
const summaryCards = document.getElementById('summary-cards');
const transactionForm = document.getElementById('transaction-form');
const transactionsList = document.getElementById('transactions-list');

// --- Functions to handle the application logic ---

// Function to update the summary cards (Income, Expense, Balance)
function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Use a simple template string to create the HTML for the cards
    summaryCards.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-sm font-medium text-gray-500">Total Income</h3>
            <p class="mt-1 text-2xl font-semibold text-green-600">₹${totalIncome.toFixed(2)}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p class="mt-1 text-2xl font-semibold text-red-600">₹${totalExpenses.toFixed(2)}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-sm font-medium text-gray-500">Current Balance</h3>
            <p class="mt-1 text-2xl font-semibold text-gray-900">₹${balance.toFixed(2)}</p>
        </div>
    `;
}

// Function to render the list of transactions
function renderTransactions() {
    // Clear the current list
    transactionsList.innerHTML = '';

    // Loop through the transactions array and create a list item for each
    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.classList.add('py-4', 'flex', 'items-center', 'justify-between');

        // Determine the text color based on the transaction type
        const amountClass = transaction.type === 'income' ? 'text-green-600' : 'text-red-600';

        li.innerHTML = `
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">${transaction.description}</p>
                <p class="text-sm text-gray-500">Month: ${transaction.month}</p>
                <p class="text-sm text-gray-500">${new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <div class="ml-4 flex-shrink-0">
                <span class="${amountClass} text-sm font-semibold">₹${transaction.amount.toFixed(2)}</span>
            </div>
        `;

        transactionsList.appendChild(li);
    });
}

// --- Event Listeners and Initial App Logic ---

// Listen for form submissions
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

    // Get values from the form inputs
    const month = document.getElementById('month').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    // Create a new transaction object
    const newTransaction = {
        month: month,
        description: description,
        amount: amount,
        type: type,
        date: new Date().toISOString(), // Use ISO format for consistent dates
    };

    // Add the new transaction to the array
    transactions.push(newTransaction);

    // Update the UI
    updateSummary();
    renderTransactions();

    // Clear the form fields for the next entry
    transactionForm.reset();
});

// Initial call to set up the dashboard when the page loads
updateSummary();
renderTransactions();

// Function to delete a transaction
function deleteTransaction(transactionId) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }

    fetch(`/delete/${transactionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the transaction from the DOM
            const transactionElement = document.querySelector(`[data-transaction-id="${transactionId}"]`);
            if (transactionElement) {
                transactionElement.remove();
            }
            
            // Show success message
            showNotification('Transaction deleted successfully!', 'success');
        } else {
            showNotification('Error deleting transaction: ' + data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error deleting transaction', 'error');
    });
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}