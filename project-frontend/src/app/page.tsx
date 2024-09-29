import Image from "next/image";
import Spline from '@splinetool/react-spline/next';

export default function Home() {
  return (
    <div>
      <Spline
        className="absolute"
        scene="https://prod.spline.design/p7c4ssNZ0jtRSYUv/scene.splinecode"
      />

      <div className="flex relative top-[330px] left-[215px] raleway-font">
        Empowering Organizations to Stay Ahead <br/>of Cyber Threats
      </div>

      <div className="flex relative top-96 left-[215px]">
        <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#4242FF,45%,#1e2631,55%,#4242FF)] bg-[length:200%_100%] px-6 font-medium text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          Get it to your Business
        </button>
      </div>
    </div>
  );
}
