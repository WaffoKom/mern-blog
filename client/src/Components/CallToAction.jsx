import { Button } from "flowbite-react";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

const CallToAction = forwardRef((props, ref) => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">What to learn more about JavaScript?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources in my github page
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <Link
            to="https://github.com/WaffoKom/"
            target="_blank"
            rel="noopener noreferrer"
            ref={ref}
          >
            My Github page
          </Link>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://th.bing.com/th/id/OIP.Bd3u9H0SL2H7X9Z_r7mpfQHaDt?rs=1&pid=ImgDetMain"
          alt=""
        />
      </div>
    </div>
  );
});

CallToAction.displayName = "CallToAction";

export { CallToAction };
