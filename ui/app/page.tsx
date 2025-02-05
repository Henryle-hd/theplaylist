import NavBar from "@/components/NavBar";
import SpotifyMusicPlayer from "@/components/Player";

export default function Page(){
  return(
    <div className="from-[#720822] via-[#550519] to-black flex flex-col justify-center items-center h-[100vh] bg-gradient-to-br">
    <NavBar />
    <div className="flex flex-col justify-center items-center h-[100vh] gap-10">
      <div className="relative w-full text-center hidden md:flex justify-center items-center flex-col mt-[10em] md:mt-0 ">
        <div className="relative w-96">
          <span className="absolute top-0 right-28 text-white/80 text-xl sm:text-3xl animate-pulse">✦</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-display text-white -mb-20 sm:mb-4">
          🎧
        </h1>
      </div>
    <SpotifyMusicPlayer />
    </div>
    </div>

  )
}