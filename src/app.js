import "./style.css";
import debounce from "debounce";
import throttle from "lodash.throttle";
import refs from "./refs";
import HttpClient from "./fetch";

const httpClient = new HttpClient();

refs.leftInput.addEventListener("input", debounce(onLeftInputChange, 300));

function onLeftInputChange(e) {
  const value = e.target.value;
  currencyForLeft(value);
}

async function currencyForLeft(value) {
  if (isNaN(Number(value))) {
    refs.leftInput.classList.add("error");
    return;
  }
  refs.leftInput.classList.remove("error");

  const data = await httpClient.getCurrency(
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

  const data = await httpClient.getCurrency(
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
  showCur({
    allCurrencies: refs.allCurrenciesLeft,
    currencyList: refs.currencyListLeft,
  });
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

refs.currencyListLeft.addEventListener("click", (e) => {
  onCurrencyListClick(e, {
    curText: refs.leftCurText,
    currencyList: refs.currencyListLeft,
    input: refs.leftInput,
    arrow: refs.arrowLeft,
    currencyFor: currencyForLeft,
    allCurrencies: refs.allCurrenciesLeft,
  });
});

function onCurrencyListClick(e, paramRefs) {
  if (e.target.tagName === "LI") {
    const cur = e.target.textContent;
    paramRefs.curText.textContent = cur;
    paramRefs.currencyList.classList.remove("active");

    const value = paramRefs.input.value;
    paramRefs.currencyFor(value);
    paramRefs.arrow.classList.remove("active");
    refs.currencyInput[0].value = "";
  }
  if (e.target.tagName === "INPUT") {
    e.target.addEventListener(
      "input",
      throttle(() => {
        currencySearch(e, paramRefs.allCurrencies);
      }, 300)
    );
  }
}

refs.currencyRightInfo.addEventListener("click", onCurrencyRightInfoClick);

function onCurrencyRightInfoClick(e) {
  refs.arrowRight.classList.toggle("active");
  showCur({
    allCurrencies: refs.allCurrenciesRight,
    currencyList: refs.currencyListRight,
  });
}

async function showCur(paramRefs) {
  const data = await httpClient.getAllCurrencies();
  const keys = Object.keys(data);

  createHtmlCur(keys, paramRefs.allCurrencies);

  paramRefs.currencyList.classList.toggle("active");
}

refs.currencyListRight.addEventListener("click", (e) => {
  onCurrencyListClick(e, {
    curText: refs.rightCurText,
    currencyList: refs.currencyListRight,
    input: refs.rightInput,
    arrow: refs.arrowRight,
    currencyFor: currencyForRight,
    allCurrencies: refs.allCurrenciesRight,
  });
});

async function currencySearch(e, ref) {
  e.target.classList.remove("error");
  const allCurrencies = await httpClient.getAllCurrencies();
  const keysCur = Object.keys(allCurrencies);
  const filtered = keysCur.filter((cur) =>
    cur.includes(e.target.value.toLowerCase())
  );

  if (filtered.length === 0) {
    e.target.classList.add("error");
    return;
  }

  createHtmlCur(filtered, ref);
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
