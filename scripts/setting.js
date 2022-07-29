const speed_range = document.querySelector("#speed_range");
const speed_range_label = document.querySelector("#speed_range + label");
speed_range.addEventListener("change", () => {
  speed_range_label.textContent = speed_range.value + "초";
})
const quiz_range = document.querySelector("#quiz_range");
const quiz_range_label = document.querySelector("#quiz_range + label");
quiz_range.addEventListener("change", () => {
  quiz_range_label.textContent = quiz_range.value + "개";
})

const setting_box = document.querySelector("#setting_box");
const setting = document.querySelector("#setting");
const setting_window = document.querySelector("#setting_window");
const close = document.querySelector("#close");

setting.addEventListener("click", ()=> {
  current_game.htmlManager.popupMessage(setting_box, 300).catch(()=>{});;
  speed_range.value = current_game.htmlManager.gage_duration;
  quiz_range.value = current_game.max_quiz_count;

})

close.addEventListener("click", () => {
  current_game.htmlManager.popupMessage(setting_box, 300, "reverse");
})

$("#init_button_developer").addEventListener("click", () => {
  current_game.htmlManager.popupMessage(setting_box, 300, "reverse").then(
    resolve => initGame()
  ).catch(()=>{});
});
//갯수 설정 만들기