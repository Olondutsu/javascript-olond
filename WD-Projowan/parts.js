// Fetching the parts from the JSON file
const response = await fetch('parts-list.json');
const parts = await response.json();

// Generate parts with the function and parts parameters
function generateParts(parts) {
    for (let i = 0; i < parts.length; i++) {

        const item = parts[i];
        // Getting the DOM element that will host the cards
        const sectionCards = document.querySelector(".cards");
        // Creating an element for an auto part
        const partElement = document.createElement("article");
        // Creating elements
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
        
        // Attach the article tag to the cards section
        sectionCards.appendChild(partElement);
        // Attach the image to partElement (the article tag)
        partElement.appendChild(imageElement);
        partElement.appendChild(nameElement);
        partElement.appendChild(priceElement);
        partElement.appendChild(categoryElement);
        // Adding elements to the DOM for the exercise
        partElement.appendChild(descriptionElement);
        partElement.appendChild(stockElement);
     }
}

generateParts(parts);

// Button management
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
// Creating the header

const pElement = document.createElement('p');
pElement.innerText = "Affordable parts";
// Creating the list
const affordableElements = document.createElement('ul');
// Adding each name to the list
for (let i = 0; i < names.length; i++) {
    const nameElement = document.createElement('li');
    nameElement.innerText = names[i];
    affordableElements.appendChild(nameElement);
}
// Add the header and then the list to the affordable results block
document.querySelector('.affordable')
    .appendChild(pElement)
    .appendChild(affordableElements);

// Exercise Code 
const availableNames = parts.map(part => part.name);
const availablePrices = parts.map(part => part.price);

for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].available === false) {
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

const inputMaxPrice = document.querySelector('#max-price');
inputMaxPrice.addEventListener('input', function () {
    const filteredParts = parts.filter(function (part) {
        return part.price <= inputMaxPrice.value;
    });
    document.querySelector(".cards").innerHTML = "";
    generateParts(filteredParts);
});