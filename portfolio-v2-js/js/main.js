// mobile nav toggle
const menuButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuButton.addEventListener("click", function () {
   // toggle returns true/false so i use it to update aria-expanded
   const isOpen = navMenu.classList.toggle("show");
   menuButton.setAttribute("aria-expanded", isOpen);
});

// dynamic intro message
const focusButton = document.querySelector(".focus-btn");
const focusText = document.querySelector(".focus-text");

focusButton.addEventListener("click", function () {
   focusText.textContent = "I am currently focused on JavaScript, responsive design, and WordPress preparation.";
});

// faq accordion
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (question) {
   question.addEventListener("click", function () {
      // grab the answer right after the question, then show/hide it
      const answer = question.nextElementSibling;
      answer.classList.toggle("show");
   });
});

// fade in skill + project cards as they scroll into view (css has them at opacity 0 until they get the in-view class)
const fadeCards = document.querySelectorAll(".skills .card, .project-card");

const fadeObserver = new IntersectionObserver(function (entries) {
   entries.forEach(function (entry) {
      if (entry.isIntersecting) {
         entry.target.classList.add("in-view");
      }
   });
});

fadeCards.forEach(function (card) {
   fadeObserver.observe(card);
});

// contact form validation
const contactForm = document.querySelector(".contact-form");
const contactStatus = document.querySelector(".contact-status");

contactForm.addEventListener("submit", function (event) {
   event.preventDefault();

   const name = document.querySelector("#name").value.trim();
   const email = document.querySelector("#email").value.trim();
   const message = document.querySelector("#message").value.trim();

   // empty check
   if (name === "" || email === "" || message === "") {
      contactStatus.textContent = "Please fill in the required fields.";
      return;
   }

   //api call to make contact form work
   // if it passed, actually send it to formspree
   fetch("https://formspree.io/f/xjgqopry", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(contactForm)
   })
   .then(function (response) {
      if (response.ok) {
         contactStatus.textContent = "Thanks! Your message has been sent.";
         contactForm.reset();
      } else {
         contactStatus.textContent = "Something went wrong, please try again.";
      }
   });
});