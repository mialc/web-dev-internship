import { getResources } from "./api.js"
import { renderResources } from "./render.js"
import { searchResources } from "./filters.js"
const statusMessage = document.querySelector("#statusMessage");

let allResources = [];
const searchInput = document.querySelector("#searchInput");

searchInput.addEventListener('input', function () 
{
    const query = searchInput.value.toLowerCase();
    const filteredResources = searchResources(allResources, query);
    renderResources(filteredResources);
});

async function loadResources() 
{
  allResources = await getResources();
  renderResources(allResources);
  statusMessage.textContent = allResources.length === 0 ? "No resources found." : "";
}

loadResources();