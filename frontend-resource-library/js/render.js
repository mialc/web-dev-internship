const resourceGrid = document.querySelector("#resourceGrid");

export function renderResources(resources)
{
resourceGrid.innerHTML = ""; // clear out whatever was there before re-rendering

  resources.forEach(function (resource) 
  {
    const card = document.createElement("article");
    card.dataset.url = resource.url;
    // add a data attribute to store the resource's URL
    card.innerHTML = `
      <h3>${resource.title}</h3>
      <p>${resource.topic}</p>
      <p>${resource.description}</p>
      <p>${resource.difficulty}</p>
      <a href="${resource.url}" target="_blank" rel="noopener noreferrer">View Resource</a>
      <button type="button" data-id="${resource.id}" class="favorite-button">Favorite</button>
        `;
    resourceGrid.appendChild(card);
  });
}