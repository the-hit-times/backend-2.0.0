function uploadImage() {
  const input = document.getElementById('imageInput');
  const link = document.getElementById('link');
  link.value = "Processing...."
  const file = input.files[0];

  const formData = new FormData();
  formData.append('image', file);

  fetch('/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      const imageLink = document.getElementById('link');
      imageLink.value = data.link;
    })
    .catch(error => console.error('Error:', error));
}
