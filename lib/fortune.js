const fortunes = [
  'Something is wrong and I can feel it',
  'Rivers need springs',
  'Whenever possible, keep it simple'
];

exports.getFortunes = () => {
  return fortunes[Math.floor(Math.random() * fortunes.length)];
}
