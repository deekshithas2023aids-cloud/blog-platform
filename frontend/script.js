const API = 'http://localhost:5000/api';


// ================= REGISTER =================

async function register() {

    const username =
        document.getElementById('username').value;

    const email =
        document.getElementById('email').value;

    const password =
        document.getElementById('password').value;

    const res = await fetch(
        `${API}/auth/register`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                username,
                email,
                password
            })
        }
    );

    const data = await res.json();

    alert(data.message);

    window.location = 'login.html';
}



// ================= LOGIN =================

async function login() {

    const email =
        document.getElementById('loginEmail').value;

    const password =
        document.getElementById('loginPassword').value;

    const res = await fetch(
        `${API}/auth/login`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await res.json();

    console.log(data);

    if (data.token) {

        localStorage.setItem(
            'token',
            data.token
        );

        localStorage.setItem(
            'username',
            data.username
        );

        alert('Login Successful');

        window.location = 'dashboard.html';

    } else {

        alert('Invalid Login');
    }
}



// ================= CREATE POST =================

async function createPost() {

    const title =
        document.getElementById('title').value;

    const content =
        document.getElementById('content').value;

    const author =
        localStorage.getItem('username');

    const token =
        localStorage.getItem('token');

    if (!token) {

        alert('Please Login First');

        return;
    }

    const res = await fetch(
        `${API}/posts`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },

            body: JSON.stringify({
                title,
                content,
                author
            })
        }
    );

    const data = await res.json();

    console.log(data);

    alert('Post Created Successfully');

    document.getElementById('title').value = '';

    document.getElementById('content').value = '';

    loadPosts();
}



// ================= LOAD POSTS =================

async function loadPosts() {

    const res = await fetch(
        `${API}/posts`
    );

    const posts = await res.json();

    const container =
        document.getElementById('posts');

    if (!container) return;

    container.innerHTML = '';

    posts.forEach(post => {

        container.innerHTML += `

        <div class="post">

            <h2>${post.title}</h2>

            <p>${post.content}</p>

            <small>
                Author: ${post.author}
            </small>

            <hr>

            <h3>Comments</h3>

            ${post.comments.map(comment => `

                <div class="comment">

                    <b>${comment.username}</b>:
                    ${comment.text}

                </div>

            `).join('')}

            <input
                type="text"
                id="comment-${post._id}"
                placeholder="Add Comment"
            >

            <button
                onclick="addComment('${post._id}')"
            >
                Comment
            </button>

            <button
                onclick="deletePost('${post._id}')"
            >
                Delete
            </button>

        </div>
        `;
    });
}



// ================= ADD COMMENT =================

async function addComment(id) {

    const text =
        document.getElementById(
            `comment-${id}`
        ).value;

    const username =
        localStorage.getItem('username');

    const token =
        localStorage.getItem('token');

    if (!token) {

        alert('Please Login First');

        return;
    }

    await fetch(
        `${API}/posts/${id}/comment`,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },

            body: JSON.stringify({
                username,
                text
            })
        }
    );

    loadPosts();
}



// ================= DELETE POST =================

async function deletePost(id) {

    const token =
        localStorage.getItem('token');

    if (!token) {

        alert('Please Login First');

        return;
    }

    await fetch(
        `${API}/posts/${id}`,
        {
            method: 'DELETE',

            headers: {
                'Authorization': token
            }
        }
    );

    alert('Post Deleted');

    loadPosts();
}



// ================= SHOW TOKEN =================

const tokenDisplay =
    document.getElementById(
        'tokenDisplay'
    );

if (tokenDisplay) {

    const token =
        localStorage.getItem('token');

    tokenDisplay.innerText =
        "Token: " + token;
}



// ================= AUTO LOAD POSTS =================

loadPosts();