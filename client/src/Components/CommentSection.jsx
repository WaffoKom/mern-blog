import { Textarea, Button, Alert } from "flowbite-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (comment.length > 200) {
        return;
      }
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as :</p>
          <img
            src={currentUser.profilePicture}
            alt=""
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in comment.
          <Link to={"/signin"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment ...."
            rows="3"
            maxLength="300"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="">
            <p className="text-gray-500 text-xs">
              300-{comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && (
            <Alert color="failure " className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}