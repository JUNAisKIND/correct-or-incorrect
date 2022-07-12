
const $ = selecter => document.querySelector(selecter);
function makeAnswerBox(quiz, index, ...options) {

  return `
<div class="quiz-box" id="quiz_box">
  다음중 틀린 표기는?
</div>
<div class="answer-box answer-box-row" id="answer_box">
  <ol class="answers">
    ${
      options.map((value, idx) => 
      `<li class="answer" id="${index === idx ? 'correct' : 'incorrect'}_${idx}">${value}</li>`
    ).join("")}
  </ol>
</div>
  `
}

$("#quiz_box_section").innerHTML = makeAnswerBox(
  "문제",
  0,
  "1",
  "2",
  "3",
  "4",
  "5"
)


const isAnimationing = target => target.getAnimations().length != 0;

const startGaging = (target, duration) => new Promise((resolve, reject) => {
  if(isAnimationing(target)) {
    reject("animation is lodding");
    return;
  }
  const animation = target.animate(
    [
      { transform: 'translateX(-100%)'},
      { transform: 'translateX(0)'}
    ], {duration: duration});
  animation.onfinish = () => resolve("finished animation");
  animation.oncancel = () => resolve("canceled animation");

})

function popupMessage(target, duration, ...messages) {
  return new Promise((resolve, reject) => {

    if(isAnimationing(target)) {
      target.getAnimations().forEach((anim) => anim.cancel())
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
      resolve("finished animation")
      if(messages.length === 0) target.style.display = "none";
    };
    animation.oncancel = () => resolve("canceled animation")});

}
const popup = $("#popup");
function onClickButton(button, target, right_answer) {
  if(isAnimationing(gage)) {
    target.getAnimations().forEach(anim => anim.cancel())
    if(button.id.startsWith("correct"))
      popupMessage(popup, 300, "정답입니다!")
    else
      popupMessage(popup, 300, "오답입니다", `정담은 ${$(".answer[id^='correct']").innerHTML} 입니다.`)
  }
  return false;
}

const gage = $(".gage");
const answers = document.querySelectorAll(".answer");
answers.forEach(
  ele => ele.addEventListener("click", event => {
    if(isAnimationing(gage)) {
      onClickButton(event.target, gage)
    }
}))

function cooldown() {
  startGaging(gage, 2000).then(
    resolve => console.log(resolve)
  ).catch(
    reject => console.log(reject)
  )
}

$("#start_button").addEventListener("click", cooldown)

document.querySelector("#next_button").addEventListener("click", () => {
  popupMessage(popup, 300).then((resolve) => 
    console.log("next quiz")
  )
})

cooldown()