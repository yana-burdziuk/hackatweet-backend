const checkBody = (body, values) => {
    for (let value of values) {
       if(body[value])
        continue 
       else
        return false;
    }
    return true;
}


module.exports = checkBody;