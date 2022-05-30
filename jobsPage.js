const clearAction = document.getElementById('clear');
const filters = document.querySelector('.filters');
const colorMode = document.getElementById('colorMode');
const filter = document.querySelector('.filterComponent');
const navBar = document.getElementsByTagName('nav')[0];

let filteredJobPosts = allJobPosts = null;
let filterTags = new Set();
let lightModeEnabled = true;

clearAction.addEventListener('click', () => {
    filters.innerHTML = '';
    filterTags = new Set();
    filteredJobPosts = allJobPosts;
    filter.style.visibility = 'hidden';
    loadContent();
});

colorMode.addEventListener('click', toggleTheme);
window.addEventListener('load', () => {
    fetch('./data.json').then(reponse => reponse.json()).then(jsonData => {
        const jobData = [...Object.entries(jsonData)];
        filteredJobPosts = allJobPosts = jobData;
        loadContent();
    });
});

const createJobPost = (job) => {
    return ` 
        <div class="jobPost">
            <div class="companyImage">
                <img src="${job.logo}" alt="Company image">
            </div>
            <div class="jobInformation">
                <div class="companyName">
                    <span class="name">${job.company}</span>
                </div>
                <a href="#" class="jobTitle"><p>${job.position}</p></a>
                <span class="info" class="postDate">${job.postedAt}</span> <span class="dot">•</span> 
                <span class="info" class="jobType">${job.contract}</span> <span class="dot">•</span>
                <span class="info" class="location">${job.location}</span>
            </div>
            <div class="separator"></div>
            <div class="tags">
            </div>
        </div>
    `;
};

const createFilterTag = (tagName) => {
    return `
        <div>
            <span>${tagName}</span>
            <button class="removeFilter">X</button>
        </div>
    `;
};

document.body.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('filterTag')) {
        modifyFilters(target, false);
    }
    else if (target.classList.contains('removeFilter')) {
        modifyFilters(target, true);
    }
});

function toggleTheme(pageUpdate = null) {
    const jobPosts = document.querySelectorAll('.jobPost');
    const jobTitles = document.querySelectorAll('.jobTitle'); 
    const navList = [...navBar.getElementsByTagName('a')];
    const navButtons = [...document.querySelectorAll('.navBarStyle')];

    if ((lightModeEnabled && pageUpdate != null) 
    || (!lightModeEnabled && pageUpdate == null)) {
        enableDarkMode(jobPosts, jobTitles, navList, navButtons);
    }
    else {
        enableLightMode(jobPosts, jobTitles, navList, navButtons);
    }
}

function enableDarkMode(jobPosts, jobTitles, navList, navButtons) {
    document.body.style.backgroundColor = 'rgb(22, 22, 22)';
    navButtons.forEach(navButton => navButton.style.backgroundColor = 'white');
    jobPosts.forEach(jobPost => jobPost.classList.add('darkJobPost'));
    jobTitles.forEach(jobTitle => jobTitle.classList.add('darkModeText'));
    navList.forEach(navItem => navItem.classList.add('navListDark'));
    filter.classList.add('filterComponentDark');
    navBar.classList.add('navBarDark');
    lightModeEnabled = false;
    changeSearchResult(lightModeEnabled);
}

function enableLightMode(jobPosts, jobTitles, navList, navButtons) {
    document.body.style.backgroundColor = 'hsl(198, 70%, 94%)';
    navButtons.forEach(navButton => navButton.style.backgroundColor = 'black');
    jobPosts.forEach(jobPost => jobPost.classList.remove('darkJobPost'));
    jobTitles.forEach(jobTitle => jobTitle.classList.remove('darkModeText'));
    navList.forEach(navItem => navItem.classList.remove('navListDark'));
    filter.classList.remove('filterComponentDark');
    navBar.classList.remove('navBarDark');
    lightModeEnabled = true;
    changeSearchResult(lightModeEnabled);
}

const changeSearchResult = (lightModeEnabled) => {
    const searchResults = document.getElementById('searchResults');
    if (searchResults === null) {
        return;
    }
    
    if (lightModeEnabled) searchResults.style.color = '';
    else searchResults.style.color = 'rgb(21, 163, 245)';
};

function loadContent() {
    const main = document.querySelector('.jobs');
    const result = document.getElementById('searchResults');
    main.innerHTML = '';

    for (let job of filteredJobPosts) {
        const details = job[1];
        main.innerHTML += createJobPost(details);
        addTagButtons(details);
    }

    if (filterTags.size > 0) {
        const jobs = document.querySelector('.jobs');
        const numJobs = jobs.children.length;
        const resultText = `${numJobs} result${(numJobs !== 1) ? 's' : ''} found`;

        if (result === null) {
            const numResults = document.createElement('h1');
            numResults.id = 'searchResults';
            numResults.textContent = resultText;
            jobs.before(numResults);
        }
        else {
            result.textContent = resultText;
        }
    }
    else if (result !== null) {
        document.body.removeChild(result);
    }

    toggleTheme();
}

const addTitleButtons = (details, companyName, jobPost) => {
    if (details.new) {
        const newBtn = document.createElement('button');
        newBtn.textContent = 'NEW!';
        newBtn.className = 'new';
        companyName.appendChild(newBtn);
    }

    if (details.featured) {
        const featureBtn = document.createElement('button');
        featureBtn.textContent = 'FEATURED';
        featureBtn.className = 'featured';
        jobPost.style.borderLeft = '5px solid rgb(21, 163, 245)';
        companyName.appendChild(featureBtn);
    }
};

const filterContent = () => {
    filteredJobPosts = allJobPosts.filter(jobPost => {
        let matches = 0;
        if (filterTags.has(jobPost[1].role)) matches++;
        if (filterTags.has(jobPost[1].level)) matches++;

        jobPost[1].languages.forEach(language => {
            if (filterTags.has(language)) {
                matches++;
            }
        });

        jobPost[1].tools.forEach(tool => {
            if (filterTags.has(tool)) {
                matches++;
            }
        });

        return matches === filterTags.size;
    });
};

function modifyFilters(target, remove) {
    if (!remove && filterTags.has(target.textContent) === false) {
        filter.style.visibility = 'visible';
        filters.innerHTML += createFilterTag(target.textContent);
        filterTags.add(target.textContent);
        filterContent(true)
        loadContent();
    }
    else if (remove) {
        const parent = target.parentElement;
        filterTags.delete(parent.children[0].textContent);
        filters.removeChild(target.parentElement);
        filterContent(false)
        loadContent();

        if (filterTags.size === 0) {
            filter.style.visibility = 'hidden';
        }
    }
}

function addTagButtons(details) {
    let buttons = details.languages.concat(details.tools);
    buttons.unshift(details.level);
    buttons.unshift(details.role);

    const jobPost = document.querySelector('.jobs').lastElementChild;
    const jobDesc = jobPost.querySelector('.tags');
    const companyName = jobPost.querySelector('.companyName');

    for (let i = 0; i < buttons.length; i++) {
        const type = document.createElement('button');
        type.textContent = buttons[i];
        type.className = 'filterTag';
        jobDesc.appendChild(type);
    }

    addTitleButtons(details, companyName, jobPost);
}