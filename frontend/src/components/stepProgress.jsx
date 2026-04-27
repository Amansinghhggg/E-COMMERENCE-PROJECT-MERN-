import {useSelector} from "react-redux";

const ProgressSteps = ({ step1, step2, step3 }) => {
    const {userInfo} = useSelector((state) => state.auth);

  return (
    <div className="flex justify-center items-center space-x-4">
      <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
        <span className="ml-2">{userInfo ? "Login" : "Sign Up"}</span>
        {step1 && <div className="mt-2 text-lg text-center">✅</div>}
      </div>

      {step2 && (
        <>
          {step1 && <div className="h-0.5 w-[10rem] bg-green-500"></div>}
          <div className={`${step1 ? "text-green-500" : "text-gray-300"}`}>
            <span>Shipping</span>
            <div className="mt-2 text-lg text-center">✅</div>
          </div>
        </>
      )}

      <>
        {step1 && step2 && step3 ? (
          <div className="h-0.5 w-[10rem] bg-green-500"></div>
        ) : (
          ""
        )}

        <div className={`${step3 ? "text-green-500" : "text-gray-300"}`}>
          <span className={`${!step3 ? "ml-[10rem]" : ""}`}>Summary</span>
          {step1 && step2 && step3 ? (
            <div className="mt-2 text-lg text-center">✅</div>
          ) : null}
        </div>
      </>
    </div>
  );
};

export default ProgressSteps;