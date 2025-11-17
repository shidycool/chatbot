/*
async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const chatlog = document.getElementById("chatlog");
  const msg = userInput.value.trim();
  if (!msg) return;

  // Display user's message
  chatlog.innerHTML += `<div class="user-msg"><b>You:</b> ${msg}</div>`;
  userInput.value = '';

  // Send message to Flask backend
  const response = await fetch(`/get?msg=${encodeURIComponent(msg)}`);
  const botReply = await response.text();

  // Display bot's reply
  chatlog.innerHTML += `<div class="bot-msg"><b>Bot:</b> ${botReply}</div>`;
  chatlog.scrollTop = chatlog.scrollHeight;
}

// Allow pressing Enter to send message
document.getElementById("userInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") sendMessage();
});
*/

class Chatbox {
  constructor(){
    this.args = {
      openButton:document.querySelector('.chatbox__button'),
      chatBox:document.querySelector('.chatbox__support'),
      sendButton:document.querySelector('.send__button')
    }
    this.state = false;
    this.messages =[];
  }

  display() {
    const {openButton, chatBox, sendButton} = this.args;
    openButton.addEventListener('click', () => this.toggleState(chatBox))
    sendButton.addEventListener('click', () => this.onSendButton(chatBox))

    const node = chatBox.querySelector('input');
    node.addEventListener("keyup", ({key}) => {
      if (key === "Enter"){
        this.onSendButton(chatBox)
      }
    })
  }

  toggleState(chatbox) {
    this.state = !this.state;

    //show or hide the box
    if(this.state) {
      chatbox.classList.add('chatbox--active')
    } else {
      chatbox.classList.remove('chatbox--active')
    }
  }

  onSendButton(chatbox) {
    var textField = chatbox.querySelector('input');
    let text1 = textField.value
    if(text1 === "") {
      return;
    }

    let msg1 = {name: "User", msg: text1}
    this.messages.push(msg1);

    //http://127.0.0.1:5000/predict
    fetch(SCRIPT_ROOT + '/predict', { method:'POST',
      body: JSON.stringify({msg:text1}),
      mode:'cors',
      headers: {
    'Content-Type': 'application/json'
},
  })
  .then(r => r.json())
  .then(r => {
    let msg2 = {name: "Kmpdc", msg: r.answer};
    this.messages.push(msg2);
    this.updateChatText(chatbox)
    textField.value = ''
    
  }).catch((error) => {
    confirm.error('Error:', error);
    this.updateChatText(chatbox)
    textField.value = ''
  });
  }

  updateChatText(chatbox) {
    var html = '';
    this.messages.slice().reverse().forEach(function(item,) {
      if(item.name ==="Kmpdc")
      {
        html += `<div class="messages__item messages__item--visitor">${item.msg}</div>`;
      }
      else
      {
        html += `<div class="messages__item messages__item--operator">${item.msg}</div>`;
      }
    });

    const chatmessage = chatbox.querySelector('.chatbox__messages');
    chatmessage.innerHTML = html;
  }
}

const chatbox = new Chatbox();
chatbox.display();

