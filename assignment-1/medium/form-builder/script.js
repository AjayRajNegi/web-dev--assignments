const fieldSelect = document.getElementById("field");
const previewForm = document.querySelector(".preview");
const fieldInput = document.getElementById("label");
const addButton = document.getElementById("addFieldBtn");

addButton.addEventListener("click", addField);

function addField() {
  const type = fieldSelect.value;
  const labelText = fieldInput.value.trim();

  if (!type) {
    alert("Please select a field type.");
    return;
  }

  if (!labelText && !["checkbox", "button"].includes(type)) {
    alert("Please enter a label or text.");
    return;
  }

  let element;

  switch (type) {
    case "h2":
    case "h4":
    case "p":
      element = document.createElement(type);
      element.textContent = labelText;
      break;

    case "text":
    case "email":
      element = createInput(type, labelText);
      break;

    case "textarea":
      element = createTextarea(labelText);
      break;

    case "checkbox":
      element = createCheckbox(labelText || "Checkbox");
      break;

    case "button":
      element = document.createElement("button");
      element.type = "submit";
      element.textContent = labelText || "Submit";
      break;
  }

  previewForm.appendChild(element);
  fieldInput.value = "";
}

function createInput(type, labelText) {
  const wrapper = document.createElement("div");

  const label = document.createElement("label");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = type;
  input.placeholder = labelText;

  wrapper.append(label, input);
  return wrapper;
}

function createTextarea(labelText) {
  const wrapper = document.createElement("div");

  const label = document.createElement("label");
  label.textContent = labelText;

  const textarea = document.createElement("textarea");
  textarea.placeholder = labelText;

  wrapper.append(label, textarea);
  return wrapper;
}

function createCheckbox(labelText) {
  const wrapper = document.createElement("div");

  const input = document.createElement("input");
  input.type = "checkbox";

  const label = document.createElement("label");
  label.textContent = " " + labelText;

  wrapper.append(input, label);
  return wrapper;
}
