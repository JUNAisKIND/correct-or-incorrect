fetch('https://junaiskind.github.io/correct-or-incorrect/sources.json')
  .then(Response => Response.text())
  .then(text => onLoad(JSON.parse(text)));


const randomIndex = list => Math.trunc(Math.random() *list.length);
const randomItem = list => list[randomIndex(list)];


function* nextQuiz(questions) {

  let score = 0;

  const row = questions[0].questions.map(value => [0, value])
  const column = questions[1].questions.map(value => [1, value])
  const new_list = row.concat(column)

  while (new_list.length > 0) {

    const idx = randomIndex(new_list);
    const return_list = new_list.splice(idx, 1)[0];

    yield [return_list[0], return_list[1], new_list.length];
  }
  return score;

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
function update(questions, beInit) {

  if(beInit) quizes = nextQuiz(questions)

  const nex = quizes.next();

  if(nex.done) {
    onGameEnd(nex.value);
    return true;
  }

  const current = nex.value;

  const right = current[1][0];

  const shuffled_list = shuffle(current[1]);
  const right_index = shuffled_list.indexOf(right);

  const inner = makeAnswerBox(
    current[0],
    right_index,
    shuffled_list,
    current[2]+1
  )

  $("#quiz_box_section").innerHTML = inner

  const answers = document.querySelectorAll(".answer");
  answers.forEach(
    ele => ele.addEventListener("click", event => {
      onClickButton(event.target)
  }))

  cooldown()
}

let init;
function onLoad(questions) {
  init = questions
}

function restart() {
  update(init, true);
}

const popup_start = $("#popup_start");
$("#start_button").addEventListener("click", () => {
  popupMessage(popup_start, 300).then(update(init, true))
})