const input = document.getElementById("search");
const button = document.getElementById("button");
const mapFrame = document.getElementById("mapFrame");

button.addEventListener("click",showMap);

function showMap() {
  const location = input.value;

  if(location.trim() !=="") {
    mapFrame.src = "https://maps.google.com/maps?q=" + encodeURIComponent(location) + "&output=embed";
  }

  else {
    alert("Please enter a location");
  }
}




emailjs.init({
  publicKey: "hoCU3iVioKdUCKabM"
});

const form = document.getElementById("orderForm");
const status = document.getElementById("status");
const submitButton = document.getElementById("submitButton");
const coffeeSelect = document.getElementById("coffee");

function isValidEmail(email) {
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const orderButtons = document.querySelectorAll(".menu-order");
orderButtons.forEach(function(button){
  button.addEventListener("click",function() {
    const coffee = button.dataset.coffee;

    coffeeSelect.value = coffee;

    document.getElementById("contact").scrollIntoView({behavior:"smooth"});
  });
});

form.addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const coffee = document.getElementById("coffee").value.trim();
    const quantity = document.getElementById("quantity").value;

    if(name === "") {
      showError(
        "Please enter your name."
      );
      return;
    }

    if(!isValidEmail(email)) {
      showError(
        "Please enter a valid email address."
      );
      return;
    }

    if(coffee === "") {
      showError(
        "Please select a coffee."
      );
      return;
    }

    if(quantity < 1) {
      showError(
        "Quantity must be at least 1."
      );
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    status.textContent = "Preparing your coffee order..."
    status.style.color = "#806b5d";

    //SEND ORDER EMAIL TO YOU

    emailjs.sendForm (
      "service_mgvkvwt",
      "template_qdl87mb",
      form
    )

    .then(function(response){
      console.log(
        "ORDER EMAIL SUCCESS:",
        response.status,
        response.text
      );

      //SEND ORDER EMAIL TO CUSTOMER
      return emailjs.sendForm(
        "service_mgvkvwt",
        "template_cqbax2o",
        form       
      );
    })

    .then(function(response) {
      console.log(
        "AUTO-REPLY SUCCESS.",
        response.status,
        response.text
      );

      status.textContent = 
        "Order sent successfully! Check your email for confirmation.";
      status.style.color = "green";

      form.reset();

      submitButton.disabled = false;
      submitButton.textContent = "Send Order";
    })

    .catch(function(error) {
      console.error(
        "EMAILJS ERROR:",
        error
      );


      status.textContent = "Something went wrong. Please try again!";
      status.style.color = "red";

      submitButton.disabled = false;

      submitButton.textContent = "Send Order";
    });
  }
);

function showError(message) {
  status.textContent = "X"+ message;
  status.style.color = "red";
}
