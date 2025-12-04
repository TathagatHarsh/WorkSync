const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("Testing To-Do List API...");

  // 1. Login to get token
  const loginRes = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "tharsh13052006@gmail.com",
      password: "Tathagat13*",
    }),
  });

  if (!loginRes.ok) {
    console.error("Login failed");
    process.exit(1);
  }

  const { token } = await loginRes.json();
  console.log("[PASS] Logged in successfully.");

  // 2. Create Task
  const taskData = {
    title: "Test Task",
    description: "This is a test task",
    date: new Date().toISOString().split("T")[0],
  };

  const createRes = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!createRes.ok) {
    console.error("Create task failed");
    process.exit(1);
  }

  const createdTask = await createRes.json();
  console.log("[PASS] Task created:", createdTask.id);

  // 3. Get Tasks
  const getRes = await fetch(`${BASE_URL}/api/tasks?date=${taskData.date}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!getRes.ok) {
    console.error("Get tasks failed");
    process.exit(1);
  }

  const tasks = await getRes.json();
  if (tasks.length > 0 && tasks[0].id === createdTask.id) {
    console.log("[PASS] Tasks fetched successfully.");
  } else {
    console.error("[FAIL] Task not found in list.");
    process.exit(1);
  }

  // 4. Update Task
  const updateRes = await fetch(`${BASE_URL}/api/tasks/${createdTask.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: "Updated Task", done: true }),
  });

  if (!updateRes.ok) {
    console.error("Update task failed");
    process.exit(1);
  }

  const updatedTask = await updateRes.json();
  if (updatedTask.title === "Updated Task" && updatedTask.done === true) {
    console.log("[PASS] Task updated successfully.");
  } else {
    console.error("[FAIL] Task update mismatch.");
    process.exit(1);
  }

  // 5. Delete Task
  const deleteRes = await fetch(`${BASE_URL}/api/tasks/${createdTask.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!deleteRes.ok) {
    console.error("Delete task failed");
    process.exit(1);
  }

  console.log("[PASS] Task deleted successfully.");
}

main().catch(console.error);
