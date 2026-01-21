const colors = document.querySelectorAll(".color");

colors.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.body.style.backgroundColor = btn.dataset.color || "";
  });
});
