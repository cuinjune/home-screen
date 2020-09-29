// detect mobile device or not
const isMobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
const defaultNumIcons = isMobile ? 20 : 36;

function generateIcons(numIcons) {
    const iconsContainer = document.getElementById("icons-container");
    iconsContainer.innerHTML = ""; // clear icons inside
    const iconsContainerStyle = getComputedStyle(iconsContainer);
    const iconsContainerWidth = parseInt(iconsContainerStyle.width, 10);
    const iconsContainerHeight = parseInt(iconsContainerStyle.height, 10);

    // calculate getting these variables
    let numColumns = 0;
    let numRows = 0;
    let iconContainerSize = 0;
    let maxNumIcons = 0;
    while (maxNumIcons < numIcons) {
        numColumns++;
        iconContainerSize = iconsContainerWidth / numColumns;
        numRows = Math.floor(iconsContainerHeight / iconContainerSize);
        maxNumIcons = numColumns * numRows;
    }

    // settings
    const maxIconContainerSize = iconsContainerWidth / 4; // maximum icon container size
    const iconSizeAmount = 0.72; // icon size relative to icon container size
    const iconBorderRadiusAmount = 0.2; // icon border radius relative to icon size
    const iconNameFontSizeAmount = 0.15; // icon name font size relative to icon container size
    const iconNameMarginTopAmount = 0.25; // icon name top margin relative to icon name font size
    const iconNameTextMinLength = 4; // minimum length of icon name text
    const iconNameTextMaxLength = 8; // maximum length of icon name text

    // add icons to the container
    for (let i = 0; i < numIcons; i++) {

        // create icon container
        const iconContainer = document.createElement("div");
        iconContainer.className = "icon-container";
        iconContainer.id = `${iconContainer.className}${i}`;
        iconContainer.style.width = `${iconContainerSize}px`;
        iconContainer.style.height = `${iconContainerSize}px`;

        // create icon
        const icon = document.createElement("div");
        icon.className = "icon";
        icon.id = `${icon.className}${i}`;
        const maxIconSize = maxIconContainerSize * iconSizeAmount;
        const iconSize = Math.min(iconContainerSize * iconSizeAmount, maxIconSize);
        const iconBorderRadius = iconSize * iconBorderRadiusAmount;
        icon.style.width = `${iconSize}px`;
        icon.style.height = `${iconSize}px`;
        icon.style.borderRadius = `${iconBorderRadius}px`;
        icon.style.background = `linear-gradient(45deg, hsl(${(i * 25) % 360}, 100%, 50%) 0%, rgb(255, 255, 255) 100%)`;

        // create icon name
        const iconName = document.createElement("label");
        iconName.className = "icon-name";
        iconName.id = `${iconName.className}${i}`;
        const maxIconNameFontSize = maxIconContainerSize * iconNameFontSizeAmount;
        const iconNameFontSize = Math.min(iconContainerSize * iconNameFontSizeAmount, maxIconNameFontSize);
        iconName.style.fontSize = `${iconNameFontSize}px`;
        iconName.style.marginTop = `${iconNameFontSize * iconNameMarginTopAmount}px`;

        // generate icon name text
        const consonants = "bcdfghklmnprstwyz";
        const vowels = "aeiou";
        const iconNameTextLength = Math.floor(Math.random() * (iconNameTextMaxLength - iconNameTextMinLength + 1)) + iconNameTextMinLength;
        let wasConsonant = Math.random() < 0.1;
        let iconNameText = "";
        while (iconNameText.length < iconNameTextLength) {
            if (wasConsonant) {
                const index = Math.floor(Math.random() * vowels.length);
                iconNameText += vowels[index];
                wasConsonant = false;
            }
            else {
                const index = Math.floor(Math.random() * consonants.length);
                iconNameText += consonants[index];
                if ("cst".includes(consonants[index]) && Math.random() < 0.2) {
                    iconNameText += "h";
                }
                wasConsonant = true;
            }
            if (iconNameText.length == 1) {
                iconNameText = iconNameText.toUpperCase();
            }
        }
        if (iconNameText.length > iconNameTextMaxLength) {
            iconNameText = iconNameText.slice(0, iconNameTextMaxLength - iconNameText.length);
        }
        if ("fhw".includes(iconNameText[iconNameText.length - 1])) {
            iconNameText = iconNameText.slice(0, -1);
        }
        iconName.textContent = iconNameText;

        // add to parent container
        iconContainer.appendChild(icon);
        iconContainer.appendChild(iconName);
        iconsContainer.appendChild(iconContainer);
    }
}

/* utility functions */
function isInt(value) {
    var x;
    if (isNaN(value)) {
        return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

window.onload = function () {

    /* search bar listeners */
    const searchbar = document.getElementById("searchbar");
    searchbar.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            document.activeElement && document.activeElement.blur();
            let typedText = searchbar.value;
            if (isInt(typedText)) {
                const numIcons = parseInt(typedText, 10);
                generateIcons(clamp(numIcons, 1, 1000));
            }
            else {
                console.log("typedText", typedText);
            }
            searchbar.value = "";
        }
    });

    searchbar.addEventListener("change", function () {
        console.log("onSearchBarChange", searchbar.value);
    });

    /* icons container listeners */
    const iconsContainer = document.getElementById("icons-container");

    function changeIconOpacity(icon) {
        icon.style.opacity = "0.5";
    }

    function resetIconsOpacity() {
        const icons = iconsContainer.getElementsByClassName("icon");
        for (let i = 0; i < icons.length; i++) {
            icons[i].style.opacity = "1.0";
        }
    }

    iconsContainer.addEventListener("touchstart", function (e) {
        if (e.target.className == "icon") {
            changeIconOpacity(e.target);
        }
    });

    iconsContainer.addEventListener("touchmove", function (e) {
    });

    iconsContainer.addEventListener("touchcancel", function (e) {
    });

    iconsContainer.addEventListener("touchend", function (e) {
        resetIconsOpacity();
    });

    iconsContainer.addEventListener("mousedown", function (e) {
        if (e.target.className == "icon") {
            changeIconOpacity(e.target);
        }
    });

    iconsContainer.addEventListener("mousemove", function (e) {
    });

    iconsContainer.addEventListener("mouseup", function (e) {
        resetIconsOpacity();
    });

    /* update time in the status bar */
    const time = document.getElementById("time");
    function updateTime() {
        const date = new Date();
        const hours = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12;
        const minutes = ("0" + date.getMinutes()).slice(-2);
        const period = date.getHours() < 12 ? "AM" : "PM";
        time.textContent = `${hours}:${minutes} ${period}`;
    }
    updateTime();
    setInterval(updateTime, 1000);

    /* sometimes it doesn't work properly when refreshed if not delayed */
    setTimeout(function () {
        /* prevent keyboard shrinking the viewport on android */
        const viewheight = $(window).height();
        const viewwidth = $(window).width();
        const viewport = document.querySelector("meta[name=viewport]");
        viewport.setAttribute("content", `height=${viewheight}px, width=${viewwidth}px, initial-scale=1.0`);
        generateIcons(defaultNumIcons);
    }, 500);
}