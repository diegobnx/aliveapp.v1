const select = (element) => document.querySelector(element);
const selectAll = (element) => document.querySelectorAll(element);
let modalQtd = 1;
let modalKey;
let pizzas;


//GET CART BY SESSION STORAGE
localStorage.getItem("pizza_cart")
	? (cart = JSON.parse(localStorage.getItem("pizza_cart")))
	: (cart = []);

//LIST PIZZAS
const api = fetch(
    `http://localhost:3000/products/${categ}`
    )
	.then((response) => response.json())
	.then((data) => {
		pizzas = data;

		updateCart();

		data.map((item, index) => {
			let pizzaItem = select(".models .pizza-item").cloneNode(true);
			pizzaItem.setAttribute("data-key", index);
			pizzaItem.querySelector(".pizza-item--img img").src = item.img;
			pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
			pizzaItem.querySelector(".pizza-item--price").innerHTML = "";
			pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

			pizzaItem.querySelector("a").addEventListener("click", (e) => {
				e.preventDefault();
				modalQtd = 1;
				let key = e.target.closest(".pizza-item").getAttribute("data-key");
				modalKey = key;

				select(".pizzaBig img").src = data[key].img;
				select(".pizzaInfo h1").innerHTML = data[key].name;
				select(".pizzaInfo--actualPrice").innerHTML = `R$ ${data[
					key
				].price[2].toFixed(2)}`;
				select(".pizzaInfo .pizzaInfo--desc").innerHTML = data[key].description;
				select(".pizzaInfo--size.selected").classList.remove("selected");
				selectAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
					if (sizeIndex == 2) {
						size.classList.add("selected");
					}
					size.querySelector("span").innerHTML = data[key].sizes[sizeIndex];
				});
				select(".pizzaInfo--qt").innerHTML = modalQtd;
				select(".pizzaWindowArea").style.opacity = 0;
				select(".pizzaWindowArea").style.display = "flex";
				setTimeout(() => {
					select(".pizzaWindowArea").style.opacity = 1;
				}, 200);
			});

			select(".pizza-area").append(pizzaItem);
		});
	});

//MODAL EVENTS
const closeModal = () => {
	select(".pizzaWindowArea").style.opacity = 0;
	setTimeout(() => {
		select(".pizzaWindowArea").style.display = "none";
	}, 200);
};
selectAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
	(item) => {
		item.addEventListener("click", closeModal);
	}
);

//CONTROLS
select(".pizzaInfo--qtmenos").addEventListener("click", () => {
	if (modalQtd > 1) {
		modalQtd--;
		select(".pizzaInfo--qt").innerHTML = modalQtd;
	}
});
select(".pizzaInfo--qtmais").addEventListener("click", () => {
	modalQtd++;
	select(".pizzaInfo--qt").innerHTML = modalQtd;
});
selectAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
	size.addEventListener("click", (e) => {
		select(".pizzaInfo--size.selected").classList.remove("selected");
		size.classList.add("selected");

		let sizeKey = size.getAttribute("data-key");

		select(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzas[modalKey].price[
			sizeKey
		].toFixed(2)}`;
	});
});

//ADD TO CART
select(".pizzaInfo--addButton").addEventListener("click", () => {
	let size = parseInt(
		select(".pizzaInfo--size.selected").getAttribute("data-key")
	);

	let indentifier = pizzas[modalKey].id + "@" + size;

	let searchKey = cart.findIndex((item) => item.indentifier == indentifier);

	if (searchKey > -1) {
		cart[searchKey].qt += modalQtd;
	} else {
		cart.push({
			indentifier,
			id: pizzas[modalKey].id,
			size,
			qt: modalQtd,
		});
	}
	updateCart();
	closeModal();
	saveCart();
});
const saveCart = () => {
	localStorage.setItem("pizza_cart", JSON.stringify(cart));
};

const updateCart = () => {
	select(".menu-openner span").innerHTML = cart.length;
	if (cart.length > 0) {
		select("aside").classList.add("show");
		select(".cart").innerHTML = "";

		let subtotal = 0;
		let desconto = 0;
		let total = 0;

		cart.forEach((item, index) => {
			let pizzaItem = pizzas.find((item) => {
				return item.id == cart[index].id;
			});

			//CALCULING SUBTOTAL
			subtotal += pizzaItem.price[item.size] * item.qt;

			let cartItem = select(".models .cart--item").cloneNode(true);
			pizzaSize = { 0: "P", 1: "M", 2: "G" };

			cartItem.querySelector("img").src = pizzaItem.img;
			cartItem.querySelector(".cart--item-nome").innerHTML = `${
				pizzaItem.name
			} (${pizzaSize[item.size]})`;
			cartItem.querySelector(".cart--item--qt").innerHTML = item.qt;
			cartItem
				.querySelector(".cart--item-qtmenos")
				.addEventListener("click", () => {
					if (item.qt > 1) {
						item.qt--;
					} else {
						cart.splice(index, 1);
					}
					updateCart();
					saveCart();
				});
			cartItem
				.querySelector(".cart--item-qtmais")
				.addEventListener("click", () => {
					item.qt++;
					updateCart();
					saveCart();
				});

			select(".cart").append(cartItem);
		});

		desconto = (subtotal * 0.1).toFixed(2);
		total = (subtotal - desconto).toFixed(2);

		//SHOWING TOTALS
		select(".subtotal span:last-child").innerHTML = "R$ " + subtotal.toFixed(2);
		select(".desconto span:last-child").innerHTML = "R$ " + desconto;
		select(".total span:last-child").innerHTML = "R$ " + total;
	} else {
		select("aside").classList.remove("show");
		select("aside").style.left = "100vw";
	}
};

select(".menu-openner").addEventListener("click", () => {
	if (cart.length > 0) {
		select("aside").style.left = 0;
	}
});
select(".menu-closer").addEventListener("click", () => {
	select("aside").style.left = "100vw";
});
select(".cart--finalizar").addEventListener("click", () => {
	cart = [];
	updateCart();
	saveCart();
	select(".success.pizzaWindowArea").style.opacity = 0;
	select(".success.pizzaWindowArea").style.display = "flex";
	setTimeout(() => {
		select(".success.pizzaWindowArea").style.opacity = 1;
	}, 200);
	select(".success.pizzaWindowArea").style.display = "flex";

	setTimeout(() => {
		select(".success.pizzaWindowArea").style.opacity = 0;
		setTimeout(() => {
			select(".success.pizzaWindowArea").style.display = "none";
		}, 200);
	}, 5000);
});