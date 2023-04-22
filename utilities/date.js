function formattedDate(dateObject)    {
    let dt = dateObject ? dateObject : new Date(),
        year = dt.getFullYear(),
        date = function(){
            let num = dt.getDate();
            return num < 10 ? `0${num}` : num;
        }();
        month = function(){
            let num = dt.getMonth();
            return num < 10 ? `0${num + 1}` : num + 1;
        }();
    return `${month}-${date}-${year}`;
}

function dateTimeObject(dateInSeconds = null) {
    let dateTime = dateInSeconds && typeof dateInSeconds === "number" ? new Date(dateInSeconds) : new Date(),
        months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        month = months[dateTime.getMonth()],
        date = dateTime.getDate(),
        year = dateTime.getFullYear(),
        day = days[dateTime.getDay()],
        getCurrentTime = function(byTwelve = true)    {
            let hours = function(){
                    if(byTwelve)    {
                        let twelveHourFormat = dateTime.getHours() > 12 ? dateTime.getHours() % 12 : dateTime.getHours();
                        return twelveHourFormat < 10 ? `0${twelveHourFormat}` : twelveHourFormat;
                    } else  {
                        return dateTime.getHours();
                    }
                }(),
                minutes = dateTime.getMinutes() < 10 ? `0${dateTime.getMinutes()}` : dateTime.getMinutes(),
                seconds = dateTime.getSeconds() < 10 ? `0${dateTime.getSeconds()}` : dateTime.getSeconds(),
                halfOfDay = dateTime.getHours() > 12 ? "PM" : "AM";
            
            return byTwelve ? `${hours}:${minutes}:${seconds} ${halfOfDay}` : `${hours}:${minutes}:${seconds}`;
        },
        time = getCurrentTime(),
        getCurrentDate = function(words = true, separator="/"){

            let dateInWords = `${month} ${date}, ${year}`,
                dateInNumbers = `${(dateTime.getMonth() + 1) < 10 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1}${separator}${date < 10 ? `0${date}` : date}${separator}${year}`

            return words ? dateInWords : dateInNumbers;
        },
        fullDateTime = `${getCurrentDate()} - ${day} - ${getCurrentTime()}`;

    return {
        day, 
        month,
        year,
        date,
        time,
        getCurrentTime,
        getCurrentDate,
        fullDateTime
    }
}

function getTimeElapsed(time1, time2)    {

    let diff = Math.abs(time2 - time1),
        milliseconds = Number((Math.round((diff % 1000)) / 1000).toFixed(2)),
        seconds = Math.floor((diff / 1000) % 60),
        minutes = Math.floor(((diff / 1000) / 60) % 60),
        hours = Math.floor((diff / 1000) / 60 / 60),
        secondsUnit = seconds > 1 ? "seconds" : "second",
        minutesUnit = minutes > 1 ? "minutes" : "minute",
        hoursUnit = hours > 1 ? "hours" : "hour";


    let elapsedTime = function(){

            let momentsPassed = "";

            if(hours >= 1)  {
                momentsPassed = `${hours} ${hoursUnit} ${hours < 1 ? "has" : "have"} passed.`;
            } if(hours < 1 && minutes >= 1) {
                momentsPassed = `${minutes} ${minutesUnit} ${minutes < 1 ? "has" : "have"} passed.`;
            } if(hours < 1 && minutes < 1)  {
                momentsPassed = `${seconds + milliseconds} ${secondsUnit} ${(seconds + milliseconds) < 1 ? "has" : "have"} passed.`
            }

            return {
                timeElapsed : `${hours} ${hoursUnit}, ${minutes} ${minutesUnit}, and ${seconds + milliseconds} ${secondsUnit}`,
                momentsPassed,
            }


        }();

    return elapsedTime;

}

module.exports = {
    formattedDate,
    dateTimeObject,
    getTimeElapsed,
}