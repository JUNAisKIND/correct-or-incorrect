class HTMLManager {

  constructor(gage, startWindow, resultWindow, timeOutWindow, gameEndWindow) {

    this.gage = gage;
    this.startWindow = startWindow;
    this.resultWindow = resultWindow;
    this.timeOutWindow = timeOutWindow;
    this.gameEndWindow = gameEndWindow;

    this.popup_keyframe = [
      { opacity: '0'},
      { opacity: '1'}
    ];

    this.gage_keyframe = [
      { transform: 'translateX(-100%)'},
      { transform: 'translateX(0)'}
    ];
  
  }

  initWindows() {

    this.resultWindow.style.display = "none";
    this.timeOutWindow.style.display = "none";
    this.gameEndWindow.style.display = "none";

    this.popupStart();

  }

  makeAnswerBox(type, correct_index, options, quiz_count, max_quiz_count) {
    return `
    <div class="quiz-box" id="quiz_box">다음중 옳은 표기는?</div>
    <div class="answer-box answer-box-${type === 0 ? "row" : "column"}" id="answer_box">
      <ol class="answers">
        ${
          options.map((value, idx) => 
          `<li class="answer" id="${correct_index === idx ? 'correct' : 'incorrect'}_${idx}">${value}</li>`
        ).join("")}
      </ol>
    </div>
    <div class="counter" id="counter">${quiz_count}/${max_quiz_count}</div>
      `
  }

  isAnimationing(doc) {
    return doc.getAnimations().length != 0;
  }

  startGaging(duration) {
    return new Promise((resolve, reject) => {
      if(this.isAnimationing(this.gage)) {
        this.gage.getAnimations().forEach(anim => anim.cancel())
      }

      const animation = this.gage.animate(
        this.gage_keyframe,
        {duration: duration}
      );

      animation.onfinish = () => resolve("max gage");
      animation.oncancel = () => reject("canceled gage")

    })
  }

  popupMessage(message_box, duration, direction, ...messages) {
    return new Promise((resolve, reject) => {

      if(this.isAnimationing(message_box)) {
        message_box.getAnimations().forEach(anim => anim.cancel())
      }

      if(messages.length !== 0)
        message_box.querySelector("#quiz").innerHTML = messages.map(value => `<p>${value}</p>`).join("");

      message_box.style.display = "block";
      const animation = message_box.animate(
        this.popup_keyframe,
        {duration: duration, fill: 'both', direction: direction}
      );

      animation.onfinish = () => {
        if(direction == "reverse") message_box.style.display = "none";
        resolve("correct quiz")
      };
      animation.oncancel = () => reject("canceled animation")});

  }

  appearMessage(message_box, duration, ...messages) {
    return this.popupMessage(message_box, duration, "normal", ...messages);
  }

  disappearMessage(message_box, duration) {
    return this.popupMessage(message_box, duration, "reverse");
  }

  popupStart() {
    return this.appearMessage(this.startWindow, 0);
  }

  popupResult(...messages) {
    return this.appearMessage(this.resultWindow, 300, ...messages);
  }

  popupTimeOut() {
    return this.appearMessage(this.timeOutWindow, 300);
  }

  popupGameEnd(score) {
    return this.appearMessage(this.gameEndWindow, 300, "게임 끝!", "", `점수는 ${score}점!`);
  }

  popdownStart() {
    return this.disappearMessage(this.startWindow, 300);
  }

  popdownResult() {
    return this.disappearMessage(this.resultWindow, 300);
  }

  popdownTimeOut() {
    return this.disappearMessage(this.timeOutWindow, 300);
  }

  popdownGameEnd() {
    return this.disappearMessage(this.gameEndWindow, 300);
  }

  onClickButton(button) {
    if(this.isAnimationing(this.gage)) {
      this.gage.getAnimations().forEach(anim => anim.cancel());

      return (button.id.startsWith("correct"));
    }
    return null;
  }
}
