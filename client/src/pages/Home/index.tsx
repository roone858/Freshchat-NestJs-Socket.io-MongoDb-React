import ServiceCard from "../../components/ServiceCard/ServiceCard";
import { ChatIcon, ErrorIcon, FeatureIcon } from "../../icons";
const Home = () => {
  return (
    <div className="min-h-screen dark:bg-[#262E35] flex flex-col justify-center items-center pt-20">
      <div className=" flex  flex-wrap justify-center items-center ">
        <div className="sm:col-span-12 md:col-span-6 lg:col-span-4 p-6 md:p-6 lg:p-12">
          <ServiceCard
            title="Messages"
            description="Go to this step by step guideline process on how to certify for your weekly benefits:"
            Icon={<ChatIcon />}
          />
        </div>
        <div className="sm:col-span-12 md:col-span-6 lg:col-span-4 p-6 md:p-6 lg:p-12">
          <ServiceCard
            title="Submit Error"
            description="Go to this step by step guideline process on how to certify for your weekly benefits:"
            Icon={<ErrorIcon />}
          />
        </div>
        <div className="sm:col-span-12 md:col-span-6 lg:col-span-4 p-6 md:p-6 lg:p-12">
          <ServiceCard
            title="Feature Request"
            description="Go to this step by step guideline process on how to certify for your weekly benefits:"
            Icon={<FeatureIcon />}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
