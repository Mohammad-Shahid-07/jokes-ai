import Image from "next/image";
import "./animated-stars.css";
import JokeGen from "@/components/JokeGen";
import UserMenu from "@/components/user/UserMenu";
import { JokeList } from "@/components/JokeList";
import LoggedIn from "@/components/control/LoggedIn";
import LoggedOut from "@/components/control/LoggedOut";
import Link from "next/link";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="flex max-lg:text-center  max-lg:flex-col max-w-screen-xxl xxl:mx-auto paddings justify-center items-center mt-5">
        <div>
          <h1 className="text-white font-extrabold text-5xl">
            Genrate A Joke, With AI
          </h1>
          <LoggedOut>
            <div className="text-white/80 font-abold text-3xl mt-5 mx-auto text-center">
              login to get started
            </div>
            <Link
              href="/login"
              className="text-white/80 bg-orange-500 block text-center p-2 rounded-md font-abold text-xl mt-5"
            >
              Login
            </Link>
          </LoggedOut>
          <div>
            <LoggedIn>
              <JokeGen />
            </LoggedIn>
          </div>
          <LoggedIn>
            <JokeList />
          </LoggedIn>
        </div>
      </section>
      <div className="overflow-hidden bg-animation -z-10">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
        <div id="stars4"></div>
      </div>
    </main>
  );
}
