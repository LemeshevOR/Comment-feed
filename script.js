const commentElement = document.getElementById("comments")
const buttonElement = document.getElementById("add-form-button");
const nameElement = document.getElementById("add-form-name");
const textElement = document.getElementById("add-form-text");
const likeButtonElement = document.getElementById("like-button");
const likeCounterElement = document.getElementById("likes-counter");






buttonElement.addEventListener("click",()=>{
    
    let currentDate = new Date();
    let year = currentDate.getFullYear().toString().slice(-2);
    let month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    let day = ('0' + currentDate.getDate()).slice(-2); 
    let hours = ('0' + currentDate.getHours()).slice(-2); 
    let minutes = ('0' + currentDate.getMinutes()).slice(-2);
    let formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;



    nameElement.classList.remove('error');
    textElement.classList.remove('error');
    if ((nameElement.value === "") || (textElement.value === "")) {
        nameElement.classList.add('error')
        textElement.classList.add('error')
        return;
    }
    const oldListHtml = commentElement.innerHTML;
    commentElement.innerHTML = oldListHtml + 
    `<li class="comment" id="comments"> 
    <div class="comment-header">
      <div>${nameElement.value}</div>
      <div>${formattedDate}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text">
      ${textElement.value}
      </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">0</span>
        <button class="like-button"></button>
      </div>
    </div>
  </li>`
  nameElement.value="";
  textElement.value="";
  buttonElement.disabled = true;
  buttonElement.classList.add("button-error");
})


buttonElement.disabled = true;
buttonElement.classList.add("button-error");
nameElement.addEventListener("input", toggleButtonState);
textElement.addEventListener("input", toggleButtonState);

function toggleButtonState() {
  if (nameElement.value.trim() !== "" && textElement.value.trim() !== "") {
    buttonElement.disabled = false;
    buttonElement.classList.remove("button-error");
  } else {
    buttonElement.disabled = true;
    buttonElement.classList.add("button-error");
  }
}




textElement.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      buttonElement.click(); 
    }
  });






const deleteButtonElement = document.getElementById("delete-comment-button");

deleteButtonElement.addEventListener("click", () => {
  const commentsList = document.getElementsByClassName("comment");
  const lastCommentIndex = commentsList.length - 1;

  if (lastCommentIndex >= 0) {
    commentsList[lastCommentIndex].remove();
  }
});
