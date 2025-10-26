import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";

const Home = () => {
  return (
    <section id="home">
      <h1 className="text-center capitalize">
        The hub for every dev <br /> event you can't miss
      </h1>
      <p className="capitalize text-center mt-5">
        Hackathons, meetups, and conferences, all in one place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events list-none">
          {events.map((item) => (
            <li key={crypto.randomUUID()}>
              <EventCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
