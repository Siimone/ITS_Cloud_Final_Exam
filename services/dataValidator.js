/*
    Module to check input from sensors
*/
isValidSpeed = function(speed) {
    if(speed > 60 )
        return false
    else
        return true 
}

isValidConsumption = function(consumption) {
    if(consumption > 60)
        return false
    else
        return true
}

module.exports = {
    isValidSpeed,
    isValidConsumption
}