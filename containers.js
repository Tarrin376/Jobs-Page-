const imageCarousel = () => {
    return `
        <div class="popUpCarousel">
            <img id="closePopUp" src="./images/icon-close.svg" alt="Close navbar">
            ${mobileImageContainer()}
            <div class="carousel popUp">
                <div id="image1"></div>
                <div id="image2"></div>
                <div id="image3"></div>
                <div id="image4"></div>
            </div>
        </div>
    `;
};

const mobileImageContainer = () => {
    return `
        <div class="previewImage">
            <button id="prev">
                <img id="prevImage" src="./images/icon-previous.svg" alt="Previous image">
            </button>
            <button id="next">
                <img id="nextImage" src="./images/icon-next.svg" alt="Next image">
            </button>
        </div>
    `;
};

const desktopImageContainer = () => {
    return `
        <div class="previewImage"></div>
        <div class="carousel">
            <div id="image1"></div>
            <div id="image2"></div>
            <div id="image3"></div>
            <div id="image4"></div>
        </div>
    `;
};

const fullCart = (product) => {
    return `
        <div class="cartProduct">
            <img id="productThumbnail" src="${product.Image}" alt="Product image">
            <div class="productInfo">
                <p>${product.Name}</p>
                <p>
                    <span>$${product.Cost} </span><span>x ${product.Quantity} </span>
                    <span class="total">$${(product.Cost * product.Quantity).toFixed(2)}</span>
                </p>
            </div>
            <img id="deleteProduct" src="./images/icon-delete.svg" alt="Delete product">
            <span id="addOne"> + </span><span id="removeOne"> - </span>
        </div>
        <button id="checkout">Checkout</button>
    `;
};

const emptyCart = () => {
    return `
        <p id="emptyCart">Your cart is empty</p>
    `;
};