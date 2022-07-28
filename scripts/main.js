
const $ = selecter => document.querySelector(selecter);

fetch('https://jaknndiius.github.io/correct-or-incorrect/sources.json')
  .then(Response => Response.text())
  .then(text => onLoad(JSON.parse(text)));

let init_list;
let current_game;

function onLoad(questions) {

  init_list = questions;

  initGame();
}

function initGame() {

  questions = [...init_list];

  const row = questions[0].questions.map(value => [0, value])
  const column = questions[1].questions.map(value => [1, value])
  const new_list = row.concat(column)

  current_game = new Game(
    $("#quiz_box_section"),
    new_list,
    new HTMLManager(
      $("#gage"),
      $("#popup_start"),
      $("#popup"),
      $("#popup_finish"),
      $("#popup_result")
    )
  )
}

class Game {

  constructor(quizBox, quiz_list, htmlManager) {
    this.score = 0;

    this.quizBox = quizBox;
    this.quiz_count = 0;
    this.quiz_list = quiz_list;
    this.current_quiz;
    this.max_quiz_count = quiz_list.length;
    
    this.htmlManager = htmlManager;

    this.init();
  }

  init() {

    $("#next_button").addEventListener("click", () => {
      this.htmlManager.popdownResult().then(
        resolve => this.nextQuiz()
      ).catch(()=>{});
    });
    
    $("#start_button").addEventListener("click", () => {
      this.htmlManager.popdownStart().then(
        resolve => this.nextQuiz()
      ).catch(()=>{});
    })
    
    $("#init_button_timeout").addEventListener("click", () => {
      this.htmlManager.popdownTimeOut().then(
        resolve => initGame()
      ).catch(()=>{});
    })
    $("#init_button_gameend").addEventListener("click", () => {
      this.htmlManager.popdownGameEnd().then(
        resolve => initGame()
      ).catch(()=>{});
    })

    this.htmlManager.initWindows();

    this.quizBox.innerHTML = "";

  }

  //리스트 길이 내 무작위 정수 반환
  randomIndex(list) { return Math.trunc(Math.random() *list.length); }
  //리스트 중 무작위 반환
  randomItem(list) { return list[randomIndex(list)]; }

  shuffle(list) {
    let new_list = [];
    list = [...list];
    while (list.length > 0) {
      new_list.push(
        list.splice(this.randomIndex(list), 1)[0]
      )
    }
    return new_list;
  }

  next() { //this.quiz_list 중 무작위 반환하고 삭제
    if(this.quiz_list.length <= 0) return null;

    const idx = this.randomIndex(this.quiz_list);
    
    this.quiz_count++;
    this.current_quiz = this.quiz_list.splice(idx, 1)[0];
    return this.current_quiz;
  }

  Correct() {
    this.score += 1;
    this.htmlManager.popupResult("정답입니다.")
  }

  Incorrect() {
    this.htmlManager.popupResult("오답입니다.","<br>", "정답은", this.current_quiz[1][0], "입니다.")
  }

  nextQuiz() {
    const question = this.next();

    this.htmlManager.stopGaging();

    if(question === null) {
      this.htmlManager.popupGameEnd(this.score);
      return;
    }

    const right_answer = question[1][0];

    const shuffled_list = this.shuffle(question[1]);
    const right_index = shuffled_list.indexOf(right_answer);


    this.quizBox.innerHTML = this.htmlManager.makeAnswerBox(
      question[0],
      right_index,
      shuffled_list,
      this.quiz_count,
      this.max_quiz_count
    );

    this.quizBox.querySelectorAll(".answer").forEach(element => {
      element.addEventListener("click", event => {
        const click_result = this.htmlManager.returnClickResult(event.target);
        if(click_result !== null) {
          if(click_result) {
            this.Correct()
          } else {
            this.Incorrect()
          }
        }
      })
    });

    this.htmlManager.startGaging(10000).then(
      success => this.htmlManager.popupTimeOut()
    ).catch(() => {})
  }


}