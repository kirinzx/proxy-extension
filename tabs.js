const firstButton = document.querySelector("#tab-1");
const secondButton = document.querySelector("#tab-2");
const firstTab = document.querySelector(".first-tab");
const secondTab = document.querySelector(".second-tab");

secondButton.addEventListener("click", () => {
  if (!secondTab) return;

  secondTab.classList.add("second-tab--show");
  firstTab.classList.add("first-tab--hide");
});

firstButton.addEventListener("click", () => {
  if (!secondTab) return;

  secondTab.classList.remove("second-tab--show");
  firstTab.classList.remove("first-tab--hide");
});