function displayCoffeeDrinks(drinks) {
    const tableBody = document.getElementById('drinksTableBody');
    tableBody.innerHTML = '';

    drinks.forEach(drink => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${drink.name}</td>
                <td>${drink.coffee_shop}</td>
                <td>${drink.rating}</td>
                <td class="action-buttons">
                    <button class="edit-btn" onclick="editDrink(${drink.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteDrink(${drink.id})">Delete</button>
                </td>
            `;
        tableBody.appendChild(row);
    });
}

async function getCoffeeDrinks() {
    try {
        const response = await fetch('/api/coffee_drinks');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const drinks = await response.json();
        displayCoffeeDrinks(drinks);
        return drinks;
    } catch (error) {
        console.error('Error fetching drinks:', error);
    }
}

async function addNewDrink() {
    const name = document.getElementById('drinkName').value;
    const coffee_shop = document.getElementById('coffeeShop').value;
    const rating = parseInt(document.getElementById('drinkRating').value);

    if (!name || !coffee_shop || !rating) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch('/api/new_coffee_drink', { // Updated endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, coffee_shop, rating }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        document.getElementById('drinkName').value = '';
        document.getElementById('coffeeShop').value = '';
        document.getElementById('drinkRating').value = '';

        await getCoffeeDrinks();
    } catch (error) {
        alert(`Error adding drink: ${error.message}`);
    }
}

async function editDrink(id) {
    console.log("Editing drink with ID:", id); // Debugging step

    const drink = await getDrinkById(id);
    console.log("Fetched drink:", drink); // Check what is returned
    if (!drink) {
        alert("Error: Drink not found!");
        return;
    }

    const name = prompt('Enter new name:', drink.name);
    const coffee_shop = prompt('Enter new coffee shop:', drink.coffee_shop);
    const rating = parseInt(prompt('Enter new rating (1-5):', drink.rating));

    if (name && coffee_shop && rating) {
        try {
            const response = await fetch(`/api/coffee_drinks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, coffee_shop, rating }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            await getCoffeeDrinks();
        } catch (error) {
            alert(`Error updating drink: ${error.message}`);
        }
    }
}

async function deleteDrink(id) {
    console.log("Attempting to delete drink with ID:", id); // Debugging step
    if (!id || id === "undefined") {
        alert("Error: Invalid drink ID!");
        return;
    }

    if (confirm('Are you sure you want to delete this drink?')) {
        try {
            const response = await fetch(`/api/coffee_drinks/${id}`, { // 🔹 Ensure ID is in URL
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            console.log("Successfully deleted drink:", id);
            await getCoffeeDrinks(); // Refresh the list
        } catch (error) {
            console.error('Delete error:', error);
            alert(`Error deleting drink: ${error.message}`);
        }
    }
}

async function getDrinkById(id) {
    try {
        const response = await fetch(`/api/coffee_drinks/${id}`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        alert(`Error fetching drink: ${error.message}`);
    }
}

function sortDrinks(field) {
    getCoffeeDrinks().then(drinks => {
        const sortedDrinks = drinks.sort((a, b) => {
            return b[field] - a[field];  // This will sort in descending order (highest to lowest)
        });
        displayCoffeeDrinks(sortedDrinks);
    });
}

document.addEventListener('DOMContentLoaded', getCoffeeDrinks);