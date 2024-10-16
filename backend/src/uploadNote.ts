import { getData } from './dataStore';

// using fetch to upload notes
async function uploadNotes(
  token: string,
  courseCode: string,
  tag: string,
  file: File,
  title: string,
  description: string
): Promise<void> {
  // create form data
  const formData = new FormData();
  formData.append("token", token);
  formData.append("courseCode", courseCode);
  formData.append("tag", tag);
  formData.append("file", file); // upload file
  formData.append("title", title);
  formData.append("description", description);

  try {
    // send post request to upload endpoint
    const response = await fetch("/api/uploadNotes", {
      method: "POST",
      headers: {
        // no need for Content-Type, because browser will automatically handle multipart/form-data
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const result = await response.json();
    console.log("File uploaded successfully: ", result);
  } catch (error) {
    console.error("Error uploading file: ", error);
  }
}

// handle user file selection and call uploadNotes
document.getElementById("fileInput")?.addEventListener("change", function (event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    // call uploadNotes function, assume other parameters are known
    uploadNotes("user-token", "CS101", "Lecture", file, "Lecture Notes", "These are the notes for week 1");
  }
});
