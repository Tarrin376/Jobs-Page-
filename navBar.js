let navButtonCreated = false;
let navBarToggle = false;

const createNavButton = () => {
    return `
        <div class="navBarStyle"></div>
        <div class="navBarStyle"></div>
        <div class="navBarStyle"></div>
    `;
};

window.addEventListener('resize', changeNavBar);
window.addEventListener('load',changeNavBar);

function changeNavBar() {
    const width = document.body.clientWidth;
    if (width <= 900 && !navButtonCreated) {
        navBar.style.display = 'none';
        const navButton = document.createElement('div');
        navButton.innerHTML = createNavButton();
        navButton.classList.add('navButton');
        document.body.prepend(navButton);
        toggleTheme();
        navButtonCreated = true;
    }
    else if (width > 900) {
        navBar.style.display = '';
        const navButton = document.querySelector('.navButton');
        if (navButtonCreated) document.body.removeChild(navButton);
        toggleTheme();
        navButtonCreated = false;
    }
}

document.body.addEventListener('click', (e) => {
    const target = e.target;
    if (target.className === 'navButton' || target.className === 'navBarStyle') {
        if (!navBarToggle) {
            navBar.style.display = '';
            navBarToggle = true;
        }
        else {
            navBar.style.display = 'none';
            navBarToggle = false;
        } 
    }
});