const cartButton = document.getElementById("cart-button");  
const form = document.querySelector("form");
const cartQuantity = document.querySelector("#cart-quantity");
const toggleCart = document.getElementById("toggleCart");
const cartTotalValue = document.getElementById("cart-total-value");
const cartTotalItems = []

document.addEventListener('DOMContentLoaded', () => {
    fetchGames() 
    fetchCart()
})


function fetchGames(){
    fetch("http://localhost:3000/games")
    .then((resp) => resp.json())
    .then((games) => games.forEach(game => renderGame(game)));
}

function renderGame(game){
    const container = document.querySelector("#game-container");
    const gameDiv = document.createElement("div");
    container.append(gameDiv);
    gameDiv.className = "game";
    gameDiv.id = game.id;   

    const gameName = document.createElement("h2");
    gameName.textContent = game.name;

    const img = document.createElement("img");
    img.src = game.image;
    img.alt = game.name;
        
    const price = document.createElement("p");
    price.id = "price";
    price.textContent = `Price: $${game.price}`;

    const release = document.createElement("p");
    release.textContent = `Release: ${game.release}`;

    const genre = document.createElement("p");
    genre.textContent = `Genre: ${game.genre}`;

    const mode = document.createElement("p");
    mode.textContent = `Mode: ${game.mode}`

    const btn = document.createElement("button");
    btn.className = "buybtn";
    btn.textContent = "Add to Cart";
    btn.addEventListener("click", () => addToCart(game)); 
    gameDiv.append(gameName, img, price, release, genre, mode, btn);

}

function addToCart(game){
    const checkCartItem = cartTotalItems.find(cartItem => cartItem.gameId === game.id)
    if(checkCartItem){
        const newQuantity = checkCartItem.quantity + 1
        fetch(`http://localhost:3000/cartItems/${checkCartItem.id}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                price: game.price * newQuantity,
                quantity: newQuantity
            })
        })
        .then(resp => resp.json())
        .then(updatedCartItem => {
            const cartItemCard = document.getElementById(updatedCartItem.id);
            console.log(cartItemCard)
        })
    } else { 
        fetch("http://localhost:3000/cartItems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                gameId: game.id,
                price: game.price,
                name: game.name,
                image: game.image,
                quantity: 1
            })
        })
        .then((resp) => resp.json())
        .then((newCartItem) => {
            updateCart(newCartItem)
        });
    }

}

function updateCart(cartItem){
    console.log(cartItem)
}


function fetchCart () {
    fetch("http://localhost:3000/cartItems")
    .then(resp => resp.json())
    .then(cartItems => 
        cartItems.forEach(cartItem => renderCartItem(cartItem)))
}

function renderCartItem(cartItem) {
    const cItem = document.createElement('cart-item');
    toggleCart.append(cItem);
    cItem.id = cartItem.gameId;
    cItem.className = "cart-item";

    const name = document.createElement("h3");
    name.textContent = cartItem.name;

    const img = document.createElement("img");
    img.src = cartItem.image;

    const price = document.createElement("span");
    price.textContent = `Price: $${cartItem.price}`;

    const quantity = document.createElement("span");
    quantity.textContent = `Quantity: ${cartItem.quantity}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
        fetch(`http://localhost:3000/cartItems/${cartItem.id}`, {
            method: "DELETE",
        })
        .then(resp => resp.json())
        .then(cartItems => {
            cItem.remove();
            cartQuantity.textContent = cartItems.length;
            cartTotalValue.textContent = cartItems.reduce((total, cartItem) => total + cartItem.price, 0);
        })
    })
    cItem.append(name, img, price, quantity, removeBtn);
}

function updateCartElement(cartItem){
    const cartItemCard = document.getElementById(cartItem.id);
}

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const input = document.querySelector("input").value.toLowerCase();
        const games = document.querySelectorAll(".game");
        games.forEach((game) => {
            const gameName = game.querySelector("h2").textContent.toLowerCase();
            if (gameName.includes(input)) {
                game.style.display = "";
            } else {
                game.style.display = "none";
                function alertMessage(){
                    const div = document.getElementById("alert-message");
                    div.textContent = "Sorry, no games found!";
                }                
                alertMessage()
            }
        })
    });


    cartButton.addEventListener("click", () => {
        toggleCart.classList.toggle("hidden");
    })




