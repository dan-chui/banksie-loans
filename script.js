/** Object to get and store number input data from html **/
let state = {
  price: getNumber(document.querySelectorAll('[name="price"]')[0].value),
  loan_years: document.querySelectorAll('[name="loan_years"]')[0].value,
  down_payment: document.querySelectorAll('[name="down_payment"]')[0].value,
  interest_rate: document.querySelectorAll('[name="interest_rate"]')[0].value,
  property_tax: document.querySelectorAll('[name="property_tax"]')[0].value,
  home_insurance: document.querySelectorAll('[name="home_insurance"]')[0].value,
  hoa: document.querySelectorAll('[name="hoa"]')[0].value,
};

/** Variables **/
let totalLoan,
  totalMonths,
  monthlyInterest,
  monthlyPrincipalInterest,
  monthlyPropertyTaxes,
  monthlyHomeInsurance,
  monthlyHOA,
  monthlyTotal,
  labels = ["Principal & Interest", "Property Tax", "Home Insurance", "HOA"],
  backgroundColor = [
    "rgba(255, 122, 122, 1)",
    "rgb(73, 153, 245, 1)",
    "rgb(252, 204, 106, 1)",
    "rgb(125, 207, 74, 1)",
    ,
  ],
  borderColor = [
    "rgb(255, 122, 122, 1)",
    "rgb(73, 153, 245, 1)",
    "rgb(252, 204, 106, 1)",
    "rgb(125, 207, 74, 1)",
    ,
  ];

/** Function to turn the html number input data to real numbers **/
function getNumber(str) {
  return Number(str.replace(/[^0-9\.-]+/g, ""));
}

/** Script to create the visual myChart **/
const ctx = document.getElementById("myChart");

let myChart = new Chart(ctx, {
  //  Chart type
  type: "doughnut",

  //  Data to display in Chart
  data: {
    //  Labels created above in Variable
    labels: labels,
    datasets: [
      {
        label: "# of Votes",
        //  Data from html input fields variables
        data: [
          monthlyPrincipalInterest,
          monthlyPropertyTaxes,
          monthlyHomeInsurance,
          monthlyHOA,
        ],
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      },
    ],
  },
});

//  Turn off chart animation
myChart.options.animation = false;

/** Event listener for html input text fields **/
//  Get html form input text fields
let inputTexts = document.getElementsByClassName("form-group__textInput");

//  Loop to retrieve price and loan years input fields value
for (let i = 0; i < inputTexts.length; i++) {
  //  An input change event listener
  //  Changes in the input field triggers this loop and
  //  triggers the updateInputsState function to capture the values put into the input text fields
  inputTexts[i].addEventListener("input", updateInputsState);
}

/** Event listener to html input slider fields **/
//  Get Html form input slider fields
let inputSlides = document.getElementsByClassName("form-group__range-slide");

//  Loop to retrieve slider input fields value
for (let i = 0; i < inputSlides.length; i++) {
  //  An input change event listener
  //  Changes in the input field triggers this loop and
  //  triggers the updateInputsState function to capture the values put into the input slider fields
  inputSlides[i].addEventListener("input", updateInputsState);
}

/** Function to target input fields and assign the name and the value typed to variables **/
function updateInputsState(event) {
  let name = event.target.name;
  let value = event.target.value;

  //  Change html input fields to real numbers
  if (name == "price") {
    value = getNumber(value);
  }

  //  Changes slider output numbers based on the slider
  if (event.target.type == "range") {
    let total;
    //  Check for matching name input fields
    if (name == "home_insurance" || name == "hoa") {
      //  If matching names above then output value without %
      total = document.getElementsByClassName(
        `total__${name}`
      )[0].innerHTML = `${value}`;
    } else {
      //  If does NOT match names above, then output value with %
      total = document.getElementsByClassName(
        `total__${name}`
      )[0].innerHTML = `${value}%`;
    }
  }

  state = {
    //  Gets all values in the state object above and reassigns it here
    ...state,
    [name]: value,
  };

  // Function runs when user changes input and/or slider fields
  calculateData();
}

/** Add click event listener to display results **/
document.getElementsByTagName("form")[0].addEventListener("submit", (event) => {
  //  Prevent form from reloading webpage after clicking Enter or the Result button
  event.preventDefault();

  //  Add new class to the right column to show results after enter or result button is clicked
  document
    .getElementsByClassName("mg-page__right")[0]
    .classList.add("mg-page__right--animate");

  // Function runs when user clicks on enter or result button
  calculateData();
});

/** Function to calculate total results and display in results page **/
function calculateData() {
  totalLoan = state.price - state.price * (state.down_payment / 100);
  totalMonths = state.loan_years * 12;
  monthlyInterest = state.interest_rate / 100 / 12;
  monthlyPrincipalInterest = (
    totalLoan *
    ((monthlyInterest * (1 + monthlyInterest) ** totalMonths) /
      ((1 + monthlyInterest) ** totalMonths - 1))
  ).toFixed(2);
  monthlyPropertyTaxes = (
    (state.price * (state.property_tax / 100)) /
    12
  ).toFixed(2);
  monthlyHomeInsurance = state.home_insurance / 12;
  monthlyHOA = state.hoa / 12;
  monthlyTotal =
    //  Convert Monthly principal interest back to number Datatype
    parseFloat(monthlyPrincipalInterest) +
    parseFloat(monthlyPropertyTaxes) +
    parseFloat(monthlyHomeInsurance) +
    parseFloat(monthlyHOA);

  //  Display calculated values in results
  document.getElementsByClassName("info__numbers--principal")[0].innerHTML =
    "$" +
    parseFloat(monthlyPrincipalInterest).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  document.getElementsByClassName(
    "info__numbers--property_taxes"
  )[0].innerHTML =
    "$" +
    parseFloat(monthlyPropertyTaxes).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  document.getElementsByClassName(
    "info__numbers--home_insurance"
  )[0].innerHTML =
    "$" +
    parseFloat(monthlyHomeInsurance).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  document.getElementsByClassName("info__numbers--hoa")[0].innerHTML =
    "$" +
    parseFloat(monthlyHOA).toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });
  document.getElementsByClassName("info__numbers--total")[0].innerHTML =
    "$" +
    monthlyTotal.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    });

  //  Display data in chart form using the updateChart function
  updateChart(myChart, labels, backgroundColor);
}

/** Function to update chart to display results **/
function updateChart(chart, label, color) {
  //  Remove default results
  chart.data.datasets.pop();

  //  Add calculated results into chart
  chart.data.datasets.push({
    backgroundColor: color,
    data: [
      monthlyPrincipalInterest,
      monthlyPropertyTaxes,
      monthlyHomeInsurance,
      monthlyHOA,
    ],
  });

  //  Remove animations
  chart.options.transitions.active.animation.duration = 0;

  //  Update chart
  chart.update();
}

//  Reset page with default figures
calculateData();
