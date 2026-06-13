// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration from the user
const firebaseConfig = {
  apiKey: "AIzaSyDCAfn8ZR8dwEyLPWxopMOOl-Z_qTwo0IU",
  authDomain: "todorist2026.firebaseapp.com",
  projectId: "todorist2026",
  storageBucket: "todorist2026.firebasestorage.app",
  messagingSenderId: "664516838836",
  appId: "1:664516838836:web:e41aa39843d38d67a11ee1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const addBtn = document.getElementById('add-btn');

// Collection Reference
const todosColRef = collection(db, 'todos');
// Query: order by createdAt descending
const q = query(todosColRef, orderBy('createdAt', 'desc'));

// Load Realtime Data
onSnapshot(q, (snapshot) => {
    let todosHtml = '';
    
    if (snapshot.empty) {
        todoList.innerHTML = '<li class="loading-state">등록된 할 일이 없습니다. 첫 번째 할 일을 추가해보세요! ✨</li>';
        return;
    }

    snapshot.docs.forEach((doc) => {
        const todo = doc.data();
        const id = doc.id;
        const isCompleted = todo.completed ? 'completed' : '';
        const isChecked = todo.completed ? 'checked' : '';

        todosHtml += `
            <li class="todo-item ${isCompleted}" data-id="${id}">
                <div class="todo-content">
                    <label class="checkbox-container">
                        <input type="checkbox" class="toggle-cb" ${isChecked}>
                        <span class="checkmark"></span>
                    </label>
                    <span class="todo-text">${escapeHtml(todo.text)}</span>
                </div>
                <button class="btn-icon delete" aria-label="Delete">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </li>
        `;
    });

    todoList.innerHTML = todosHtml;
    
    // Add event listeners to dynamic elements
    attachDynamicListeners();
}, (error) => {
    console.error("Firestore error: ", error);
    todoList.innerHTML = '<li class="loading-state" style="color: #ff5f56;">데이터를 불러오는 중 오류가 발생했습니다. (Firestore 권한 등 확인 필요)</li>';
});

// Add Todo
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    if (text === '') return;

    // UI feedback
    const originalText = addBtn.innerHTML;
    addBtn.innerHTML = '...';
    addBtn.disabled = true;

    try {
        await addDoc(todosColRef, {
            text: text,
            completed: false,
            createdAt: serverTimestamp()
        });
        todoInput.value = '';
    } catch (err) {
        console.error("Error adding document: ", err);
        alert("할 일을 추가하지 못했습니다.");
    } finally {
        addBtn.innerHTML = originalText;
        addBtn.disabled = false;
        todoInput.focus();
    }
});

// Dynamic Event Listeners for Toggle & Delete
function attachDynamicListeners() {
    // Toggle Status
    const toggleCheckboxes = document.querySelectorAll('.toggle-cb');
    toggleCheckboxes.forEach(cb => {
        cb.addEventListener('change', async (e) => {
            const li = e.target.closest('.todo-item');
            const id = li.getAttribute('data-id');
            const isCompleted = e.target.checked;
            
            const docRef = doc(db, 'todos', id);
            try {
                await updateDoc(docRef, {
                    completed: isCompleted
                });
            } catch (err) {
                console.error("Error updating document: ", err);
                e.target.checked = !isCompleted; // revert UI on failure
            }
        });
    });

    // Delete Todo
    const deleteBtns = document.querySelectorAll('.delete');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const li = e.target.closest('.todo-item');
            const id = li.getAttribute('data-id');
            
            // UI Animation before deletion
            li.style.transform = 'translateX(30px)';
            li.style.opacity = '0';
            
            const docRef = doc(db, 'todos', id);
            try {
                setTimeout(async () => {
                    await deleteDoc(docRef);
                }, 300); // match transition time
            } catch (err) {
                console.error("Error deleting document: ", err);
                li.style.transform = '';
                li.style.opacity = '1';
            }
        });
    });
}

// Basic HTML Sanitizer to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
