let retryCount = 0;
const maxRetries = 5;

document.getElementById('accessForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    if (retryCount >= maxRetries) {
        document.getElementById('result').innerHTML = 'Access blocked. Too many incorrect attempts.';
        return;
    }

    const password = document.getElementById('password').value;
    const urlParams = new URLSearchParams(window.location.search);
    const linkId = urlParams.get('id');

    const response = await fetch(`/access-link/${linkId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('result').innerHTML = `
            <p><strong>Link:</strong> <a href="${result.url}" target="_blank">${result.url}</a></p>
            <p><strong>Description:</strong> ${result.description}</p>
        `;
    } else {
        retryCount++;
        document.getElementById('result').innerHTML = `Incorrect password. Attempts left: ${maxRetries - retryCount}`;
    }
});

// Show/Hide password functionality with an image
const passwordInput = document.getElementById('password');
const togglePasswordImage = document.getElementById('togglePassword');

togglePasswordImage.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Use the same image for both states
    togglePasswordImage.src = '/images/2.png'; // Same image for toggling
});
