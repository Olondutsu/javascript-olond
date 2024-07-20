
// Charger les pièces et les recettes depuis les fichiers JSON
async function loadPartsAndRecipes() {
    // Fetching the parts from the JSON file
    const response = await fetch('parts-list.json');
    const parts = await response.json();

    const recipesResponse = await fetch('recipes.json');
    const recipes = await recipesResponse.json();

    return { parts, recipes };
}

// Déclarez recipes comme une variable globale pour être accessible dans toggleSelection
let recipes = [];

const selectedParts = [];

function toggleSelection(part, imageElement) {
    // Cette fonction gère la sélection d'une pièce
    const index = selectedParts.indexOf(part);
    if (index === -1) {
        selectedParts.push(part);
        imageElement.style.border = '2px solid green'; // Highlight the selected part
    } else {
        selectedParts.splice(index, 1);
        imageElement.style.border = ''; // Remove highlight
    }
    console.log('Selected parts:', selectedParts);
    showAvailableRecipes(selectedParts, recipes);
}

// Générer les pièces avec la fonction et les paramètres des pièces
function generateParts(parts) {
    const sectionCards = document.querySelector(".cards");
    sectionCards.innerHTML = ""; // Effacer les cartes existantes

    parts.forEach(item => {
        // Créer un élément pour une pièce auto
        const partElement = document.createElement("article");

        // Créer les éléments
        const imageElement = document.createElement("img");
        imageElement.src = item.image;

        const nameElement = document.createElement("h2");
        nameElement.innerText = item.name;

        const priceElement = document.createElement("p");
        priceElement.innerText = `Price: ${item.price} € (${item.price < 35 ? "€" : "€€€"})`;

        const categoryElement = document.createElement("p");
        categoryElement.innerText = item.category ?? "(no category)";

        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = item.description ?? "No description at the moment.";

        const stockElement = document.createElement("p");
        stockElement.innerText = item.available ? "In stock" : "Out of stock";
        
        // Attacher la balise article à la section des cartes
        sectionCards.appendChild(partElement);

        // Attacher l'image à partElement (la balise article)
        partElement.appendChild(imageElement);
        partElement.appendChild(nameElement);
        partElement.appendChild(priceElement);
        partElement.appendChild(categoryElement);

        // Ajouter des éléments au DOM pour l'exercice
        partElement.appendChild(descriptionElement);
        partElement.appendChild(stockElement);

        //Listener pour la selection + appel de la fonction 
        // Ajouter un écouteur d'événement à l'image
        imageElement.addEventListener('click', (event) => {
            const rect = imageElement.getBoundingClientRect();
            const x = event.clientX - rect.left; // x coordinate of the click within the image
            const y = event.clientY - rect.top;  // y coordinate of the click within the image

            console.log(`Clicked at X: ${x}, Y: ${y} on ${item.name}`);
            toggleSelection(item, imageElement);
        });
    });
}

function showAvailableRecipes(selectedParts, recipes) {
    const selectedNames = selectedParts.map(part => part.name);
    const recipeSection = document.querySelector('.available-recipes');
    recipeSection.innerHTML = ""; // Effacer les recettes existantes

    recipes.forEach(recipe => {
        // Vérifier si tous les ingrédients de la recette sont sélectionnés
        const canMakeRecipe = recipe.ingredients.every(ingredient => selectedNames.includes(ingredient));
        
        if (canMakeRecipe) {
            const recipeElement = document.createElement('p');
            recipeElement.innerText = recipe.name;
            recipeSection.appendChild(recipeElement);
        }
    });
}

// Charger les données et initialiser l'application
loadPartsAndRecipes().then(({ parts, recipes: loadedRecipes }) => {
    recipes = loadedRecipes; // Affecter recipes à la variable globale
    generateParts(parts);

    // Gestion des boutons
    const sortButton = document.querySelector(".btn-sort");

    sortButton.addEventListener("click", function () {
        const sortedParts = Array.from(parts);
        sortedParts.sort(function (a, b) {
            return a.price - b.price;
        });
        document.querySelector(".cards").innerHTML = "";
        generateParts(sortedParts);
    });

    const filterButton = document.querySelector(".btn-filter");

    filterButton.addEventListener("click", function () {
        const filteredParts = parts.filter(function (part) {
            return part.price <= 35;
        });
        document.querySelector(".cards").innerHTML = "";
        generateParts(filteredParts);
    });

    // Correction Exercise
    const descendingButton = document.querySelector(".btn-descending");

    descendingButton.addEventListener("click", function () {
        const sortedParts = Array.from(parts);
        sortedParts.sort(function (a, b) {
            return b.price - a.price;
        });
        document.querySelector(".cards").innerHTML = "";
        generateParts(sortedParts);
    });

    const noDescriptionButton = document.querySelector(".btn-nodesc");

    noDescriptionButton.addEventListener("click", function () {
        const filteredParts = parts.filter(function (part) {
            return part.description;
        });
        document.querySelector(".cards").innerHTML = "";
        generateParts(filteredParts);
    });

    const names = parts.map(part => part.name);
    for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].price > 35) {
            names.splice(i, 1);
        }
    }
    console.log(names);

    // Créer l'en-tête
    const pElement = document.createElement('p');
    pElement.innerText = "Affordable parts";

    // Créer la liste
    const affordableElements = document.createElement('ul');

    // Ajouter chaque nom à la liste
    for (let i = 0; i < names.length; i++) {
        const nameElement = document.createElement('li');
        nameElement.innerText = names[i];
        affordableElements.appendChild(nameElement);
    }
    // Ajouter l'en-tête, puis la liste au bloc des résultats abordables
    document.querySelector('.affordable')
        .appendChild(pElement)
        .appendChild(affordableElements);

    // Exercise Code 
    const availableNames = parts.map(part => part.name);
    const availablePrices = parts.map(part => part.price);

    for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].available === false){
            availableNames.splice(i, 1);
            availablePrices.splice(i, 1);
        }
    }

    const availableElements = document.createElement('ul');

    for (let i = 0; i < availableNames.length; i++) {
        const nameElement = document.createElement('li');
        nameElement.innerText = `${availableNames[i]} - ${availablePrices[i]} €`;
        availableElements.appendChild(nameElement);
    }

    const availablePElement = document.createElement('p');
    availablePElement.innerText = "Available parts:";
    document.querySelector('.available').appendChild(availablePElement).appendChild(availableElements);

    const inputMaxPrice = document.querySelector('#prix-max');
    inputMaxPrice.addEventListener('input', function () {
        const filteredParts = parts.filter(function (part) {
            return part.price <= inputMaxPrice.value;
        });
        document.querySelector(".cards").innerHTML = "";
        generateParts(filteredParts);
    });
});