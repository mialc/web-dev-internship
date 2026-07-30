// starter skill data - used the very first time someone visits, or after
// saved skills have been cleared
const defaultSkills = [
   {
      title: "Design & Prototyping",
      description: "User-centered product design using Figma and Unity UI Toolkit. I create wireframes, high-fidelity prototypes, interaction flows, and conduct user interviews and usability testing to iterate toward accessible, usable interfaces.",
      tools: "Figma · Miro · Unity UI · Prototyping"
   },
   {
      title: "Technical",
      description: "Front-end fundamentals: semantic HTML, modern CSS (Flexbox & Grid), Bootstrap, responsive design, JavaScript, and accessibility best practices. Comfortable with version control (Git/GitHub) and development in VS Code.",
      tools: "HTML · CSS · JS · Bootstrap · Git · VS Code"
   },
   {
      title: "Product & Project Management",
      description: "Practical experience running sprints, prioritizing features, coordinating stakeholders, and maintaining clear communication across teams to deliver iterative product improvements on time.",
      tools: "Agile · Roadmapping · Sprint Planning"
   },
   {
      title: "WordPress Prep",
      description: "Familiar with WordPress theme anatomy, template hierarchy, block-based styling, and creating reusable components to convert static designs into dynamic, maintainable themes. Developing themes with PHP and deploying sites on AWS.",
      tools: "Themes · PHP · AWS · Block Styling"
   }
];

const SKILLS_STORAGE_KEY = "skills";

const skills = loadData(SKILLS_STORAGE_KEY) || defaultSkills.slice();

const skillsGrid = document.querySelector("#skillsGrid");

// holds the skill object currently being edited, or null when the form is just being used to add a brand new skill
let editingSkill = null;

function renderSkills(skillList) {
   skillsGrid.innerHTML = "";

   skillList.forEach(function (skill) {
      const col = document.createElement("div");
      col.classList.add("col");

      col.innerHTML = `
         <div class="card h-100">
            <div class="card-body">
               <h5 class="card-title">${skill.title}</h5>
               <p class="card-text">${skill.description}</p>
               <p class="card-text"><small class="text-body-secondary">Tools: ${skill.tools}</small></p>
               ${isUnlocked ? `
                  <div class="card-admin-actions">
                     <button class="edit-btn">Edit</button>
                     <button class="delete-btn">Delete</button>
                  </div>
               ` : ""}
            </div>
         </div>
      `;

      if (isUnlocked) {
         const editButton = col.querySelector(".edit-btn");
         const deleteButton = col.querySelector(".delete-btn");

         editButton.addEventListener("click", function () {
            startEditingSkill(skill);
         });

         deleteButton.addEventListener("click", function () {
            const realIndex = skills.indexOf(skill);
            skills.splice(realIndex, 1);
            saveData(SKILLS_STORAGE_KEY, skills);
            renderSkills(skills);
         });
      }

      skillsGrid.appendChild(col);
   });

   // re-attach the fade-in-on-scroll effect every time, since these are brand new elements each render 
   // a card that already scrolled into view before an edit would otherwise stay invisible after re-rendering
   const fadeCards = skillsGrid.querySelectorAll(".card");
   fadeCards.forEach(function (card) {
      fadeObserver.observe(card);
   });
}

// same fade-in-on-scroll pattern used 
// lives here since it needs to run again after every renderSkills() call
const fadeObserver = new IntersectionObserver(function (entries) {
   entries.forEach(function (entry) {
      if (entry.isIntersecting) {
         entry.target.classList.add("in-view");
      }
   });
});

const addSkillForm = document.querySelector("#addSkillForm");
const addSkillStatus = document.querySelector("#addSkillStatus");
const addSkillSubmitBtn = document.querySelector("#addSkillSubmitBtn");

// called by main.js's enterAdminMode()/exitAdminMode()
function showSkillsForm() {
   addSkillForm.classList.remove("hidden");
}

function hideSkillsForm() {
   addSkillForm.classList.add("hidden");
   editingSkill = null;
   addSkillSubmitBtn.textContent = "Add Skill";
   addSkillForm.reset();
}

function startEditingSkill(skill) {
   editingSkill = skill;

   document.querySelector("#formSkillTitle").value = skill.title;
   document.querySelector("#formSkillDescription").value = skill.description;
   document.querySelector("#formSkillTools").value = skill.tools;

   addSkillSubmitBtn.textContent = "Save Changes";
   addSkillStatus.textContent = `Editing "${skill.title}" - make your changes and click Save Changes.`;

   addSkillForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

addSkillForm.addEventListener("submit", function (event) {
   event.preventDefault();

   if (!addSkillForm.checkValidity()) {
      addSkillForm.reportValidity();
      return;
   }

   const titleValue = document.querySelector("#formSkillTitle").value.trim();
   const descriptionValue = document.querySelector("#formSkillDescription").value.trim();
   const toolsValue = document.querySelector("#formSkillTools").value.trim();

   const skillData = {
      title: titleValue,
      description: descriptionValue,
      tools: toolsValue
   };

   if (editingSkill) {
      const realIndex = skills.indexOf(editingSkill);
      skills[realIndex] = skillData;
      // update the status message to reflect that an existing skill was edited, not added

      addSkillStatus.textContent = `"${skillData.title}" was updated!`;
      editingSkill = null;
      addSkillSubmitBtn.textContent = "Add Skill";
   } else {
      skills.push(skillData);
      addSkillStatus.textContent = `"${skillData.title}" was added!`;
   }

   saveData(SKILLS_STORAGE_KEY, skills);
   addSkillForm.reset();
   renderSkills(skills);
});

// actually run it, now that skillsGrid and fadeObserver exist
renderSkills(skills);
