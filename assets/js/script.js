
let cart = [];
let modalQt = 1;
let modalKey = 0;
let categ = '';
let aliveJson;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

cat(categ);

localStorage.getItem("alive_cart")
    ? (cart = JSON.parse(localStorage.getItem("alive_cart")))
    : (cart = []);

function cat(cat) {
    categ = cat;

    if (categ) {
        $(".alive-area").load(location.href + " .alive-area>*", "");

        aliveApi(categ).then(data => {
            aliveJson = data;
            data.list.map((item, index) => {

                let aliveItem = c('.models .alive-item').cloneNode(true);

                aliveItem.setAttribute('data-key', index);
                aliveItem.querySelector('.alive-item--img img').src = `assets/images/${item.img}`;
                aliveItem.querySelector('.alive-item--price').innerHTML = `${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                aliveItem.querySelector('.alive-item--name').innerHTML = item.name;
                aliveItem.querySelector('.alive-item--desc').innerHTML = item.description;

                aliveItem.querySelector('a').addEventListener('click', (e) => {
                    e.preventDefault();
                    let key = e.target.closest('.alive-item').getAttribute('data-key');
                    modalQt = 1;
                    modalKey = key;

                    c('.aliveBig img').src = `assets/images/${aliveJson.list[key].img}`;
                    c('.aliveInfo h1').innerHTML = aliveJson.list[key].name;
                    c('.aliveInfo--desc').innerHTML = aliveJson.list[key].description;
                    c('.aliveInfo--actualPrice').innerHTML = `${aliveJson.list[key].price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                    c('.aliveInfo--size.selected').classList.remove('selected');
                    cs('.aliveInfo--size').forEach((size, sizeIndex) => {
                        if (sizeIndex == 2) {
                            size.classList.add('selected');
                        }
                        size.querySelector('span').innerHTML = aliveJson.list[key].sizes[sizeIndex];
                    });

                    cs('.aliveInfo--size').forEach((price, priceItem) => {
                        price.addEventListener('click', () => {
                            c('.aliveInfo--actualPrice').innerHTML = `${aliveJson.list[key].price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                        })
                    })

                    c('.aliveInfo--qt').innerHTML = modalQt;

                    c('.aliveWindowArea').style.opacity = 0;
                    c('.aliveWindowArea').style.display = 'flex';
                    setTimeout(() => { c('.aliveWindowArea').style.opacity = 1; }, 200);
                })

                c('.alive-area').append(aliveItem);
            });
        });

    } else {
        aliveApi(categ).then(data => {
            aliveJson = data;
            data.list.map((item, index) => {
                let aliveItem = c('.models .alive-item').cloneNode(true);

                aliveItem.setAttribute('data-key', index);
                aliveItem.querySelector('.alive-item--img img').src = `assets/images/${item.img}`;
                aliveItem.querySelector('.alive-item--price').innerHTML = `${item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                aliveItem.querySelector('.alive-item--name').innerHTML = item.name;
                aliveItem.querySelector('.alive-item--desc').innerHTML = item.description;

                aliveItem.querySelector('a').addEventListener('click', (e) => {
                    e.preventDefault();
                    let key = e.target.closest('.alive-item').getAttribute('data-key');
                    modalQt = 1;
                    modalKey = key;

                    c('.aliveBig img').src = `assets/images/${aliveJson.list[key].img}`;
                    c('.aliveInfo h1').innerHTML = aliveJson.list[key].name;
                    c('.aliveInfo--desc').innerHTML = aliveJson.list[key].description;
                    c('.aliveInfo--actualPrice').innerHTML = `${aliveJson.list[key].price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                    c('.aliveInfo--size.selected').classList.remove('selected');
                    cs('.aliveInfo--size').forEach((size, sizeIndex) => {
                        if (sizeIndex == 2) {
                            size.classList.add('selected');
                        }
                        size.querySelector('span').innerHTML = aliveJson.list[key].sizes[sizeIndex];
                    });

                    cs('.aliveInfo--size').forEach((price, priceItem) => {
                        price.addEventListener('click', () => {
                            c('.aliveInfo--actualPrice').innerHTML = `${aliveJson.list[modalKey].price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                        })
                    })

                    c('.aliveInfo--qt').innerHTML = modalQt;

                    c('.aliveWindowArea').style.opacity = 0;
                    c('.aliveWindowArea').style.display = 'flex';
                    setTimeout(() => { c('.aliveWindowArea').style.opacity = 1; }, 200);
                })
                c('.alive-area').append(aliveItem);
            });
        });
    }
}

function closeModal() {
    c('.aliveWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.aliveWindowArea').style.display = 'none';
    }, 500)
}

cs('.aliveInfo--cancelButton, .aliveInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
})

c('.aliveInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.aliveInfo--qt').innerHTML = modalQt;
    }
});
c('.aliveInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.aliveInfo--qt').innerHTML = modalQt;
});
cs('.aliveInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.aliveInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

const saveCart = () => {
    localStorage.setItem("alive_cart", JSON.stringify(cart));
};


c('.aliveInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.aliveInfo--size.selected').getAttribute('data-key'));
    let identifier = aliveJson.list[modalKey].ident + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: aliveJson.list[modalKey].ident,
            size,
            qt: modalQt,
            price: aliveJson.list[modalKey].price,
            img: aliveJson.list[modalKey].img,
            name: aliveJson.list[modalKey].name
        });
    }
    updateCart();
    closeModal();
    saveCart();
});


c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = 0;
    }
});

c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw'
});


function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        cart.forEach((item, index) => {
            subtotal += item.price * item.qt;            

            let cartItem = c('.models .cart--item').cloneNode(true);
            let aliveSizeName = { 0: "P", 1: "M", 2: "G" };
           
            let aliveName = `<strong>${item.name}</strong> (TAM: ${aliveSizeName[item.size]})`;

            cartItem.querySelector('img').src = `assets/images/${item.img}`
            cartItem.querySelector('.cart--item-nome').innerHTML = aliveName;
            cartItem.querySelector('.cart--item--qt').innerHTML = item.qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (item.qt > 1) {
                    item.qt--;
                } else {
                    cart.splice(index, 1);
                }
                updateCart();
                saveCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                item.qt++
                updateCart();
                saveCart();
            });

            c('.cart').append(cartItem);
        });

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        c('.desconto span:last-child').innerHTML = `${desconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
        c('.total span:last-child').innerHTML = `${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
};

