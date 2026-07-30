// measures the real navbar height and stores it as a CSS variable so styles.css's scroll-margin-top can match it exactly
const mainNav = document.querySelector("#main-nav");

function updateNavHeight() 
{
   document.documentElement.style.setProperty("--nav-height", mainNav.offsetHeight + "px");
}

updateNavHeight();
window.addEventListener("resize", updateNavHeight);



// cursor glow moves the glowing circle (#cursorGlow in the html) to follow the mouse
const cursorGlow = document.querySelector("#cursorGlow");
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", function (event) 
{
   mouseX = event.clientX;
   mouseY = event.clientY;
});

// actually moves the glow to the mouse position, then calls itself again on the next frame
function moveCursorGlow() 
{
   cursorGlow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
   requestAnimationFrame(moveCursorGlow);
}

requestAnimationFrame(moveCursorGlow);

// theme toggle swaps light/dark by adding or removing data-theme on <body>
const themeToggle = document.querySelector("#theme-toggle");

themeToggle.addEventListener("click", function () 
{
   if (document.body.dataset.theme === "dark") 
      {
      document.body.removeAttribute("data-theme");
   } else 
      {
      document.body.setAttribute("data-theme", "dark");
   }// the CSS variables in styles.css change automatically based on that attribute
});

// mobile nav toggle
const menuButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuButton.addEventListener("click", function () 
{
   // toggle returns true/false so i use it to update aria-expanded
   const isOpen = navMenu.classList.toggle("show");
   menuButton.setAttribute("aria-expanded", isOpen);
});

// dynamic intro message the text itself is saved data, so admin mode can edit it
const FOCUS_STORAGE_KEY = "focusText";
const defaultFocusText = "I am currently focused on JavaScript, responsive design, and WordPress preparation.";

let currentFocusText = loadData(FOCUS_STORAGE_KEY) || defaultFocusText;

const focusButton = document.querySelector(".focus-btn");
const focusText = document.querySelector(".focus-text");

focusButton.addEventListener("click", function () {
   focusText.textContent = currentFocusText;
}); // focus text shows new text or default if nothing has been saved yet

// admin-only- edits currentFocusText itself, not just what the button reveals
const editFocusBtn = document.querySelector("#editFocusBtn");

editFocusBtn.addEventListener("click", function () {
   const newText = prompt("Edit current focus text:", currentFocusText);

   // null means Cancel was clicked so leave everything as it was
   if (newText === null || newText.trim() === "") return;

   currentFocusText = newText.trim();
   saveData(FOCUS_STORAGE_KEY, currentFocusText);
   focusText.textContent = currentFocusText;
});

// scroll buttons, each has data-scroll-target="someSectionId" on it,
const scrollButtons = document.querySelectorAll(".scroll-btn[data-scroll-target]");

scrollButtons.forEach(function (button) {
   button.addEventListener("click", function () {
      const targetSection = document.querySelector("#" + button.dataset.scrollTarget);
      targetSection.scrollIntoView({ behavior: "smooth" });
   });
});

// updates --mx/--my custom properties as the mouse moves
const hero = document.querySelector("#hero");

hero.addEventListener("mousemove", function (event) {
   const rect = hero.getBoundingClientRect();
   hero.style.setProperty("--mx", ((event.clientX - rect.left) / rect.width) * 100 + "%");
   hero.style.setProperty("--my", ((event.clientY - rect.top) / rect.height) * 100 + "%");
}); //it's converting a pixel position into a percentage for the CSS so it highlights

// faq accordion
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (question) {
   question.addEventListener("click", function () {
      // grab the answer right after the question, then show/hide it
      const answer = question.nextElementSibling;
      answer.classList.toggle("show");
   });
});

// highlights whichever nav link matches the section currently in view
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("#navbarNav .nav-link");

const navObserver = new IntersectionObserver(function (entries) {
   entries.forEach(function (entry) {
      if (entry.isIntersecting) {
         navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
         });
      }
   });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach(function (section) {
   navObserver.observe(section);
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

// footer year keeps the copyright date current without editing the html every year
document.querySelector("#footer-year").textContent = new Date().getFullYear();



// ---- shared admin mode ----
// isUnlocked is used by main.js, project.js, skills.js, and timeline.js to decide whether to show edit/delete controls. 
// main.js loads first, every other file just reads/reassigns this same variable
let isUnlocked = false;

// the actual unlock trigger is plain text in the footer (#secretUnlockTrigger) -
// no visible button on the dashboard at all
const unlockTrigger = document.querySelector("#secretUnlockTrigger");
const adminBanner = document.querySelector("#adminModeBanner");
const exitAdminBtn = document.querySelector("#exitAdminBtn");

const ADMIN_PASSCODE = "Letmein";

unlockTrigger.addEventListener("click", function () {
   const answer = prompt("Enter the passcode to enable admin mode:");

   // prompt() returns null if the user hits Cancel, so check that too
   if (answer === ADMIN_PASSCODE) {
      isUnlocked = true;
      enterAdminMode();
   } else {
      alert("Wrong passcode.");
   }
});

exitAdminBtn.addEventListener("click", function () {
   isUnlocked = false;
   exitAdminMode();
});

// re-renders every admin-gated section so their edit/delete/add controls. 
// The functions being called (showProjectForm, updateDashboard, renderSkills, renderTimeline) are defined in their own js files
function enterAdminMode() {
   adminBanner.classList.remove("hidden");
   editFocusBtn.classList.remove("hidden");

   showProjectForm();
   showSkillsForm();
   showTimelineForm();
   updateDashboard();
   renderSkills(skills);
   renderTimeline(timelineEntries);

   window.scrollTo({ top: 0, behavior: "smooth" });
}

function exitAdminMode() {
   adminBanner.classList.add("hidden");
   editFocusBtn.classList.add("hidden");

   hideProjectForm();
   hideSkillsForm();
   hideTimelineForm();
   updateDashboard();
   renderSkills(skills);
   renderTimeline(timelineEntries);
}
