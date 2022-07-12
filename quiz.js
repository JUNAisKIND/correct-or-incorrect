fetch('https://junaiskind.github.io/correct-or-incorrect/sources.json')
  .then(Response => Response.text())
  .then(text => onLoad(JSON.parse(text)));

function onLoad(questions) {
  questions
}