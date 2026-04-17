const checkbox = document.getElementById("complete");
const title = document.getElementById("title");
const desc = document.getElementById("description");
const status = document.getElementById("status");
const priority = document.getElementById("priority");
const timeEl = document.getElementById("time-remaining");
const dueDateEl = document.getElementById("due-date");
const card = document.querySelector(".todo-card");

// EDIT ELEMENTS
const editBtn = document.getElementById("edit-btn");
const form = document.getElementById("edit-form");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

const editTitle = document.getElementById("edit-title");
const editDesc = document.getElementById("edit-desc");
const editPriority = document.getElementById("edit-priority");
const editDate = document.getElementById("edit-date");

// INITIAL DATA
let dueDate = new Date("2026-03-01T18:00");

// FORMAT DATE
function formatDate(date) {
  return date.toLocaleString();
}

dueDateEl.textContent = "Due " + formatDate(dueDate);

// ========================
// TIME LOGIC (FIXED)
// ========================
function updateTime() {
  const now = new Date();
  const diff = dueDate - now;

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  // ✅ DONE STATE (locks everything cleanly)
  if (status.value === "Done" || checkbox.checked) {
    timeEl.textContent = "Completed";
    card.classList.remove("overdue");
    card.classList.add("completed");
    return;
  } else {
    card.classList.remove("completed");
  }

  // 🚨 OVERDUE STATE
  if (diff < 0) {
    const overdueMinutes = Math.abs(totalMinutes);
    const overdueHours = Math.floor(overdueMinutes / 60);
    const overdueDays = Math.floor(overdueHours / 24);
    const oh = overdueHours % 24;
    const om = overdueMinutes % 60;

    card.classList.add("overdue");
    timeEl.textContent = `Overdue by ${overdueDays}d ${oh}h ${om}m`;
    return;
  } else {
    card.classList.remove("overdue");
  }

  // ⏱ NORMAL STATES
  if (days > 0) {
    timeEl.textContent = `Due in ${days}d ${hours}h ${minutes}m`;
  } else if (totalHours > 0) {
    timeEl.textContent = `Due in ${hours}h ${minutes}m`;
  } else {
    timeEl.textContent = `Due in ${minutes}m`;
  }
}

// run timer
setInterval(updateTime, 60000);
updateTime();

// ========================
// CHECKBOX SYNC (FIXED)
// ========================
checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    status.value = "Done";
    card.classList.add("completed");
  } else {
    status.value = "Pending";
    card.classList.remove("completed");
  }

  updateTime();
});

// ========================
// STATUS SYNC (FIXED)
// ========================
status.addEventListener("change", () => {
  if (status.value === "Done") {
    checkbox.checked = true;
    card.classList.add("completed");
  } else {
    checkbox.checked = false;
    card.classList.remove("completed");
  }

  if (status.value === "In Progress") {
    card.classList.add("in-progress");
  } else {
    card.classList.remove("in-progress");
  }

  updateTime();
});

// ========================
// EXPAND / COLLAPSE
// ========================
desc.addEventListener("click", toggleDesc);
desc.addEventListener("keypress", (e) => {
  if (e.key === "Enter") toggleDesc();
});

function toggleDesc() {
  const expanded = desc.classList.toggle("collapsed");
  desc.setAttribute("aria-expanded", !expanded);
}

// ========================
// EDIT MODE
// ========================
editBtn.addEventListener("click", () => {
  form.classList.remove("hidden");

  editTitle.value = title.textContent;
  editDesc.value = desc.textContent;
  editPriority.value = priority.textContent;
  editDate.value = dueDate.toISOString().slice(0, 16);
});

// ========================
// SAVE CHANGES
// ========================
saveBtn.addEventListener("click", () => {
  title.textContent = editTitle.value;
  desc.textContent = editDesc.value;

  priority.textContent = editPriority.value;
  priority.className = "priority " + editPriority.value.toLowerCase();

  dueDate = new Date(editDate.value);
  dueDateEl.textContent = "Due " + formatDate(dueDate);

  form.classList.add("hidden");
  updateTime();
});

// ========================
// CANCEL EDIT
// ========================
cancelBtn.addEventListener("click", () => {
  form.classList.add("hidden");
});