fetch('https://junaiskind.github.io/correct-or-incorrect/sources.json')
  .then(Response => Response.text())
  .then(text => onLoad(JSON.parse(text)));


const randomIndex = list => Math.trunc(Math.random() *list.length);

function* nextQuiz(questions) {

  while (questions.length > 0) {
    const idx = randomIndex(questions);
    yield questions.splice(idx, 1);
  }

  return false;

}

let lia;
function onLoad(questions) {
  lia = questions;
  [].slice()


}