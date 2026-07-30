// starter timeline data - used the very first time someone visits, or after
// saved timeline entries have been cleared
const defaultTimelineEntries = [
   {
      date: "Expected Spring 2027",
      title: "B.S. Information Technology — University of Central Florida",
      description: "Completing my degree while building real-world experience through internships and independent projects.",
      active: false
   },
   {
      date: "2026 – Present",
      title: "Front-End Web Dev Intern",
      description: "U.S. Hunger — Building real web projects using HTML, CSS, Bootstrap, and WordPress.",
      active: true
   },
   {
      date: "2025 – Present",
      title: "Founder & Developer — Recru",
      description: "Solo-built and launched a live iOS app on the App Store for Greek life recruitment.",
      active: false
   },
   {
      date: "2025 – Present",
      title: "VP of Recruitment, UCF Panhellenic",
      description: "Led formal recruitment for 800–900 PNMs across 12 chapters.",
      active: false
   },
   {
      date: "2025",
      title: "Software Engineering Intern, Zuleris Interactive",
      description: "Built interactive UI systems using Unity and C#.",
      active: false
   }
];

const TIMELINE_STORAGE_KEY = "timeline";

const timelineEntries = loadData(TIMELINE_STORAGE_KEY) || defaultTimelineEntries.slice();

const timelineList = document.querySelector("#timelineList");

// holds the timeline entry currently being edited, or null when the form is
// just being used to add a brand new one
let editingTimelineEntry = null;

function renderTimeline(entryList) {
   timelineList.innerHTML = "";

   entryList.forEach(function (entry) {
      const item = document.createElement("div");
      item.classList.add("timeline-item");
      if (entry.active) {
         item.classList.add("active");
      }

      item.innerHTML = `
         <span class="timeline-date">${entry.date}</span>
         <h4>${entry.title}</h4>
         <p>${entry.description}</p>
         ${isUnlocked ? `
            <div class="card-admin-actions">
               <button class="edit-btn">Edit</button>
               <button class="delete-btn">Delete</button>
            </div>
         ` : ""}
      `;

      if (isUnlocked) {
         const editButton = item.querySelector(".edit-btn");
         const deleteButton = item.querySelector(".delete-btn");

         editButton.addEventListener("click", function () {
            startEditingTimelineEntry(entry);
         });

         deleteButton.addEventListener("click", function () {
            const realIndex = timelineEntries.indexOf(entry);
            timelineEntries.splice(realIndex, 1);
            saveData(TIMELINE_STORAGE_KEY, timelineEntries);
            renderTimeline(timelineEntries);
         });
      }

      timelineList.appendChild(item);
   });
}

const addTimelineForm = document.querySelector("#addTimelineForm");
const addTimelineStatus = document.querySelector("#addTimelineStatus");
const addTimelineSubmitBtn = document.querySelector("#addTimelineSubmitBtn");

// called by main.js's enterAdminMode()/exitAdminMode()
function showTimelineForm() {
   addTimelineForm.classList.remove("hidden");
}

function hideTimelineForm() {
   addTimelineForm.classList.add("hidden");
   editingTimelineEntry = null;
   addTimelineSubmitBtn.textContent = "Add Timeline Entry";
   addTimelineForm.reset();
}

function startEditingTimelineEntry(entry) {
   editingTimelineEntry = entry;

   document.querySelector("#formTimelineDate").value = entry.date;
   document.querySelector("#formTimelineTitle").value = entry.title;
   document.querySelector("#formTimelineDescription").value = entry.description;
   document.querySelector("#formTimelineActive").checked = entry.active;

   addTimelineSubmitBtn.textContent = "Save Changes";
   addTimelineStatus.textContent = `Editing "${entry.title}" - make your changes and click Save Changes.`;

   addTimelineForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

addTimelineForm.addEventListener("submit", function (event) {
   event.preventDefault();

   if (!addTimelineForm.checkValidity()) {
      addTimelineForm.reportValidity();
      return;
   }

   const dateValue = document.querySelector("#formTimelineDate").value.trim();
   const titleValue = document.querySelector("#formTimelineTitle").value.trim();
   const descriptionValue = document.querySelector("#formTimelineDescription").value.trim();
   const isActiveValue = document.querySelector("#formTimelineActive").checked;

   // if the new/edited entry is marked as active, make sure all other entries are set to inactive
   if (isActiveValue) {
      timelineEntries.forEach(function (entry, index) {
         if (entry.active && entry !== editingTimelineEntry) {
            timelineEntries[index] = {
               date: entry.date,
               title: entry.title,
               description: entry.description,
               active: false
            };
         }
      });
   }

   const entryData = {
      date: dateValue,
      title: titleValue,
      description: descriptionValue,
      active: isActiveValue
   };

   if (editingTimelineEntry) {
      const realIndex = timelineEntries.indexOf(editingTimelineEntry);
      timelineEntries[realIndex] = entryData;

      addTimelineStatus.textContent = `"${entryData.title}" was updated!`;
      editingTimelineEntry = null;
      addTimelineSubmitBtn.textContent = "Add Timeline Entry";
   } else {
      timelineEntries.push(entryData);
      addTimelineStatus.textContent = `"${entryData.title}" was added!`;
   }// save the updated timelineEntries array to localStorage and re-render the timeline

   saveData(TIMELINE_STORAGE_KEY, timelineEntries);
   addTimelineForm.reset();
   renderTimeline(timelineEntries);
});

// actually run it, now that timelineList exists
renderTimeline(timelineEntries);
