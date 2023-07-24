const commentElement = document.getElementById("comments");
import { likes } from "./likes.js";

//Рендер
export const renderComments = (comments) => {
  const commentsHtml = comments
    .map((comment) => {
      const index = comments.indexOf(comment);
      let likeClass = comment.isLiked ? "-active-like" : "";
      const editText = comment.isEdit ? "Сохранить" : "Редактировать";
      const editClass = comment.isEdit ? "" : "button-error";
      let editComment = comment.isEdit
        ? `<textarea class="add-form-text edited-textarea" rows="3">${comment.text}</textarea>`
        : `<div class="comment-text ">${comment.text}</div>`;
      const date = new Date(comment.date);
      const formattedDate = `${("0" + date.getDate()).slice(-2)}.${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}.
      ${date.getFullYear() % 100} ${("0" + date.getHours()).slice(-2)}:${(
        "0" + date.getMinutes()
      ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;

      return `<li class="comment" id="comments" data-index="${comment.id - 1}"> 
    <div class="comment-header">
      <div>${comment.author.name}</div>
      <div>${formattedDate}</div>
    </div>
    <div class="comment-body">
      ${editComment}
    </div>
    <div class="comment-footer">
      <button class="edit-form-button ${editClass}" data-index="${
        comment.id - 1
      }">${editText}</button>
      <div class="likes">
        <span class="likes-counter">${comment.likes}</span>
        <button class="like-button ${likeClass}" data-index="${index}"></button>
      </div>
    </div>
  </li>`;
    })
    .join("");
  commentElement.innerHTML = commentsHtml;
  likes(comments);
  //edit();
  //answer();
};
