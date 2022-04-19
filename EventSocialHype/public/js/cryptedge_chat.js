$(document).ready(function () {
    const chatForm = document.getElementById("chat-form");
    const myId = document.getElementById("sender_id").value;
    const chatMessages = document.querySelector(".chat-content");
    const chatBox = document.getElementById("mychatbox");
    const socket = io();

    // joined emitting
    socket.emit("joined", myId);


    // scroll down to last chat

    //chatBox.scrollTop = chatBox.scrollHeight;
    chatMessages.scrollTop = chatMessages.scrollHeight;
    console.log("hello");

    // dsiplay my messages sent by me
    socket.on("my_message", message => {
        outputMySentMessage(message);
        // scroll down after every text
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // display messages sent to me
    socket.on("incoming_message", message => {
        outputMyRecievedMessage(message);
        // scroll down after every text
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // if ($("#chat-scroll").length) {
    // $("#chat-scroll").css({
    //   height: 450
    // }).niceScroll();
    // }

    if ($(".chat-content").length) {
        $(".chat-content").niceScroll({
            cursoropacitymin: .3,
            cursoropacitymax: .8,
        });
        $('.chat-content').getNiceScroll(0).doScrollTop($('.chat-content').height());
    }
    //chatMessages.scrollTop = chatMessages.scrollHeight;

    // message submit
    chatForm.addEventListener("submit", e => {
        e.preventDefault();

        if (e.target.elements.msg.value.length > 0) {
            const msg = e.target.elements.msg.value;
            // const id = e.target.elements.id.value;
            // const userId = e.target.elements.sender_id.value;
            const senderId = e.target.elements.sender_id.value;
            const receiverId = e.target.elements.receiver_id.value;
            const content = {
                msg: msg,
                // id: id,
                // userId: userId
                senderId: senderId,
                receiverId: receiverId
            }

            socket.emit("chatMessage", content);
            // clear input value
            e.target.elements.msg.value = "";
            // focus on input
            e.target.elements.msg.focus();
        }
    });

    // Output messages to DOM
    function outputMySentMessage(message) {

        const div = document.createElement('div');
        div.classList.add("chat-item");
        div.classList.add("chat-right");
        div.innerHTML = `<div class="chat-details">
                        <div class="chat-text">${message.text}</div>
                        <div class="chat-time">${message.time}</div>
                    </div>`;
        document.querySelector(".chat-content").appendChild(div);
    }

    function outputMyRecievedMessage(message) {
        const div = document.createElement('div');
        div.classList.add("chat-item");
        div.classList.add("chat-left");
        div.innerHTML = `<div class="chat-details">
                        <div class="chat-text">${message.text}</div>
                        <div class="chat-time">${message.time}</div>
                    </div>`;
        document.querySelector(".chat-content").appendChild(div);
    }
});