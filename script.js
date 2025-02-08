let userInput = document.getElementById("user-inputbox");
let toConvertInput = document.getElementById('converted-inoutbox');
let timeStamp = document.getElementsByClassName('time-stamp')[0]
let perRate = document.getElementsByClassName('per-rate')[0]
let answerDisplay = document.getElementsByClassName("display")[0];
let selectedCurrency = document.getElementById("user-currency-choice");
let convertedCurrency = document.getElementById("converted-currency-choice");
//API
const URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";
let USD = 0;
let importedObj = {};
let curentDate = new Date();
let objOfCurrencies = {}; //Object to store USD obj , containing all the currency rates
let FunctionToGetRatesFromApi = async () => {
  try {
    timeStamp.innerText = "Fetching latest exchange rates...";
    let response = await fetch(URL);
    let finalData = await response.json();
    timeStampFunc();
    importedObj = finalData;
    objOfCurrencies = importedObj["usd"];
    console.log(curentDate);
    console.log(objOfCurrencies);
  } catch (error) {
    console.log(error);
    perRate.innerText = `${error} Rates`
    timeStamp.innerText = ""
  }

};
FunctionToGetRatesFromApi()
// console.log(objOfCurrencies)

let userValueInSelectedCurrency = 0;
let userCurrentCurrency = "";
let currencyToBeConverted = "";

let userInputVal = 0;
const userInuptValSetter = () => {
  let inputValue = parseFloat(userInput.value);
  if (isNaN(inputValue) || inputValue <= 0) {
    answerDisplay.innerText = "Enter a valid amount";
    return;
  }
  userInputVal = inputValue;
  userCurrentCurrency = selectedCurrency.value;
  userValueInSelectedCurrency = userInputVal / objOfCurrencies[userCurrentCurrency] || 1; // Avoid division by undefined
};

let tempToStoreFinalVal = 0;
const ConversionFunction = () => {
    currencyToBeConverted = convertedCurrency.value;
    let FinalValueConverted = objOfCurrencies[currencyToBeConverted] * userValueInSelectedCurrency;
    answerDisplay.innerText = `${FinalValueConverted.toLocaleString()}  ${currencyToBeConverted.toLocaleUpperCase()}`;
    tempToStoreFinalVal = FinalValueConverted;
}

const CombinedFunction = async () => {
  if (Object.keys(objOfCurrencies).length === 0) {
    await FunctionToGetRatesFromApi();  // Wait for API data if not available
  }
  userInuptValSetter();
  ConversionFunction();
  timeStampFunc();
  perRateFunc();
};

const DynamiChanging = () =>{
  userInuptValSetter();
  ConversionFunction();
}
const perRateFunc = () =>{
    let convL = (parseFloat(tempToStoreFinalVal))/userInputVal
    let convR = (parseFloat(userInputVal))/tempToStoreFinalVal
    perRate.innerText = `1 ${userCurrentCurrency.toLocaleUpperCase()} = ${convL.toFixed(3)} ${currencyToBeConverted.toLocaleUpperCase()} 
     1 ${currencyToBeConverted.toLocaleUpperCase()} = ${convR.toFixed(3)} ${userCurrentCurrency.toLocaleUpperCase()} `;
}
const timeStampFunc = () => {
  let curentDate = new Date();
  let options = { 
    day: "2-digit", 
    month: "short", 
    year: "numeric", 
    hour: "2-digit", 
    minute: "2-digit", 
    second: "2-digit", 
    hour12: true 
  };
  timeStamp.innerText = `Rates Updated on ${curentDate.toLocaleString("en-US", options)}`;
};

userInput.addEventListener('input', DynamiChanging)
selectedCurrency.addEventListener("change", CombinedFunction);
convertedCurrency.addEventListener("change", ConversionFunction);
convertedCurrency.addEventListener("change", perRateFunc);

