import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Image
        className="w-24 h-24"
        width={24}
        height={24}
        src="/loader.svg"
        alt="Loading..."
      />
      {/* <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div> */}
    </div>
  );
};

export default Loader;
