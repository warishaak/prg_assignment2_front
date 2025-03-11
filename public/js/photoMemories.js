// Get the Supabase URL from the server when needed
async function getSupabaseUrl() {
    try {
        const response = await fetch('/api/supabase_url');
        return (await response.json()).url;
    } catch (error) {
        console.error('Error fetching Supabase URL:', error);
        return null;
    }
}
//upload photo to the server
async function uploadPhoto() {
    const fileInput = document.getElementById("photoInput");
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    const formData = new FormData();
    const newFileName = `coffee-photos_${Date.now()}.png`;
    formData.append('photo', file, newFileName);

    try {
            // Send the file to the server
        const response = await fetch('/api/upload_photo', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        // Get the supabase URL for a permanent reference to the file
        const supabaseUrl = await getSupabaseUrl();
        const permanentUrl = `${supabaseUrl}/storage/v1/object/public/coffee-photos/${newFileName}`;

        addPhotoToGallery(permanentUrl, newFileName);
        fileInput.value = '';
    } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload photo');
    }
}

//Adds a photo to the gallery display
function addPhotoToGallery(imageUrl, fileName) {
    const gallery = document.querySelector("#photos");
    const wrapper = document.createElement("div");
    wrapper.className = "photo-wrapper";

    const img = document.createElement("img");
    img.src = imageUrl;
    img.className = "gallery-image";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-photo-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deletePhoto(fileName, wrapper);

    wrapper.appendChild(img);
    wrapper.appendChild(deleteBtn);
    gallery.appendChild(wrapper);
}

//Deletes a photo from the server and removes it from the display
async function deletePhoto(fileName, wrapper) {
    if (confirm('Are you sure you want to delete this photo?')) {
        try {
            const response = await fetch(`/api/photos/${fileName}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            wrapper.remove();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete photo');
        }
    }
}

//Loads existing photos from the server when the page loads
async function loadExistingPhotos() {
    try {
        const supabaseUrl = await getSupabaseUrl();
        const response = await fetch('/api/photos');
        const data = await response.json();

        data.forEach(photo => {
            const imageUrl = `${supabaseUrl}/storage/v1/object/public/coffee-photos/${photo.name}`;
            addPhotoToGallery(imageUrl, photo.name);
        });
    } catch (error) {
        console.error('Error loading photos:', error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("uploadButton").addEventListener("click", uploadPhoto);
    document.getElementById("photoInput").accept = ".png,image/png";
    loadExistingPhotos();
});