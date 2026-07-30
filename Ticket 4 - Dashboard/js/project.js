// the starter project data used the very first time someone visits, or after the saved data has been cleared
const defaultProjects = [
   {
      title: "Recru",
      subtitle: "Founder & Developer",
      category: "JavaScript",
      skills: ["Mobile UX/UI Design", "Expo", "React Native", "Firebase", "App Store Connect", "TestFlight"],
      status: "Complete",
      description: "Designed and launched a mobile-first recruitment companion app for Greek life, using Expo, React Native, and Firebase. Built structured notes, chapter filtering, user personalization, and custom theme support. Onboarded early adopters, supported live users, and scaled the app to new campuses across the U.S.",
      links: [
         { label: "View on App Store", url: "https://apps.apple.com/us/app/recru/id6769208783" },
         { label: "View Website", url: "https://recruapp.com" }
      ]
   },

   {
      title: "Nonprofit Homepage Mockup",
      category: "HTML/CSS",
      skills: ["HTML", "CSS", "Grid", "Flexbox", "Responsive Design", "Accessibility", "Semantic HTML"],
      status: "Complete",
      description: "Built a responsive nonprofit landing page with modern web best practices, clean visual hierarchy, and accessible interactions. Used semantic HTML5, CSS Grid, and Flexbox for mobile-first layouts. Includes a polished hero, program cards with hover effects, and an inclusive contact form with ARIA labels.",
      links: [
         { label: "View Live Site", url: "https://mialc.github.io/nonprofit-landing-mockup/" },
         { label: "View Code", url: "https://github.com/mialc/nonprofit-landing-mockup" }
      ]
   },

   {
      title: "Android Minesweeper",
      category: "JavaScript",
      skills: ["Java", "Android Studio", "Game Logic", "UI Layouts"],
      status: "Complete",
      description: "Built a fully playable Minesweeper game for Android in Java, handling grid generation, recursive tile reveal, flagging, win/loss detection, and game-state logic from scratch.",
      links: [
         { label: "View Code", url: "https://github.com/mialc/android-minesweeper-game" }
      ]
   },

   {
      title: "Uhustle",
      subtitle: "Student Opportunity Hub",
      category: "HTML/CSS",
      skills: ["Figma", "Mobile UX/UI Design", "Auto Layout", "Prototyping"],
      status: "In Progress",
      description: "Designed an iOS prototype that gives students a single feed for gigs, jobs, clubs, and campus events, with one-tap redirects to the right app or form instead of competing with Instagram and LinkedIn for attention.",
      links: [
         { label: "View in Figma", url: "https://www.figma.com/design/ap5YHXlfq4FHcYbN5Eoubj/Uhustle-Protype?node-id=0-1" },
         { label: "View Code", url: "https://github.com/mialc/Uhustle" }
      ]
   },

   {
      title: "Project Dashboard",
      category: "JavaScript",
      skills: ["JavaScript", "DOM", "localStorage"],
      status: "In Progress",
      description: "A dynamic dashboard that renders, filters, and sorts projects.",
      links: []
   }
];

const PROJECTS_STORAGE_KEY = "projects";

// grab the saved projects from localStorage, or use a copy of the defaults if nothing has been saved yet
const projects = loadData(PROJECTS_STORAGE_KEY) || defaultProjects.slice();
const dashboardGrid = document.querySelector("#dashboardGrid");

// holds the project object currently being edited, or null when the form is just being used to add a brand new project
let editingProject = null;

// render the projects into the dashboard grid
function renderProjects(projectList) {
   dashboardGrid.innerHTML = "";
   // clears grid first

   projectList.forEach(function (project) 
   {
      // make a new empty card element
      const card = document.createElement("article");
      card.classList.add("dashboard-card");

      // combine title + subtitle the way the old cards did, e.g. "Recru — Founder & Developer"
      const heading = project.subtitle ? `${project.title} — ${project.subtitle}` : project.title;

      // turn each link into a button, then only show the row if there are any
      const linksHtml = project.links.map(function (link) 
      {
         return `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`;
      }).join("");

      // fill it with the project's info
      card.innerHTML = `
         <h3>${heading}</h3>
         <p class="card-category">${project.category}</p>
         <p class="card-status">${project.status}</p>
         <p class="card-description">${project.description}</p>
         <p class="card-skills">${project.skills.join(", ")}</p>
         ${linksHtml ? `<div class="card-actions">${linksHtml}</div>` : ""}
         ${isUnlocked ? `
            <div class="card-admin-actions">
               <button class="edit-btn">Edit</button>
               <button class="delete-btn">Delete</button>
            </div>
         ` : ""}
      `;

      // only add edit/delete when those buttons actually exist (isUnlocked is true)
      if (isUnlocked) 
         {
         const editButton = card.querySelector(".edit-btn");
         const deleteButton = card.querySelector(".delete-btn");

         editButton.addEventListener("click", function () 
         {
            startEditingProject(project);
         });

         deleteButton.addEventListener("click", function () 
         {
            // remove the project from the real array, not just the filtered copy being rendered
            const realIndex = projects.indexOf(project);
            projects.splice(realIndex, 1);

            // save the updated array so the deletion survives a refresh
            saveData(PROJECTS_STORAGE_KEY, projects);

            // re-run filter -> search -> sort -> render so the card disappears
            updateDashboard();
         });
      }

      // add the finished card into the grid
      dashboardGrid.appendChild(card);
   });
}

// state tracker
let currentFilter = "All";
let searchTerm = "";
let currentSort = "";

// grab the filter buttons, search input, sort dropdown, and add-project form from the html
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.querySelector("#dashboardSearch");
const sortSelect = document.querySelector("#dashboardSort");
const addProjectForm = document.querySelector("#addProjectForm");
const addProjectStatus = document.querySelector("#addProjectStatus");
const addProjectSubmitBtn = document.querySelector("#addProjectSubmitBtn");

// called by main.js's enterAdminMode()/exitAdminMode() - keeping the form
// itself owned by project.js, since it's the file that knows what to reset
function showProjectForm() {
   addProjectForm.classList.remove("hidden");
}

function hideProjectForm() {
   addProjectForm.classList.add("hidden");
   editingProject = null;
   addProjectSubmitBtn.textContent = "Add Project";
   addProjectForm.reset();
}

// fills the form with an existing project's data so it can be changed, instead of creating a new one
function startEditingProject(project) {
   editingProject = project;

   document.querySelector("#formTitle").value = project.title;
   document.querySelector("#formCategory").value = project.category;
   document.querySelector("#formStatus").value = project.status;
   document.querySelector("#formSkills").value = project.skills.join(", ");
   document.querySelector("#formDescription").value = project.description;

   const firstLink = project.links[0];
   document.querySelector("#formLinkLabel").value = firstLink ? firstLink.label : "";
   document.querySelector("#formLinkUrl").value = firstLink ? firstLink.url : "";

   addProjectSubmitBtn.textContent = "Save Changes";
   addProjectStatus.textContent = `Editing "${project.title}" - make your changes and click Save Changes.`;

   addProjectForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

// clears the saved data and resets the dashboard back to the starter projects
// this button lives inside #addProjectForm, so it's only reachable at all once admin mode has already been unlocked, same as the edit/delete buttons
const clearStorageBtn = document.querySelector("#clearStorageBtn");

clearStorageBtn.addEventListener("click", function () {
   const confirmed = confirm("This will remove all saved projects and reset the dashboard to the defaults. Continue?");
   if (!confirmed) return;

   clearData(PROJECTS_STORAGE_KEY);

   // empty the real array out, then refill it with fresh copies of the defaults
   projects.length = 0;
   defaultProjects.forEach(function (project) {
      projects.push(project);
   });

   addProjectStatus.textContent = "Saved projects cleared - back to defaults.";
   updateDashboard();
});

// renders what's left after filtering and searching
function updateDashboard() {
   let result = projects;

   // 1: filter by category or status unless "All"
   if (currentFilter !== "All") {
      result = result.filter(function (project) {
         return project.category === currentFilter || project.status === currentFilter;
      });
   }

   // 2: narrow down by the search term
   if (searchTerm !== "") {
      result = result.filter(function (project) {
         return project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.skills.join(" ").toLowerCase().includes(searchTerm);
      });
   }

   // 3: sort whatever made it through the filter + search above
   if (currentSort !== "")
    {
      // .slice() copies it first so sort() only touches the copy.
      result = result.slice();

      if (currentSort === "titleAsc")
        {
         result.sort(function (a, b)
         {
            return a.title.localeCompare(b.title);
         });
        }
      else if (currentSort === "titleDesc")
        {
         result.sort(function (a, b)
         {
            return b.title.localeCompare(a.title);
         });
        }
      else if (currentSort === "status")
        {
         result.sort(function (a, b)
         {
            return a.status.localeCompare(b.status);
         });
        }
   }

   // render wtv is left
   renderProjects(result);
}



// when filter button is clicked
filterButtons.forEach(function (button) {
   button.addEventListener("click", function () {
      // update the state to the button's filter value
      currentFilter = button.dataset.filter;

      // adds or removes active class to show hightlighted button
      filterButtons.forEach(function (btn) {
         btn.classList.remove("active");
      });
      button.classList.add("active");

      // state is updated
      updateDashboard();
   });
});

// search
searchInput.addEventListener("input", function () {
   searchTerm = searchInput.value.toLowerCase();
   updateDashboard();
});

// sort
sortSelect.addEventListener("change", function () {
   currentSort = sortSelect.value;
   updateDashboard();
});

// add project (or save changes, if editingProject is set)
addProjectForm.addEventListener("submit", function (event) {
   // stop the browser's default full-page reload on submit
   event.preventDefault();

   // the form has novalidate, so the browser won't auto-block a bad submit -
   // checkValidity() runs that same required-field check on demand, and
   // reportValidity() shows the normal browser error bubbles if it fails
   if (!addProjectForm.checkValidity()) {
      addProjectForm.reportValidity();
      return;
   }

   // read every field's current value
   const titleValue = document.querySelector("#formTitle").value.trim();
   const categoryValue = document.querySelector("#formCategory").value;
   const statusValue = document.querySelector("#formStatus").value;
   const skillsValue = document.querySelector("#formSkills").value;
   const descriptionValue = document.querySelector("#formDescription").value.trim();
   const linkLabelValue = document.querySelector("#formLinkLabel").value.trim();
   const linkUrlValue = document.querySelector("#formLinkUrl").value.trim();

   // turn "HTML, CSS, JavaScript" into ["HTML", "CSS", "JavaScript"]; skip if left blank
   const skillsList = skillsValue === "" ? [] : skillsValue.split(",").map(function (skill) {
      return skill.trim();
   });

   // both link fields are optional - only build a link if a URL was actually
   // given; fall back to a generic label if the URL was filled in but the
   // label was left blank
   const linksList = linkUrlValue === "" ? [] : [
      { label: linkLabelValue === "" ? "View Project" : linkLabelValue, url: linkUrlValue }
   ];

   // this object's keys match the shape every project in the array already
   // uses, but the values come from whatever was just typed
   const projectData = {
      title: titleValue,
      category: categoryValue,
      skills: skillsList,
      status: statusValue,
      description: descriptionValue,
      links: linksList
   };

   if (editingProject) {
      // replace the OLD object at this position with the new one, rather
      // than editing editingProject's properties in place - defaultProjects
      // might still be pointing at that old object, and this way it's never
      // accidentally changed (same lesson as the earlier Clear Saved bug)
      const realIndex = projects.indexOf(editingProject);
      projects[realIndex] = projectData;

      addProjectStatus.textContent = `"${projectData.title}" was updated!`;
      editingProject = null;
      addProjectSubmitBtn.textContent = "Add Project";
   } else {
      // push() adds projectData onto the end of the real projects array, in
      // place - unlike filter()/slice(), there's no copy here
      projects.push(projectData);
      addProjectStatus.textContent = `"${projectData.title}" was added!`;
   }

   // save the updated array so the change survives a refresh
   saveData(PROJECTS_STORAGE_KEY, projects);

   // clear every field back to empty so the form is ready for the next project
   addProjectForm.reset();

   // re-run filter -> search -> sort -> render on the updated projects array
   updateDashboard();
});

// actually run it, now that state and controls exist
updateDashboard();
