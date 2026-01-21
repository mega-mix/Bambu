import SaveGame from "./models/SaveGame.js";

const output = document.getElementById("output");
const input = document.getElementById("input");
const btnLaden = document.getElementById("btnLaden");
const btnSpeichern = document.getElementById("btnSpeichern");

btnLaden.addEventListener('click', e => {

});

btnSpeichern.addEventListener('click', e => {
    const playerName = input.value;
    const save = new SaveGame(playerName, 1);
    console.log("Save erstellt:");
    console.log(save.player);


});