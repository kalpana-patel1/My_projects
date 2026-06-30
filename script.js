const expenseName = document.getElementById("expense-name");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");
const addBtn = document.querySelector(".add-btn");

const foodTotal = document.getElementById("food-total");
const travelTotal = document.getElementById("travel-total");
const shoppingTotal = document.getElementById("shopping-total");
const billsTotal = document.getElementById("bills-total");
const entertainmentTotal = document.getElementById("entertainment-total");
const othersTotal = document.getElementById("others-total");
const totalExpense = document.getElementById("total-expense");
const totalTransactions = document.getElementById("total-transactions");
const highestExpense = document.getElementById("highest-expense");
const averageExpense = document.getElementById("average-expense");

const expenseList = document.getElementById("expense-list");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filter");
const sortBy = document.getElementById("sort");

let expenses = [];
addBtn.addEventListener("click", addExpense);
filterCategory.addEventListener("change", filterExpenses);
sortBy.addEventListener("change", sortExpenses);
function filterExpenses() {
  const selectedCategory = filterCategory.value;

  if (selectedCategory === "All Categories") {
    renderExpenses();
    return;
  }

  const filteredExpenses = expenses.filter(
    (item) => item.category === selectedCategory,
  );

  renderExpenses(filteredExpenses);
}

//card
function updateCategoryTotals() {
  let food = 0;
  let travel = 0;
  let shopping = 0;
  let bills = 0;
  let entertainment = 0;
  let others = 0;

  expenses.forEach((item) => {
    switch (item.category) {
      case "Food":
        food += item.amount;
        break;

      case "Travel":
        travel += item.amount;
        break;

      case "Shopping":
        shopping += item.amount;
        break;

      case "Bills":
        bills += item.amount;
        break;

      case "Entertainment":
        entertainment += item.amount;
        break;

      case "Others":
        others += item.amount;
        break;
    }
  });

  foodTotal.textContent = `₹${food.toFixed(2)}`;
  travelTotal.textContent = `₹${travel.toFixed(2)}`;
  shoppingTotal.textContent = `₹${shopping.toFixed(2)}`;
  billsTotal.textContent = `₹${bills.toFixed(2)}`;
  entertainmentTotal.textContent = `₹${entertainment.toFixed(2)}`;
  othersTotal.textContent = `₹${others.toFixed(2)}`;
}

// sort
function sortExpenses() {
  const selectedSort = sortBy.value;

  let sortedExpenses = [...expenses];

  switch (selectedSort) {
    case "oldest":
      sortedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;

    case "newest":
      sortedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;

    case "highest":
      sortedExpenses.sort((a, b) => b.amount - a.amount);
      break;

    case "lowest":
      sortedExpenses.sort((a, b) => a.amount - b.amount);
      break;
  }

  renderExpenses(sortedExpenses);
}
function addExpense(event) {
  event.preventDefault();

  const expense = expenseName.value.trim();
  const expenseAmount = parseFloat(amount.value);
  const expenseDate = date.value;
  const expenseCategory = category.value.trim();

  if (
    expense === "" ||
    isNaN(expenseAmount) ||
    expenseDate === "" ||
    category.value === "Select Category"
  ) {
    alert("Please fill in all fields.");
    return;
  }

  const expenseObject = {
    id: Date.now(),
    name: expense,
    amount: expenseAmount,
    date: expenseDate,
    category: expenseCategory,
  };

  expenses.push(expenseObject);
  saveExpenses();
  renderExpenses();
  updateSummary();
  updateCategoryTotals();
  clearForm();
  console.log(expenseObject);
}

function renderExpenses(expenseArray = expenses) {
  expenseList.innerHTML = expenseArray
    .map(
      (item, index) =>
        `
      <tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${item.amount.toFixed(2)}</td>
      <td>${item.date}</td>
<td><button class="delete-btn" onclick="deleteExpense(${item.id})">
</button></td>
      </tr>
      `,
    )
    .join("");
}
function deleteExpense(id) {
  expenses = expenses.filter((item) => item.id !== id);
  saveExpenses();
  renderExpenses();

  updateSummary();
  updateCategoryTotals();
}

function clearForm() {
  expenseName.value = "";
  amount.value = "";
  date.value = "";
  category.value = "";
}
function updateSummary() {
  //transactions
  const transactions = expenses.length;
  totalTransactions.textContent = transactions;
  //total expense
  const total = expenses.reduce((sum, item) => {
    return sum + item.amount;
  }, 0);
  totalExpense.textContent = `₹${total.toFixed(2)}`;

  // Highest Expense
  const highest =
    expenses.length > 0 ? Math.max(...expenses.map((item) => item.amount)) : 0;

  highestExpense.textContent = `₹${highest.toFixed(2)}`;
}
searchInput.addEventListener("input", searchExpenses);
function searchExpenses() {
  const searchValue = searchInput.value.toLowerCase();
  console.log(searchValue);
  const filteredExpenses = expenses.filter((item) =>
    item.name.toLowerCase().includes(searchValue),
  );
  renderExpenses(filteredExpenses);
}
function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}
function loadExpenses() {
  const storedExpenses = localStorage.getItem("expenses");
  if (storedExpenses) {
    expenses = JSON.parse(storedExpenses);
    renderExpenses();
    updateSummary();
    updateCategoryTotals();
  }
}
loadExpenses();
