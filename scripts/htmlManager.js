class HTMLManager {

  constructor(gage, startWindow, resultWindow, timeOutWindow, gameEndWindow, gage_duration, window_duration) {

    this.gage = gage;
    this.startWindow = startWindow;
    this.resultWindow = resultWindow;
    this.timeOutWindow = timeOutWindow;
    this.gameEndWindow = gameEndWindow;
    this.gage_duration = gage_duration;
    this.window_duration = window_duration;

    this.popup_keyframe = [
      { opacity: '0'},
      { opacity: '1'}
    ];

    // this.popup_keyframe_bounce = [
    //   { transform: 'scale(0)' },
    //   { transform: 'scale(1.1)', offset: 0.8},
    //   { transform: 'scale(1)' }
    // ];

    this.gage_keyframe = [
      { transform: 'translateX(-100%)'},
      { transform: 'translateX(0)'}
    ];
  
  }

  initWindows() {

    this.startWindow.style.display = "block";

    this.resultWindow.style.display = "none";
    this.timeOutWindow.style.display = "none";
    this.gameEndWindow.style.display = "none";

    this.stopGaging();

    this.popupStart();

  }

  changeSpeed(gage_duration, window_duration) {
    this.gage_duration = gage_duration;
    if(window_duration !== null) this.window_duration = window_duration;
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

  stopAnimation(doc, mode="cancel") {
    if(this.isAnimationing(doc)) {
      doc.getAnimations().forEach(anim => anim[mode]());
      return true;
    }
    return false;
  }

  startGaging() {
    return new Promise((resolve, reject) => {
      this.stopGaging();

      const animation = this.gage.animate(
        this.gage_keyframe,
        {duration: this.gage_duration}
      );

      animation.onfinish = () => resolve("max gage");
      animation.oncancel = () => reject("canceled gage");

    })
  }

  stopGaging(mode="cancel") {
    return this.stopAnimation(this.gage, mode);
  }

  popupMessage(message_box, duration, direction, ...messages) {
    return new Promise((resolve, reject) => {

      this.stopAnimation(message_box);

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
    return this.appearMessage(this.resultWindow, this.window_duration, ...messages);
  }

  popupTimeOut() {
    return this.appearMessage(this.timeOutWindow, this.window_duration);
  }

  popupGameEnd(score) {
    return this.appearMessage(this.gameEndWindow, this.window_duration, "게임 끝!","","", `점수는 ${score}점!`);
  }

  popdownStart() {
    return this.disappearMessage(this.startWindow, this.window_duration);
  }

  popdownResult() {
    return this.disappearMessage(this.resultWindow, this.window_duration);
  }

  popdownTimeOut() {
    return this.disappearMessage(this.timeOutWindow, this.window_duration);
  }

  popdownGameEnd() {
    return this.disappearMessage(this.gameEndWindow, this.window_duration);
  }

  returnClickResult(button) {
    if(this.stopGaging("pause"))
      return (button.id.startsWith("correct"));
    return null;
  }
}
