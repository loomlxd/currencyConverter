import "./style.css";
import debounce from "debounce";
import throttle from "lodash.throttle";
import refs from "./refs";
import Fetch from "./fetch";

const fetch = new Fetch();

refs.leftInput.addEventListener("input", debounce(onleftInputChange, 300));

function onleftInputChange(e) {
  const value = e.target.value;
  currencyForLeft(value);
}

async function currencyForLeft(value) {
  if (isNaN(Number(value))) {
    refs.leftInput.classList.add("error");
    return;
  }
  refs.leftInput.classList.remove("error");

  const data = await fetch.takeCurrency(
    refs.leftCurrency.textContent.toLowerCase()
  );
  const actualCur = refs.leftCurrency.textContent.toLowerCase();
  const secondCur =
    data[actualCur][refs.rightCurrency.textContent.toLowerCase()];
  refs.rightInput.value = (secondCur * Number(value)).toFixed(2);

  if (value.length === 0) {
    refs.rightInput.value = "";
  }
}

refs.rightInput.addEventListener("input", debounce(onRightInputChange, 300));

function onRightInputChange(e) {
  const value = e.target.value;
  currencyForRight(value);
}

async function currencyForRight(value) {
  if (isNaN(Number(value))) {
    refs.rightInput.classList.add("error");
    return;
  }
  refs.rightInput.classList.remove("error");

  const data = await fetch.takeCurrency(
    refs.rightCurrency.textContent.toLowerCase()
  );
  const actualCur = refs.rightCurrency.textContent.toLowerCase();
  const secondCur =
    data[actualCur][refs.leftCurrency.textContent.toLowerCase()];
  refs.leftInput.value = (secondCur * Number(value)).toFixed(2);

  if (value.length === 0) {
    refs.leftInput.value = "";
  }
}

refs.centerArrows.addEventListener("click", onCenterArrowsClick);

function onCenterArrowsClick(e) {
  refs.arrowCenterLeft.classList.add("active");
  refs.arrowCenterRight.classList.add("active");

  setTimeout(() => {
    refs.arrowCenterLeft.classList.remove("active");
    refs.arrowCenterRight.classList.remove("active");
  }, 300);

  const leftCurrency = refs.leftCurrency.textContent;
  const rightCurrency = refs.rightCurrency.textContent;
  const leftInput = refs.leftInput.value;
  const rightInput = refs.rightInput.value;

  refs.leftCurrency.textContent = rightCurrency;
  refs.rightCurrency.textContent = leftCurrency;
  refs.leftInput.value = rightInput;
  refs.rightInput.value = leftInput;
  refs.currencyListLeft.classList.remove("active");
  refs.currencyListRight.classList.remove("active");
  refs.arrowRight.classList.remove("active");
  refs.arrowLeft.classList.remove("active");
}

refs.currencyLeftInfo.addEventListener("click", onCurrencyLeftInfoClick);

function onCurrencyLeftInfoClick(e) {
  refs.arrowLeft.classList.toggle("active");
  showCurLeft();
}

async function showCurLeft() {
  const data = await fetch.takeAllCurrencies();
  const keys = Object.keys(data);

  createHtmlCur(keys, refs.allCurrenciesLeft);

  refs.currencyListLeft.classList.toggle("active");
}

function createHtmlCur(keys, ref) {
  const htmlText = keys
    .filter(
      (cur) =>
        cur !== refs.leftCurText.textContent.toLowerCase() ||
        cur !== refs.rightCurText.textContent.toLowerCase()
    )
    .map((curr) => `<li class="currency-text">${curr.toUpperCase()}</li>`)
    .join("");

  ref.innerHTML = htmlText;
}

refs.currencyListLeft.addEventListener("click", onCurrencyListLeftClick);

function onCurrencyListLeftClick(e) {
  if (e.target.tagName === "LI") {
    const cur = e.target.textContent;
    refs.leftCurText.textContent = cur;
    refs.currencyListLeft.classList.remove("active");
    const value = refs.leftInput.value;
    currencyForLeft(value);
    refs.arrowLeft.classList.remove("active");
    refs.currencyInput[0].value = "";
  }
  if (e.target.tagName === "INPUT") {
    e.target.addEventListener("input", throttle(onFindCurrencyInputLeft, 300));
  }
}

refs.currencyRightInfo.addEventListener("click", onCurrencyRightInfoClick);

function onCurrencyRightInfoClick(e) {
  refs.arrowRight.classList.toggle("active");
  showCurRight();
}

async function showCurRight() {
  const data = await fetch.takeAllCurrencies();
  const keys = Object.keys(data);

  createHtmlCur(keys, refs.allCurrenciesRight);

  refs.currencyListRight.classList.toggle("active");
}

refs.currencyListRight.addEventListener("click", onCurrencyListRightClick);

function onCurrencyListRightClick(e) {
  if (e.target.tagName === "LI") {
    const cur = e.target.textContent;
    refs.rightCurText.textContent = cur;
    refs.currencyListRight.classList.remove("active");

    const value = refs.leftInput.value;
    currencyForLeft(value);
    refs.arrowRight.classList.remove("active");
    refs.currencyInput[1].value = "";
  }
  if (e.target.tagName === "INPUT") {
    e.target.addEventListener("input", throttle(onFindCurrencyInputRight, 300));
  }
}

async function onFindCurrencyInputLeft(e) {
  e.target.classList.remove("error");
  const allCurrencies = await fetch.takeAllCurrencies();
  const keysCur = Object.keys(allCurrencies);
  const filtered = keysCur.filter((cur) =>
    cur.includes(e.target.value.toLowerCase())
  );

  if (filtered.length === 0) {
    e.target.classList.add("error");
    return;
  }

  createHtmlCur(filtered, refs.allCurrenciesLeft);
}

async function onFindCurrencyInputRight(e) {
  e.target.classList.remove("error");
  const allCurrencies = await fetch.takeAllCurrencies();
  const keysCur = Object.keys(allCurrencies);
  const filtered = keysCur.filter((cur) =>
    cur.includes(e.target.value.toLowerCase())
  );

  if (filtered.length === 0) {
    e.target.classList.add("error");
    return;
  }

  createHtmlCur(filtered, refs.allCurrenciesRight);
}

window.addEventListener("click", onWindowClick);

function onWindowClick(e) {
  if (
    e.target === refs.leftCurrency ||
    e.target === refs.rightCurrency ||
    e.target.closest(".cur-input") ||
    e.target.closest(".currency-text")
  ) {
    return;
  }

  refs.currencyInput.forEach((el) => (el.value = ""));

  refs.currencyListLeft.classList.remove("active");
  refs.currencyListRight.classList.remove("active");
  refs.arrowRight.classList.remove("active");
  refs.arrowLeft.classList.remove("active");
}
