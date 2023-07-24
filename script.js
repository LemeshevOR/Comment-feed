import { getAndJson, postAndErrors } from "./api.js";
import { renderComments } from "./render.js";
import { enterButton } from "./enterButton.js";
import { trimButton } from "./trimButton.js";
const buttonElement = document.getElementById("add-form-button");
const nameElement = document.getElementById("add-form-name");
const textElement = document.getElementById("add-form-text");
const loadingCommentsElement = document.getElementById(
  "loading-comments-element"
);
const loadingCommentElement = document.getElementById(
  "loading-comment-element"
);
const addForm = document.querySelector(".add-form");

//Список комментариев
let comments = [];

// Загрузка списка из API
const fetchAndLogComments = (firstStart) => {
  if (firstStart) {
    loadingCommentsElement.style.display = "block";
  }
  //Get+json
  getAndJson()
    .then((responseData) => {
      comments = responseData.comments;
      renderComments(comments);
    })
    .then(() => {
      if (firstStart) {
        loadingCommentsElement.style.display = "none";
      }
    })
    .catch((error) => {
      console.log(error);
      loadingCommentsElement.textContent = "Интернет пропал(";
    });
};

// Добавление комментария
const addComment = (nameValue, textValue) => {
  loadingCommentsElement.style.display = "none";
  loadingCommentElement.textContent = "Комментарий добавляется...";
  loadingCommentElement.style.display = "block";
  addForm.style.display = "none";
  //Post+errors
  postAndErrors(nameValue, textValue, fetchAndLogComments)
    .then(() => {
      loadingCommentElement.style.display = "none";
      addForm.style.display = "flex";

      //Обнуление полей ввода
      nameElement.value = "";
      textElement.value = "";

      //Обнуление кнопки
      buttonElement.disabled = true;
      buttonElement.classList.add("button-error");
    })
    .catch((error) => {
      console.log(error);
      // Если мало символов
      if (error.message === "Мало символов") {
        loadingCommentElement.textContent = "Мало символов";
        loadingCommentElement.style.display = "block";
        setTimeout(function () {
          //Формы
          addForm.style.display = "flex";
          loadingCommentElement.style.display = "none";
        }, 1200);
      }
      // Если сервер упал
      else if (error.message === "Сервер упал") {
        addComment(nameValue, textValue);
      } else {
        loadingCommentElement.textContent = "Интернет пропал(";
        addForm.style.display = "flex";
      }
    });
};

// //Редактирование
// const edit = () => {
//   const editButtons = document.querySelectorAll(".edit-form-button");

//   for (const editButton of editButtons) {
//     editButton.addEventListener("click", (event) => {
//       const index = editButton.dataset.index;
//       if (comments[index].isEdit === false) {
//         comments[index].isEdit = true;
//       } else {
//         comments[index].isEdit = false;
//         const editedComment = document.querySelector(".edited-textarea").value;
//         comments[index].comment = editedComment;
//       }
//       event.stopPropagation();
//       renderComments();
//     });
//   }
// };

// //Ответ
// const answer = () => {
//   const commentAnswers = document.querySelectorAll(".comment");
//   for (const commentAnswer of commentAnswers) {
//     const index = commentAnswer.dataset.index;
//     if (comments[index].isEdit === false) {
//       commentAnswer.addEventListener("click", () => {
//         textElement.value = ` # ${comments[index].name}:\n ${comments[index].comment}\n # `;
//         renderComments();
//       });
//     }
//   }
// };

// Загрузка данных
fetchAndLogComments(true);

//Рендер ленты с открытием сайта
renderComments(comments);

//Создание нового комментария
buttonElement.addEventListener("click", () => {
  //Проверка на пустые поля ввода
  nameElement.classList.remove("error");
  textElement.classList.remove("error");

  if (nameElement.value === "" || textElement.value === "") {
    nameElement.classList.add("error");
    textElement.classList.add("error");
    return;
  }

  addComment(nameElement.value, textElement.value);
});
// Настройка кнопок
trimButton(buttonElement, textElement, nameElement);

// кнопка Enter = кнопка Добавить
enterButton(buttonElement, textElement);

// //Удаление последнего комментария
// const deleteButtonElement = document.getElementById("delete-comment-button");

// deleteButtonElement.addEventListener("click", () => {
//   const commentsList = document.getElementsByClassName("comment");
//   const lastCommentIndex = commentsList.length - 1;

//   if (lastCommentIndex >= 0) {
//     commentsList[lastCommentIndex].remove();
//   }
// });
