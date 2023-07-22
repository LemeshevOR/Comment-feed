const commentElement = document.getElementById("comments");
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

// Функция для имитации запросов в API
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

//Список комментариев
let comments = [];

// Загрузка списка из API
const fetchAndLogComments = (firstStart) => {
  if (firstStart) {
    loadingCommentsElement.style.display = "block";
  }

  return fetch("https://wedev-api.sky.pro/api/v1/olegzuz/comments", {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((responseData) => {
      comments = responseData.comments;
      renderComments();
    })
    .then(() => {
      if (firstStart) {
        loadingCommentsElement.style.display = "none";
      }
    });
};

// Добавление комментария
const addComment = (nameValue, textValue) => {
  loadingCommentElement.style.display = "block";
  addForm.style.display = "none";

  return fetch("https://wedev-api.sky.pro/api/v1/olegzuz/comments", {
    method: "POST",
    body: JSON.stringify({
      name: nameValue
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;"),
      text: textValue
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll(/#([^#]+)#/g, "<div class='quote'>$1</div>"),
      likes: 0,
      isLiked: false,
    }),
  })
    .then(() => {
      return fetchAndLogComments(false);
    })
    .then(() => {
      loadingCommentElement.style.display = "none";
      addForm.style.display = "flex";
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

//Рендер
const renderComments = () => {
  const commentsHtml = comments
    .map((comment) => {
      const index = comments.indexOf(comment);
      likeClass = comment.isLiked ? "-active-like" : "";
      const editText = comment.isEdit ? "Сохранить" : "Редактировать";
      const editClass = comment.isEdit ? "" : "button-error";
      editComment = comment.isEdit
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
  likes();
  //edit();
  //answer();
};

//Лайки
const likes = () => {
  const likeButtons = document.querySelectorAll(".like-button");

  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      const index = likeButton.dataset.index;
      likeButton.disabled = true;
      likeButton.classList.add("-loading-like");

      delay(1000).then(() => {
        if (comments[index].isLiked === false) {
          comments[index].isLiked = true;
          comments[index].likes++;
        } else {
          comments[index].isLiked = false;
          comments[index].likes--;
        }
        renderComments();
        likeButton.classList.remove("-loading-like");
        likeButton.classList.add("-active-like");
        likeButton.disabled = true;
      });

      event.stopPropagation();
    });
  }
};

// Загрузка данных

fetchAndLogComments(true);

//Рендер ленты с открытием сайта
renderComments();

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

  //Обнуление кнопки
  buttonElement.disabled = true;
  buttonElement.classList.add("button-error");

  //Обнуление полей ввода
  nameElement.value = "";
  textElement.value = "";
});

//Начальное отключение кнопки
buttonElement.disabled = true;
buttonElement.classList.add("button-error");
nameElement.addEventListener("input", toggleButtonState);
textElement.addEventListener("input", toggleButtonState);

//Отключение кнопки при пустом поле ввода
function toggleButtonState() {
  if (nameElement.value.trim() !== "" && textElement.value.trim() !== "") {
    buttonElement.disabled = false;
    buttonElement.classList.remove("button-error");
  } else {
    buttonElement.disabled = true;
    buttonElement.classList.add("button-error");
  }
}

//Кнопка enter это кнопка оправить
textElement.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    buttonElement.click();
  }
});

// //Удаление последнего комментария
// const deleteButtonElement = document.getElementById("delete-comment-button");

// deleteButtonElement.addEventListener("click", () => {
//   const commentsList = document.getElementsByClassName("comment");
//   const lastCommentIndex = commentsList.length - 1;

//   if (lastCommentIndex >= 0) {
//     commentsList[lastCommentIndex].remove();
//   }
// });
