export const trimButton = (buttonElement, textElement, nameElement) => {
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
};
