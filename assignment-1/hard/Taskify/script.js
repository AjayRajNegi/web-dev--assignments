const firstDiv = document.querySelector(".firstDiv");
const secondDiv = document.querySelector(".secondDiv");
const thirdDiv = document.querySelector(".thirdDiv");
const forthDiv = document.querySelector(".forthDiv");

addNew = async (i) => {
  const input = await formHandler();
  await addNewHandler(i, input);
};

// Handles adding new div
async function addNewHandler(i, input) {
  switch (i) {
    case 1:
      const newEl1 = document.createElement("div");
      newEl1.classList.add("newEl");

      newEl1.setAttribute("draggable", "true");
      newEl1.id = "newEl1";
      newEl1.innerText = input;

      newEl1.addEventListener("dragstart", dragstartHandler);

      firstDiv.appendChild(newEl1);

      break;
    case 2:
      const newEl2 = document.createElement("div");
      newEl2.classList.add("newEl");

      newEl2.setAttribute("draggable", "true");
      newEl2.id = "newEl2";
      newEl2.innerText = input;

      newEl2.addEventListener("dragstart", dragstartHandler);

      secondDiv.appendChild(newEl2);
      break;

    case 3:
      const newEl3 = document.createElement("div");
      newEl3.classList.add("newEl");

      newEl3.setAttribute("draggable", "true");
      newEl3.id = "newEl3";
      newEl3.innerText = input;

      newEl3.addEventListener("dragstart", dragstartHandler);

      thirdDiv.appendChild(newEl3);
      break;

    case 4:
      const newEl4 = document.createElement("div");
      newEl4.classList.add("newEl");

      newEl4.setAttribute("draggable", "true");
      newEl4.id = "newEl4";
      newEl4.innerText = input;

      newEl4.addEventListener("dragstart", dragstartHandler);

      forthDiv.appendChild(newEl4);
      break;
  }
}

// Handles Form Data
async function formHandler() {
  document.querySelector(".taskForm").style.display = "block";
  const form = document.querySelector("#form");

  return new Promise((resolve, reject) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const obj = Object.fromEntries(new FormData(form));
      const name = obj.name;

      resolve(name);
    });
  });
}

// Handles Form Closing
function exitHandler() {
  document.querySelector(".taskForm").style.display = "none";
}

// Handles Drag and Drop
function dragstartHandler(ev) {
  ev.dataTransfer.setData("text/plain", ev.currentTarget.id);
}
function dragoverHandler(ev) {
  ev.preventDefault();
}
function dropHandler(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}
