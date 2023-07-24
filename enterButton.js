//Кнопка enter это кнопка оправить
export const enterButton = (button, textElement) => {
  textElement.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      button.click();
    }
  });
};
