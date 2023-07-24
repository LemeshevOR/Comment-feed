import { delay } from "./requestSimulation.js";
import { renderComments } from "./render.js";

export const likes = (comments) => {
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
        renderComments(comments, likes);
        likeButton.classList.remove("-loading-like");
        likeButton.classList.add("-active-like");
        likeButton.disabled = true;
      });

      event.stopPropagation();
    });
  }
};
