const main = document.querySelector("main");
const aside = document.querySelector("aside");
const textarea = document.querySelector("textarea");
const form = document.forms[0];
const spanDate = document.querySelector("span.date");

const colors = [
  ["#FFFFFF", "Белый"],
  ["#FFEBCD", "Бежевый"],
  ["#C2FF3D", "Жёлтый"],
  ["#FF3DE8", "Фиолетовый"],
  ["#3DC2FF", "Голубой"],
  ["#04E022", "Зелёный"],
  ["#EBB328", "Оранжевый"],
];

class Note {
  text;
  color;
  date;

  constructor(text, color, date) {
    this.text = text;
    this.color = color;
    this.date = date;
  }

  renderNote(id) {
    let div = document.createElement("div");
    div.className = "notes";
    div.style.background = this.color;

    let btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";

    let span = document.createElement("span");
    span.className = "date";
    span.textContent = this.date;
    btnContainer.append(span);

    let btnRedact = document.createElement("button");
    btnRedact.className = "btn-notes";
    btnRedact.id = id;
    let html = '<img src="images/redact.png" />';
    btnRedact.insertAdjacentHTML("beforeend", html);
    btnRedact.addEventListener("click", (e) => {
      ModalWindow.redNotes(e.currentTarget.id);
      Storege.renderStorege();
    });
    btnContainer.append(btnRedact);

    let btnDelete = document.createElement("button");
    btnDelete.className = "btn-notes";
    btnDelete.id = id;
    btnDelete.textContent = "x";
    btnDelete.addEventListener("click", (e) => {
      Storege.delStorege(e.target.id);
      Storege.renderStorege();
    });
    btnContainer.append(btnDelete);

    div.append(btnContainer);

    let text = document.createElement("pre");
    text.textContent = this.text;
    div.append(text);

    main.append(div);
  }
}

class Storege {
  static voidStorage() {
    if (localStorage.getItem("notes") === null) {
      localStorage.setItem("notes", "[]");
    }
  }

  static clearStorege() {
    localStorage.clear();
    Storege.voidStorage();
  }

  static getStorege() {
    let data;
    data = localStorage.getItem("notes");
    data = JSON.parse(data);
    return data;
  }

  static addStorege(elem) {
    Storege.voidStorage();
    let data = Storege.getStorege();
    data.push(elem);
    data = JSON.stringify(data);
    localStorage.setItem("notes", data);
  }

  static delStorege(elem) {
    let data = Storege.getStorege();
    data.splice(elem, 1);
    data = JSON.stringify(data);
    localStorage.setItem("notes", data);
  }

  static redStorege(elem, value) {
    let data = Storege.getStorege();
    data[elem] = value;
    data = JSON.stringify(data);
    localStorage.setItem("notes", data);
  }

  static getNote(id) {
    let data = Storege.getStorege();
    return data[id];
  }

  static getLengthStorege() {
    let data = Storege.getStorege();
    return data.length;
  }

  static renderStorege() {
    while (main.firstChild) {
      main.removeChild(main.lastChild);
    }

    let data = Storege.getStorege();
    let count = 0;

    for (let obj of data) {
      let note = new Note(obj.text, obj.color, obj.date);
      note.renderNote(count);
      count++;
    }
  }
}

class ModalWindow {
  static openModal() {
    aside.style.visibility = "visible";
  }

  static clearTextarea() {
    textarea.value = "";
  }

  static closeModal() {
    aside.style.visibility = "hidden";
    ModalWindow.clearTextarea();
  }

  static newNotes() {
    ModalWindow.openModal();

    form["note-id"].value = Storege.getLengthStorege();
    form["note-date"].value = getCurrentDate();

    spanDate.textContent = getCurrentDate();
    ModalWindow.changeColorNote(colors, ModalWindow.getSettings());
  }

  static redNotes(id) {
    let note = Storege.getNote(id);
    ModalWindow.openModal();
    form["note-id"].value = id;
    textarea.value = note.text;
    form["note-date"].value = note.date;

    spanDate.textContent = note.date;
    ModalWindow.changeColorNote(
      colors,
      ModalWindow.getColorCount(colors, note.color)
    );
  }

  static addNotes() {
    if (textarea.value != "") {
      let id = form["note-id"].value;
      let text = textarea.value;
      let color = form["note-color"].value;
      let date = form["note-date"].value;

      if (id == Storege.getLengthStorege()) {
        Storege.addStorege(new Note(text, color, date));
      } else {
        Storege.redStorege(id, new Note(text, color, date));
      }

      ModalWindow.closeModal();
      ModalWindow.clearTextarea();
      Storege.renderStorege();
    }
  }

  static changeColorNote(arrColor, colorCount) {
    let spanColorNote = document.querySelector("#color-note");
    let modalWin = document.querySelector(".modal-window");

    form["note-color"].value = arrColor[colorCount][0];
    spanColorNote.textContent = arrColor[colorCount][1];
    modalWin.style.background = arrColor[colorCount][0];
  }

  static getColorCount(arrColor, colorHEX) {
    let countIter = 0;
    for (let color of arrColor) {
      if (color[0] == colorHEX) {
        return countIter;
      }
      countIter++;
    }
  }

  static voidSettings() {
    if (localStorage.getItem("settings") === null) {
      localStorage.setItem("settings", 0);
    }
  }

  static changeSettings(action) {
    let settings = localStorage.getItem("settings");
    if (action === "+") {
      settings++;
    } else if (action === "-") {
      settings--;
    }

    if (settings > colors.length - 1) {
      settings = 0;
    } else if (settings < 0) {
      settings = colors.length - 1;
    }

    localStorage.setItem("settings", settings);
  }

  static getSettings() {
    return localStorage.getItem("settings");
  }
}

Storege.voidStorage();
ModalWindow.voidSettings();
Storege.renderStorege();

let btnAddNotes = document.querySelector("#add-notes-btn");
let btnClose = document.querySelector("#btn-close");
let btnAdd = document.querySelector("#btn-Add");

btnAddNotes.addEventListener("click", ModalWindow.newNotes);

aside.addEventListener("click", (e) => {
  const target = e.target;

  if (target.id === "modal-close") {
    ModalWindow.closeModal();
  }
});

btnAdd.addEventListener("click", ModalWindow.addNotes);

function getCurrentDate() {
  let date = new Date();

  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  let currentDate = `${date.getDate()}.${padTo2Digits(
    date.getMonth() + 1
  )}.${date.getFullYear()}`;

  return currentDate;
}

let colorContainer = document.querySelector("#color-note-container");
colorContainer.addEventListener("click", (event) => {
  let clickBtn = event.target.textContent;

  if (clickBtn === ">") {
    ModalWindow.changeSettings("+");
  } else if (clickBtn === "<") {
    ModalWindow.changeSettings("-");
  }

  ModalWindow.changeColorNote(colors, ModalWindow.getSettings());
});
