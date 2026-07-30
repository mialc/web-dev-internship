import { getResources } from "./api.js"
import { renderResources } from "./render.js"
import { searchResources } from "./filters.js"

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
}

loadResources();