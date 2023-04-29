//check if 2 objects are the same, returns true or false
const eqObjects = function(obj1, obj2) {
  //checking if both objects have the same amount of keys
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    } else {
  
      for (let i in obj1) {
        //if a key has an array use eqArray to compair arrays inside obj1 and obj2
        if (Array.isArray(obj1[i])) {
          if (!eqArrays(obj1[i], obj2[i])) {
            return false;
          }
        } else {
          //if key value is not an array compair the the values of each key within both objects
          if (obj1[i] !== obj2[i]) {
            return false;
          }
        }
      }
    }
    return true;
  };

module.exports = { eqObjects };
