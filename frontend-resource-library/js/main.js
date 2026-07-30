import { getResources } from "./api.js"
import { renderResources } from "./render.js"
import { searchResources } from "./filters.js"
const statusMessage = document.querySelector("#statusMessage");
const searchInput = document.querySelector("#searchInput");
const resourceGrid = document.querySelector("#resourceGrid");

let allResources = [];

searchInput.addEventListener('input', function ()
{
    const query = searchInput.value.toLowerCase();
    const filteredResources = searchResources(allResources, query);
    renderResources(filteredResources);
});


// when a resource card is clicked, open the resource's URL in a new tab
resourceGrid.addEventListener("click", function (event)
{
  if (event.target.matches(".favorite-button"))
  {
    return; 
  }

  if (event.target.matches("a"))
  {
    return;
  }

  const card = event.target.closest("article");
  window.open(card.dataset.url, "_blank", "noopener,noreferrer");
});

async function loadResources() 
{
  allResources = await getResources();
  renderResources(allResources);
  statusMessage.textContent = allResources.length === 0 ? "No resources found." : "";
}

loadResources();