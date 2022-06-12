const popUpBackground = document.querySelector('.popUpBackground');
const image1 = document.getElementById('image1');
const image2 = document.getElementById('image2');
const image3 = document.getElementById('image3');
const image4 = document.getElementById('image4');
const cartIcon = document.querySelector('.cartIcon');
const cartContainer = document.querySelector('.cart');
const addToCart = document.getElementById('addItem');
const productCount = document.getElementById('productCount');

const maximumProductAmount = 10;
let selectedImage = null;

const images = [
    [image1, 'url(images/image-product-1.jpg)'],
    [image2, 'url(images/image-product-2.jpg)'],
    [image3, 'url(images/image-product-3.jpg)'],
    [image4, 'url(images/image-product-4.jpg)']
];

const [increase, decrease] = [
    document.getElementById('increase'), 
    document.getElementById('decrease')
];

document.body.addEventListener('click', (event) => {
    openImageCarousel(event);
    closeImageCarousel(event);
    nextPreviewImage(event);
    removeFromCart(event);
    modifyCart(event);
});

window.addEventListener('resize', changeLayout);
window.addEventListener('load', () => {
    changeLayout();
    updateCartIcon();
});

cartIcon.addEventListener('click', openCartContainer);
increase.addEventListener('click', modifyProductAmount);
decrease.addEventListener('click', modifyProductAmount);
addToCart.addEventListener('click', addProductToCart);

function removeFromCart(event, modify = false) {
    if (modify || event.target.id === 'deleteProduct') {
        localStorage.removeItem(0);
        updateCartIcon();
        updateProducts();
    }
}

function modifyCart(event) {
    const id = event.target.id;
    let cartInfo = JSON.parse(localStorage.getItem(0));

    if (id !== 'addOne' && id !== 'removeOne' || cartInfo == null) {
        return;
    }

    if (id === 'addOne') modifyLocalStorage(cartInfo.Quantity + 1);
    if (id === 'removeOne') modifyLocalStorage(cartInfo.Quantity - 1);
    updateCartIcon();
    updateProducts();
}

function addProductToCart() {
    let quantity = parseInt(productCount.textContent);
    let cartInfo = JSON.parse(localStorage.getItem(0));
    productCount.textContent = 0;

    if (quantity == 0) {
        return;
    }
    
    let totalQuantity = (cartInfo) ? cartInfo.Quantity + quantity : quantity;
    modifyLocalStorage(totalQuantity)
    updateCartIcon();
    updateProducts();
}

function modifyLocalStorage(quantity) {
    if (quantity === 0) {
        removeFromCart(null, true);
        return;
    }

    localStorage.setItem(0, JSON.stringify({
        Name: 'Fall Limited Edition Sneakers',
        Cost: '125.00',
        Quantity: quantity,
        Image: './images/image-product-1.jpg'
    }));
}

function updateCartIcon() {
    const cartCapacity = document.querySelector('.cartCapacity').children[0];
    const product = localStorage.getItem(0);

    if (product == null) {
        cartCapacity.textContent = 0;
        return;
    }
    
    const quantity = JSON.parse(product).Quantity;
    cartCapacity.textContent = quantity;
}

function modifyProductAmount(event) {
    const eventRaiser = event.target;
    const content = parseInt(productCount.textContent);

    if (eventRaiser.id === 'decrease') {
        productCount.textContent = (content > 0) ? content - 1 : content;
        return;
    }

    if (content < maximumProductAmount) {
        productCount.textContent = content + 1;
    }
}

function openCartContainer() {
    if (cartContainer.classList.contains('showCart')) cartContainer.classList.remove('showCart');
    else cartContainer.classList.add('showCart');
    updateProducts();
}

function updateProducts() {
    const product = JSON.parse(localStorage.getItem(0));
    const cartContent = document.querySelector('.cartContent');

    if (product == null) {
        cartContent.innerHTML = emptyCart();
    }
    else {
        cartContent.innerHTML = fullCart(product);
    }
}

function changeLayout() {
    const screenWidth = document.body.clientWidth;
    const productImages = document.querySelector('.productImages');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    console.log(nextButton);

    if (screenWidth <= 586) {
        productImages.innerHTML = mobileImageContainer();
        prevButton.className = 'mobilePrev';
        nextButton.className = 'mobileNext';
        selectedImage = [image1, 0];
    }
    else {
        productImages.innerHTML = desktopImageContainer();
        selectedImage = null;
    }
}

function nextPreviewImage(event) {
    const eventRaiser = event.target;
    const eventID = eventRaiser.id;

    if ((eventID === 'prev' || eventID === 'prevImage') && selectedImage[1] - 1 >= 0) {
        updatePreviewImage(images[selectedImage[1] - 1][0].id);
    }
    else if ((eventID === 'next' || eventID === 'nextImage') && selectedImage[1] < images.length - 1) {
        updatePreviewImage(images[selectedImage[1] + 1][0].id);
    }
}

const getImage = (eventRaiser) => {
    const carousel = document.querySelector('.carousel');
    const previewImage = document.querySelector('.previewImage');

    if (carousel == null) {
        return null;
    }

    if (eventRaiser.className === previewImage.className) {
        carousel.children[0].classList.add('selectedImageStyle');
        return image1;
    }

    for (let image of carousel.children) {
        if (image.id === eventRaiser.id) {
            image.classList.add('selectedImageStyle');
            return image;
        }
    }
};

function openImageCarousel(event) {
    const eventRaiser = event.target;
    const image = getImage(eventRaiser);

    if (image == null) {
        return;
    }
    
    if (selectedImage == null) {
        const carousel = imageCarousel();
        popUpBackground.innerHTML += carousel;
        popUpBackground.classList.add('showPopUpBackground');
    }
    
    updatePreviewImage(image.id);
}

function updatePreviewImage(image) {
    const previewImage = document.querySelector('.previewImage');
    
    for (let i = 0; i < images.length; i++) {
        if (images[i][0].id === image) {
            previewImage.style.backgroundImage = images[i][1];
            selectedImage = [image, i];
            break;
        }
    }
}

function closeImageCarousel(event) {
    if (event.target.id === 'closePopUp') {
        popUpBackground.innerHTML = '';
        popUpBackground.classList.remove('showPopUpBackground');
        selectedImage = null;
    }
}