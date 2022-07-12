
const $ = selecter => document.querySelector(selecter);
function makeAnswerBox(type, index, options, number) {

  return `
<div class="quiz-box" id="quiz_box">
  다음중 옳은 표기는?
</div>
<div class="answer-box answer-box-${type === 0 ? "row" : "column"}" id="answer_box">
  <ol class="answers">
    ${
      options.map((value, idx) => 
      `<li class="answer" id="${index === idx ? 'correct' : 'incorrect'}_${idx}">${value}</li>`
    ).join("")}
  </ol>
</div>
<div class="counter" id="counter">
  ${number}/30
</div>
  `
}

const isAnimationing = target => target.getAnimations().length != 0;

const startGaging = (target, duration) => new Promise((resolve, reject) => {
  if(isAnimationing(target)) {
    target.getAnimations().forEach(anim => anim.cancel())
  }
  const animation = target.animate(
    [
      { transform: 'translateX(-100%)'},
      { transform: 'translateX(0)'}
    ], {duration: duration});
  animation.onfinish = () => resolve("finished animation");
  animation.oncancel = () => reject("canceled animation");

})

function popupMessage(target, duration, ...messages) {
  return new Promise((resolve, reject) => {

    if(isAnimationing(target)) {
      target.getAnimations().forEach(anim => anim.cancel())
    }

    if(messages.length > 0)
      target.querySelector("#quiz").innerHTML = 
        messages.map((value) =>
          `<p>${value}</p>`
        ).join("");

    target.style.display = "block";
    const animation = target.animate(
      [
        { opacity: '0'},
        { opacity: '1'}
      ], {duration: duration, fill: 'both', direction: (messages.length > 0) ? "normal" : "reverse"});

    animation.onfinish = () => {
      if(messages.length === 0) target.style.display = "none";
      resolve()
    };
    animation.oncancel = () => reject("canceled animation")});

}
const popup = $("#popup");
const gage = $(".gage");
function onClickButton(button) {
  if(isAnimationing(gage)) {
    gage.getAnimations().forEach(anim => anim.cancel())
    if(button.id.startsWith("correct"))
      popupMessage(popup, 300, "정답입니다!")
    else
      popupMessage(popup, 300, "오답입니다", `정답은 ${$(".answer[id^='correct']").innerHTML} 입니다.`)
  }
  return false;
}


const popup_finish = $("#popup_finish");
function cooldown() {
  startGaging(gage, 10000).then(
    resolve => {
      popupMessage(popup_finish, 300, "타임 아웃!")
    }
  ).catch(() => {})
}

const popup_result = $("#popup_result");
function onGameEnd(score) {
  popupMessage(popup_result, 300, `게임 끝! ${score}점`)
}

document.querySelector("#next_button").addEventListener("click", () => {
  popupMessage(popup, 300).then(update())
})

document.querySelector("#init_button").addEventListener("click", () => {
  popupMessage(popup_finish, 300).then(restart())
})