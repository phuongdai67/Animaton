import Image from "next/image";
import Header from "../components/Header/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="home font-sans grid grid-rows-[auto_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 header-spacing">
        {/* Content sẽ được thêm vào đây */}
      </div>
    </>
  );
}
