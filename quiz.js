fetch('https://junaiskind.github.io/correct-or-incorrect/sources.json')
  .then(Response => Response.text())
  .then(text => onLoad(JSON.parse(text)));


const randomIndex = list => Math.trunc(Math.random() *list.length);

function* nextQuiz(questions) {

  const row = questions[0].questions.map(value => [0, value])
  const column = questions[1].questions.map(value => [1, value])
  const new_list = row.concat(column)

  while (new_list.length > 0) {
    const idx = randomIndex(new_list);

    const return_list = new_list.splice(idx, 1);
    if(row.includes(return_list))
      yield [0, return_list];
    else
      yield [1, return_list];
  }

  return true;

}

function shuffle(list) {
  let new_list = [];
  while (list.length > 0) {
    new_list.push(
      list.splice(randomIndex(list), 1)[0]
    )
  }
  return new_list;
}

let quizes;
function update(questions) {
  if(quizes == null) quizes = nextQuiz(questions)

  const current = quizes.next()

  const right = current[1][0];

  const shuffled_list = shuffle(current[1]);
  const right_index = shuffled_list.indexOf(right);

  const inner = makeAnswerBox(
    current[0],
    right_index,
    shuffled_list
  )

  return inner;
}

let lia;
function onLoad(questions) {
  lia = questions
}