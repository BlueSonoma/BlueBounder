export async function getData(url) {
  return await fetch(url, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => data[0])
    .catch((error) => {
      console.error('Error:', error);
    });
}