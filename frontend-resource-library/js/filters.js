export function searchResources(resources, query) {
  const lowerQuery = query.toLowerCase();

  return resources.filter(function (resource) 
  {
    const titleMatch = resource.title.toLowerCase().includes(lowerQuery);
    const topicMatch = resource.topic.toLowerCase().includes(lowerQuery);
    const descriptionMatch = resource.description.toLowerCase().includes(lowerQuery);
    
    return titleMatch || topicMatch || descriptionMatch;
  });
}
