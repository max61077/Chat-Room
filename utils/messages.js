const moment = require('moment');
timeZoneOffSet = new Date().getTimezoneOffset()

function formatMessage(username, text){
    return {
        username,
        text,
        time: moment().utcOffset(-timeZoneOffSet).format('h:mm a')
    }
}

module.exports = formatMessage;