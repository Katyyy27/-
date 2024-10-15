document.getElementById('linkForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const url = document.getElementById('url').value;
    const description = document.getElementById('description').value;
    const password = document.getElementById('password').value;

   // Validate password strength
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   if (!passwordRegex.test(password)) {
       document.getElementById('result').innerHTML = 'Password must be at least 8 characters, include an uppercase letter, a lowercase letter, and a number.';
       return;
   } 
    

    // Send the data to the server
    const response = await fetch('/create-link', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url,
            description,
            password
        })
    });

    const result = await response.json();

    if (response.ok) {
        const linkUrl = `${window.location.origin}/access.html?id=${result.linkId}`;
        document.getElementById('result').innerHTML = `
            <p><strong>Your secure link:</strong> <a href="${linkUrl}" target="_blank">${linkUrl}</a> <img id="copyLink" src="/images/1.png" alt="Copy Link" title="Copy Link" style="cursor: pointer; width: 20px; height: 20px;"></p>
        `;

        // Add event listener to the copy link image
        document.getElementById('copyLink').addEventListener('click', function() {
            navigator.clipboard.writeText(linkUrl).then(() => {
                alert('Link copied to clipboard!');
            });
        });
    } else {
        document.getElementById('result').innerHTML = `Error: ${result.message}`;
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
