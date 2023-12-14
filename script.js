var users = [];
var lastMessageTime = 0;
var delayBetweenMessages = 2000; // 2 seconds
var fpsDisplay = document.getElementById("fpsDisplay");
var fpsCounter = 0;
var lastFpsUpdate = new Date().getTime();

window.onload = function () {
    showDate();
    showDate1();
    updateChat();
    updateFps();
    checkUsername();
}

function updateFps() {
    fpsCounter++;
    var currentTime = new Date().getTime();
    var elapsedTime = currentTime - lastFpsUpdate;

    if (elapsedTime > 1000) {
        var fps = Math.round((fpsCounter * 1000) / elapsedTime);
        fpsDisplay.innerHTML = "FPS: " + fps;
        fpsCounter = 0;
        lastFpsUpdate = currentTime;
    }

    requestAnimationFrame(updateFps);
}

const imageSources = ['/cute2.gif', '/cute.gif'];
const randomIndex = Math.floor(Math.random() * imageSources.length);
document.getElementById('kbn1').src = imageSources[randomIndex];

function showDate() {
    function updateDisplay() {
        const targetDate = new Date();
        const currentDate = new Date("2023/11/28");
        const currentTimeGMT7 = currentDate.getTime() + (7 * 60 * 60 * 1000);
        const timeDifference = targetDate.getTime() - currentTimeGMT7;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const displayString = `${days} ngày ${hours % 24} giờ ${minutes % 60} phút ${seconds % 60} giây.`;
        document.getElementById('momk').innerHTML = displayString;
        requestAnimationFrame(updateDisplay);
    }
    updateDisplay();
}

function showDate1() {
    function updateDisplay() {
        const targetDate = new Date("2023/12/25");
        const currentDate = new Date();
        const currentTimeGMT7 = currentDate.getTime() + (7 * 60 * 60 * 1000);
        const timeDifference = targetDate.getTime() - currentTimeGMT7;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const displayString = `${days} ngày ${hours % 24} giờ ${minutes % 60} phút ${seconds % 60} giây.`;
        document.getElementById('mom').innerHTML = displayString;
        requestAnimationFrame(updateDisplay);
    }
    updateDisplay();
}

function getRandomIcon() {
    var icons = ['ico1.ico', 'ico3.ico', 'ico3.ico', 'ico4.ico'];
    var randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
}

document.addEventListener('DOMContentLoaded', function () {
    var favicon = document.getElementById('favicon');
    favicon.href = getRandomIcon();
});

var messageInput = document.getElementById("messageInput");
messageInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        sendMessage();
    }
});

window.addEventListener('beforeunload', function () {
    handleUserExit();
});

function handleUserExit() {
    var userName = localStorage.getItem("username");
    if (userName) {
        removeUser(userName);
    }
}

function checkUsername() {
    var userName = localStorage.getItem("username");
    var nameInput = document.getElementById("name");
    var chatContainer = document.getElementById("chatContainer");
    var userListContainer = document.getElementById("userListContainer");
    var userList = document.getElementById("userList");
    var storedUsers = localStorage.getItem("users");
    if (storedUsers) {
        users = JSON.parse(storedUsers);
        updateUsersList();
    }

    if (userName) {
        if (users.includes(userName)) {
            nameInput.value = "";
            nameInput.classList.remove("hidden");
            chatContainer.classList.remove("hidden");
            userListContainer.classList.remove("hidden");
            document.getElementById("chatForm").classList.add("hidden");
        } else {
            nameInput.classList.add("hidden");
            document.getElementById("chatForm").classList.remove("hidden");
            chatContainer.classList.remove("hidden");
            userListContainer.classList.remove("hidden");
        }

        addUser(userName);
        displayChatContent();
    } else {
        nameInput.value = "";
        nameInput.classList.remove("hidden");
        chatContainer.classList.remove("hidden");
        userListContainer.classList.add("hidden");
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
    if (atBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function displayChatContent() {
    // Ignore me, Im Trash
}

function addUser(username) {
    users.push(username);
    updateLocalStorageUsers();
    updateUsersList();
}

function removeUser(username) {
    var index = users.indexOf(username);
    if (index !== -1) {
        users.splice(index, 1);
        updateLocalStorageUsers();
        updateUsersList();
    }
}

function updateLocalStorageUsers() {
    localStorage.setItem("users", JSON.stringify(users));
}

function updateUsersList() {
    var userListElement = document.getElementById("userListContainer");
    userListElement.innerHTML = ""; // Xóa nội dung cũ

    var userListTitle = document.createElement("div");
    userListTitle.id = "userListTitle";
    userListTitle.textContent = "Users:";
    userListElement.appendChild(userListTitle);

    var userList = document.createElement("ul");
    userList.id = "userList";
    userListElement.appendChild(userList);

    for (var i = 0; i < users.length; i++) {
        var listItem = document.createElement("li");
        listItem.textContent = users[i];
        userList.appendChild(listItem);
    }
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
        var lines = [];
        while (message.length > 150) {
            lines.push(message.substring(0, 150));
            message = message.substring(150);
        }
        lines.push(message);
        lines = lines.slice(0, 10);
        var formattedMessage = `<span class='timestamp'>${getCurrentTime()}</span><b>${name}</b>: `;
        formattedMessage += lines.join("<br>") + "<br>";
        fetch('save.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'message=' + encodeURIComponent(formattedMessage),
        })
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('Lỗi:', error));

        displaySentMessage(formattedMessage);

        messageInput.value = "";

        lastMessageTime = new Date().getTime();
    } else {
        alert("Vui lòng nhập tin nhắn.");
    }

    if (!nameInput.classList.contains("hidden")) {
        nameInput.classList.add("hidden");
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

function getCurrentDateTime() {
    var date = new Date();
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var year = date.getFullYear();
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var seconds = date.getSeconds().toString().padStart(2, '0');
    return `<span style="color: #007bff">${day}/${month}/${year} ${hours}:${minutes}:${seconds}</span>`;
}

function updateChat() {
    fetch('chat.filelog', { cache: 'no-store' })
        .then(response => response.text())
        .then(data => {
            document.getElementById('chatContainer').innerHTML = data;
            handleChatContainerScroll();
            setTimeout(updateChat, 100);
        })
        .catch(error => console.error('Lỗi:', error));
}

updateChat();