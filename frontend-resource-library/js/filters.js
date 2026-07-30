export function searchResources(resources, query) {
  const lowerQuery = query.toLowerCase();

  const filteredResources = resources.filter(function (resource) {
    const titleMatch = resource.title.toLowerCase().includes(lowerQuery);
    const topicMatch = resource.topic.toLowerCase().includes(lowerQuery);
    const descriptionMatch = resource.description.toLowerCase().includes(lowerQuery);

    return titleMatch || topicMatch || descriptionMatch;
  });

  if (filteredResources.length === 0) {
    return [
      {
        title: 'No results found',
        topic: '',
        description: ''
      }
    ];
  }

  return filteredResources;
}
