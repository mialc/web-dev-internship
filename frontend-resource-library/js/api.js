// loads resource data from the local JSON file
export async function getResources() 
{
  try 
  {
    const response = await fetch("./data/resources.json");

    if (!response.ok) 
    {
      throw new Error("Could not load resources.");
    }

    const resources = await response.json();
    return resources;
  } 
  
  catch (error) 
  {
    console.error(error);
    return [];
  }
  
}
