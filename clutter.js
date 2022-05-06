const day = ()  => {
  const today =  new Date();
  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }
  return today.toLocaleDateString('en-US', options);
}

module.exports = {day};

// Add multiple things
// module.exports = {item1, item2}
