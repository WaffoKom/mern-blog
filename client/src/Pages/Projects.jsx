import { CallToAction } from "../Components/CallToAction.jsx";
import { useEffect, useRef } from "react";

export default function Projects() {
  const customButtonRef = useRef(null);
  useEffect(() => {
    if (customButtonRef.current) {
      // console.log(customButtonRef.current);
    }
  }, []);
  return (
    <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <p className="text-md text-gray-500">
        Build fun and engaging projects while learning HTML, CSS, and
        JavaScript!
      </p>
      <>
        <CallToAction ref={customButtonRef} />
      </>
    </div>
  );
}
