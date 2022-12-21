"use strict";

const displayPreviousValue = document.querySelector("#previous-value");
const displayCurrentValue = document.querySelector("#current-value");
const numbersKeys = document.querySelectorAll(".number");
const operatorsKeys = document.querySelectorAll(".operator");
const keys = document.querySelectorAll(".key");
const calculator = {
  displayCurrentValue,
  displayPreviousValue,
  currentValue: "",
  previousValue: "",
  currentOp: null,
  operations: {
    sum(num1, num2) {
      return num1 + num2;
    },

    sub(num1, num2) {
      return num1 - num2;
    },

    mul(num1, num2) {
      return num1 * num2;
    },

    div(num1, num2) {
      return num1 / num2;
    },

    pow(num1, num2) {
      return num1 ** num2;
    },

    radic(num) {
      const result = Math.sqrt(num);
      return isFinite(result) ? result : "Syntax Error";
    },

    rem(num1, num2) {
      return num1 % num2;
    },
  },

  parsedSigns: {
    sum: "+",
    sub: "−",
    mul: "×",
    div: "÷",
    rem: "%",
    pow: "ⁿ",
  },

  addNum(num) {
    if (num === "." && calculator.currentValue.includes(".")) return;

    calculator.currentValue += num;

    calculator.printValues();
  },

  printValues() {
    calculator.displayCurrentValue.textContent = calculator.currentValue;
    calculator.displayPreviousValue.textContent = `
      ${calculator.previousValue} ${calculator.parsedSigns[calculator.currentOp] || ""}`;
  },

  del() {
    calculator.currentValue = calculator.currentValue.slice(0, -1);

    calculator.printValues();

    if (calculator.currentValue === "") calculator.displayCurrentValue.textContent = "0";
  },

  clear() {
    calculator.currentValue = "";
    calculator.previousValue = "";
    calculator.currentOp = null;
    calculator.printValues();

    if (calculator.currentValue === "") calculator.displayCurrentValue.textContent = "0";
  },

  calc() {
    const prevNum = parseFloat(calculator.previousValue);
    const currNum = parseFloat(calculator.currentValue);

    if (isNaN(prevNum) || isNaN(currNum)) return;

    calculator.currentValue = calculator.operations[calculator.currentOp](prevNum, currNum);
  },

  getOperator(operator) {
    if (operator === "radic") {
      calculator.previousValue = calculator.operations.radic(calculator.currentValue);
      calculator.currentValue = "";
      calculator.currentOp = "equal";

      calculator.printValues();
      return;
    }

    calculator.currentOp !== "equal" && calculator.calc();

    calculator.currentOp = operator;
    calculator.previousValue = calculator.currentValue || calculator.currentValue === 0 || calculator.previousValue;

    if (calculator.previousValue === true) calculator.previousValue = 0;

    calculator.currentValue = "";

    calculator.printValues();
  },

  changeSign() {
    if (!calculator.currentValue) return;

    calculator.currentValue[0] === "-" ?
      (calculator.currentValue = calculator.currentValue.slice(1)) :
      (calculator.currentValue = "-" + calculator.currentValue);
    calculator.printValues();
  },
};

for (let num of numbersKeys) {
  num.addEventListener("click", () => calculator.addNum(num.textContent));
}

for (let operator of operatorsKeys) {
  operator.addEventListener("click", () => calculator.getOperator(operator.getAttribute("id")));
}

for (let key of keys) {
  key.addEventListener("click", () => {
    let bgColor = window.getComputedStyle(key).getPropertyValue("background-color");
    key.style.backgroundColor = "rgba(255, 255, 255, 0.5)";

    setTimeout(function () {
      key.style.backgroundColor = bgColor;
    }, 30);
  });
}

document.querySelector("#change-sign").addEventListener("click", calculator.changeSign);
document.querySelector("#del").addEventListener("click", calculator.del);
document.querySelector("#clear").addEventListener("click", calculator.clear);