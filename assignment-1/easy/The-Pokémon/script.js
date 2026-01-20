const inputId = document.getElementById("input");
const searchButton = document.getElementById("searchButton");
const pokemonName = document.getElementById("pokemonName");

searchButton.addEventListener("click", () => {
  const id = inputId.value;
  userAction(id);
});
const userAction = async (id) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  console.log(data.name);
  pokemonName.innerText = data.name;
};
