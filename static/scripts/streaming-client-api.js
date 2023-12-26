let startTime;
let endTime;
let duration;

let previousSrc = ''
let apiResponseMessage;

const talkVideo = document.getElementById('talk-video');
const textInput = document.getElementById('textInput');
talkVideo.setAttribute('playsinline', '');

let talkAlertLimit = false
let mobileCheck = false;


window.onload = async () => {
  textInput.disabled = false;

  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)) {
    // true for mobile device
    mobileCheck = true;
    //var contentDiv = document.getElementById('content');
    //contentDiv.style.display = 'none';
    textInput.disabled = false;
    //return;
  }

};

const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");


// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "../static/assets/agent-bot.png";
const PERSON_IMG = "../static/assets/User.jfif";
const BOT_NAME = "Abuela Veronica";
const PERSON_NAME = "You";

// Define a function to handle form submission
function handleSubmit(event) {
  console.log('handle submit')
  event.preventDefault();

  const msgText = msgerInput.value;
  // console.log("!!!!!!!")
  if (!msgText) return;
  // console.log("________")

  appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
  msgerInput.value = "";

  appendProcessingMessage(BOT_NAME, BOT_IMG, "left", '');
  botResponse(msgText);
}

function appendRetryButton(name, img, side, text) {

  //   Simple solution for small apps
  const msgHTML = `
          <div class="msg ${side}-msg" id="retry">
            

            <div class="msg-bubble">
              <div class="msg-info">
                <div class="msg-info-name">${name}</div>
                <div class="msg-info-time">${formatDate(new Date())}</div>
              </div>

              <div class="msg-text" style="text-align: left;">Unable to complete request.<button onclick="retry('${text}')" class="msger-send-btn">Retry</button></div>

            </div>
          </div>
          `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

// Add an event listener to the form
msgerForm.addEventListener("submit", handleSubmit);

function appendProcessingMessage() {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="thinking msg left-msg" id="thinking">
      <div class="Circle"></div>
      <div class="Circle"></div>
      <div class="Circle"></div>
    </div>
    `;
  // <img src="../static/assets/typing-dots-small.gif"/>



  console.log(msgerChat)
  msgerChat.innerHTML += msgHTML;
  msgerChat.scrollTop += 500;
}

function appendMessage(name, img, side, text) {
  const thinking = document.getElementById("thinking");

  if (thinking) {
    thinking.remove();
  }

  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-text" style="text-align: left;">${text}</div>
        </div>
        </div>

        <div class="msg-info-time">${formatDate(new Date())}
      </div>
    `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

function typeWriterForDynamicDiv(text, i, divId) {
  const typewriterDiv = document.getElementById(divId);
  if (typewriterDiv && i < text.length) {
    typewriterDiv.innerHTML += text.charAt(i);
    i++;

    msgerChat.scrollTop += 500;
    setTimeout(() => typeWriterForDynamicDiv(text, i, divId), 50); // Adjust the typing speed by changing the timeout duration
  }
}

function botResponse(rawText) {
  const body = document.querySelector('body')



  startTime = performance.now();

  // Bot Response
  $.get("https://api.clonecraft.co/chat?cloneid=Abuela2", { msg: rawText }).done(function (data) {

    endTime = performance.now();

    duration = endTime - startTime;

    console.log(`LLM call took ${duration} milliseconds to run.`);


    console.log(rawText);
    console.log(data);
    const msgText = data.answer;
    const wordCount = data.wordCount;
    const closeButton = document.getElementById("closeLimitModal");
    const limitModal = document.querySelector(".LimitModal");


    apiResponseMessage = msgText;

    if (msgText == 'Unable to complete request.') {

      var textRemove = document.getElementById("thinking");
      textRemove.remove();

      appendRetryButton(BOT_NAME, BOT_IMG, "left", rawText);
    }
    else {


      if (!talkAlertLimit && !mobileCheck) {
        //alert(mobileCheck)

        closeButton.addEventListener('click', () => {
          limitModal.style.opacity = 0
          setTimeout(() => limitModal.style.display = 'none', 500)
        })

        limitModal.style.display = 'flex'
        setTimeout(() => limitModal.style.opacity = 1, 0)

        // console.log(body)
        // alert('You have reached limit of talking');
      }

      appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
      talkAlertLimit = true

      previousSrc = talkVideo.src;
      talkVideo.src = data.id;
      talkVideo.muted = false;
      talkVideo.loop = false;
      talkVideo.play();

      talkVideo.onended = () => {
        talkVideo.src = previousSrc;
      };

    }




  }).fail(function () {

    var textRemove = document.getElementById("thinking");
    textRemove.remove();
    appendRetryButton(BOT_NAME, BOT_IMG, "left", rawText);
  });

}


// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

var today = new Date();


var hour = today.getHours();
var minute = today.getMinutes();

//current_time = hour + ":" + minute
//document.getElementById('date-time').innerHTML = current_time;




