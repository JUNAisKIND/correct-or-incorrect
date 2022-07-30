const speed_range = $("#speed_range");
const speed_range_label = $("#speed_range + label");
speed_range.addEventListener("change", () => {
  speed_range_label.textContent = speed_range.value + "초";
})
const quiz_range = $("#quiz_range");
const quiz_range_label = $("#quiz_range + label");
quiz_range.addEventListener("change", () => {
  quiz_range_label.textContent = quiz_range.value + "개";
})

const setting_box = $("#setting_box");

$("#setting_button").addEventListener("click", ()=> {
  current_game.htmlManager.popupMessage(setting_box, 300).catch(()=>{});
})

$("#init_button_options").addEventListener("click", () => {
  speed_range.value = 10;
  speed_range_label.textContent = "10초";
  quiz_range.value = 30;
  quiz_range_label.textContent = "30개";
});

$("#init_button_developer").addEventListener("click", () => {
  current_game.htmlManager.popupMessage(setting_box, 300, "reverse").catch(()=>{});
  initGame();
});