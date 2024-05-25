import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase.js";
import { FileInput, Select, TextInput, Button, Alert } from "flowbite-react";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CreatePost() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileUPloadProgress, setFileUploadProgress] = useState(null);
  const [fileUPloadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [PublishError, setPublishError] = useState(null);

  // console.log(formData);
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setFileUploadError("Please select an image");
        return;
      }
      setFileUploading(true);
      setFileUploadError(null);
      const storage = getStorage(app);
      const fileName = `${file.name}-${new Date().getTime()}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress.toFixed(0));
          // console.log(`Upload is ${progress.toFixed(0)} done`);
        },
        (error) => {
          setFileUploadError(
            "couldn't upload image (File must be less than 4MB)"
          );
          setFileUploadProgress(null);
          setFile(null);

          setFileUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUploading(false);
            setFileUploadProgress(null);
            setFileUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setFileUploadError({
        message: "Image upload failed",
        error: error.message,
      });
      setFileUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setFileUploadError("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Uncategorized</option>
            <option value="redux">Redux</option>
            <option value="javascript">Javascript</option>
            <option value="reactjs">ReactJS</option>
            <option value="nextjs">NextJS</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={fileUPloadProgress}
          >
            {fileUPloadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={fileUPloadProgress}
                  text={`${fileUPloadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
          {fileUPloadError && <Alert color="failure">{fileUPloadError}</Alert>}
        </div>
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {PublishError && (
          <Alert className="mt-5" color="failure">
            {PublishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
