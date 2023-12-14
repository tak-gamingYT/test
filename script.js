var users = [];
var lastMessageTime = 0;
var delayBetweenMessages = 3000; // 3 giây

function checkUsername() {
    var userName = localStorage.getItem("username");
    var nameInput = document.getElementById("name");
    var chatContainer = document.getElementById("chatContainer");
    var userList = document.getElementById("userList");

    if (userName) {
        nameInput.classList.remove("hidden");
        document.getElementById("chatForm").classList.remove("hidden");
        chatContainer.classList.remove("hidden");
        userList.classList.remove("hidden");
        addUser(userName);
        displayChatContent();
    } else {
        nameInput.value = "";
        nameInput.classList.remove("hidden");
        chatContainer.classList.remove("hidden");
        userList.classList.add("hidden");
        document.getElementById("chatForm").classList.add("hidden");
    }
}

function generateRandomName() {
    var randomNumber = Math.floor(Math.random() * 10001);
    return "Guest" + randomNumber;
}

function handleChatContainerScroll() {
    var chatContainer = document.getElementById("chatContainer");
    var atBottom = chatContainer.scrollHeight - chatContainer.scrollTop === chatContainer.clientHeight;
    displayChatContent();
    if (atBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function displayChatContent() {
    fetch('chat.txt', { cache: 'no-store' })
        .then(response => response.text())
        .then(data => {
            document.getElementById('chatContainer').innerHTML = data;
            handleChatContainerScroll();
        })
        .catch(error => console.error('err:', error));
}

function sendMessage() {
    var currentTime = new Date().getTime();
    var elapsedTimeSinceLastMessage = currentTime - lastMessageTime;

    if (elapsedTimeSinceLastMessage < delayBetweenMessages) {
        var secondsToWait = Math.ceil((delayBetweenMessages - elapsedTimeSinceLastMessage) / 1000);
        alert("Xin đợi " + secondsToWait + " giây trước khi gửi tin nhắn tiếp theo.");
        return;
    }

    var messageInput = document.getElementById("messageInput");
    var message = messageInput.value.trim();
    var nameInput = document.getElementById("name");
    var name = nameInput ? nameInput.value : "";

    if (name === "") {
        var storedName = localStorage.getItem("username");
        if (storedName) {
            name = storedName;
        } else {
            name = generateRandomName();
            localStorage.setItem("username", name);
        }
    } else {
        localStorage.setItem("username", name);
    }

    if (users.includes(name)) {
        alert("Tên đã được sử dụng trong nhóm chat. Vui lòng chọn tên khác.");
        return;
    }

    if (message !== "") {
        var formattedMessage = `<span class='timestamp'>${getCurrentTime()}</span> <b>${name}</b>: ${message}<br>`;

        fetch('save.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'message=' + encodeURIComponent(formattedMessage),
        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('err:', error));

        displaySentMessage(formattedMessage);

        messageInput.value = "";

        lastMessageTime = new Date().getTime();
    } else {
        alert("Vui lòng nhập tin nhắn.");
    }

    handleChatContainerScroll();
}

function displaySentMessage(message) {
    var chatContainer = document.getElementById("chatContainer");
    var messageElement = document.createElement("div");
    messageElement.innerHTML = message;
    messageElement.classList.add("chatMessage");
    chatContainer.appendChild(messageElement);

    if (chatContainer.children.length > 10) {
        chatContainer.removeChild(chatContainer.children[0]);
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function getCurrentTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

setInterval(displayChatContent, 200);

function addUserToChat() {
    var nameInput = document.getElementById("name");
    var chatForm = document.getElementById("chatForm");
    var chatContainer = document.getElementById("chatContainer");
    var userList = document.getElementById("userList");

    var storedName = localStorage.getItem("username");

    if (storedName) {
        nameInput.value = storedName;
        nameInput.classList.remove("hidden");
        chatForm.classList.remove("hidden");
        chatContainer.classList.remove("hidden");
        userList.classList.remove("hidden");
        addUser(storedName);
        displayChatContent();
    } else {
        var randomName = generateRandomName();
        nameInput.value = randomName;
        localStorage.setItem("username", randomName);
    }
}

function removeUser(username) {
    var index = users.indexOf(username);
    if (index !== -1) {
        users.splice(index, 1);
        updateUserList();
        displaySystemMessage(`${username} left the chat`);
    }
}

function updateUserList() {
    var userListElement = document.getElementById("userList");
    userListElement.innerHTML = "";

    for (var i = 0; i < users.length; i++) {
        var userElement = document.createElement("li");
        userElement.textContent = users[i];
        userListElement.appendChild(userElement);
    }
}

function displaySystemMessage(message) {
    var chatContainer = document.getElementById("chatContainer");
    var messageElement = document.createElement("div");
    messageElement.innerHTML = `<span class='timestamp'></span> <i>${message}</i>`;
    messageElement.classList.add("systemMessage");
    chatContainer.appendChild(messageElement);
}

window.addEventListener("beforeunload", function () {
    removeUser(document.getElementById("name").value);
});

// Backup chat.txt and clear its content once a day
setInterval(backupAndClearChat, 24 * 60 * 60 * 1000);

function backupAndClearChat() {
    var currentDate = new Date();
    var backupFileName = `chatbackup${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, "0")}${currentDate.getDate().toString().padStart(2, "0")}.txt`;

    fetch('chat.txt')
        .then(response => response.text())
        .then(data => {
            // Save backup
            fetch(backupFileName, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'message=' + encodeURIComponent(data),
            })
                .then(response => response.text())
                .then(data => console.log(data))
                .catch(error => console.error('err:', error));

            // Clear chat.txt
            fetch('save.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'message=',
            })
                .then(response => response.text())
                .then(data => console.log(data))
                .catch(error => console.error('err:', error));

            // Display system message in the chat
            displaySystemMessage(`Chat content cleared, backup saved as ${backupFileName}`);
        })
        .catch(error => console.error('err:', error));
}