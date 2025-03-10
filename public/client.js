// Writing a function to communicate with our local server

const getCoffeeDrinks = async () => {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Loading...";

  try {
    const response = await fetch(`/api/coffee_drinks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    resultElement.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`;
  }
};
document
    .getElementById("getCoffeeDrinks")
    .addEventListener("click", () => {
      // Navigate to coffeeDrinks.html
      window.location.href = 'coffeeDrinks.html';
    });
document
    .getElementById("getPhotos")
    .addEventListener("click", () => {
      // Navigate to coffeeDrinks.html
      window.location.href = 'photoMemories.html';
    });
