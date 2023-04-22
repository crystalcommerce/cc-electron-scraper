function toUrl(str) {
    return Array.from(str.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, " ").split(" ")).reduce((a, b) => {
        if(b.trim() !== "") {
            a.push(b);
        }
        return a;
    }, []).join("-");
}

function toCapitalize(str) {
    return str.split("").map((char, index) =>  index === 0 ? char.toUpperCase() : char.toLowerCase()).join("").trim();
}

function toCapitalizeAll(str)   {
    return str.split(" ").map(item => toCapitalize(item)).join(" ");
}

function toNormalString(str, previousFormat = "camel-case")    {
    if(previousFormat === "camel-case") {
        str = str.replace(/([A-Z])/g, (char) => ` ${char.toUpperCase()}`);
    } else if(previousFormat === "underscored") {
        str = str.split("_").map(item => toCapitalize(item)).join(" ");
    } else  {
        str = str.split("-").map(item => toCapitalize(item)).join(" ");
    }
    return toCapitalize(str);
}

function getInitials(str)  {
    return typeof str === "string" && str.length ? toNormalString(str.trim()).split(" ").map(word => word.charAt(0).toUpperCase()).join("") : null;
}

function toCamelCase(str, url=false, initialCap=false)  {
    let separator = url ? "-" : " ";
    return str.toLowerCase().split(`${separator}`).map((item, index) => index === 0 && !initialCap ? item : toCapitalize(item)).join("");
}

module.exports = {
    toUrl,
    toCapitalize,
    toCapitalizeAll,
    toNormalString,
    getInitials,
    toCamelCase
}