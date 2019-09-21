function sum() {
  var total = 0;
  for (argument in arguments) {
    total += arguments[argument];
  }
  return total;
}

console.log(sum(1,2,7));
console.log(sum(1,4));
console.log(sum(11));
console.log(sum(10,3,6,7,9));
