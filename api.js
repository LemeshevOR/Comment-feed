import { sanitizeHtml } from "./sanitizeHTML.js";

//Получение комментариев
export const getAndJson = () => {
  return fetch("https://wedev-api.sky.pro/api/v1/olegzuz/comments", {
    method: "GET",
  }).then((response) => {
    return response.json();
  });
};

//Добавление комментария
export const postAndErrors = (nameValue, textValue, fetchAndLogComments) => {
  return fetch("https://wedev-api.sky.pro/api/v1/olegzuz/comments", {
    method: "POST",
    body: JSON.stringify({
      name: sanitizeHtml(nameValue),
      text: sanitizeHtml(textValue)
        .replaceAll(/#([^#]+)#/g, "<div class='quote'>$1</div>"),
      likes: 0,
      isLiked: false,
      forceError: true,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Мало символов");
    }
    if (response.status === 500) {
      throw new Error("Сервер упал");
    } else {
      return fetchAndLogComments(false);
    }
  });
};
