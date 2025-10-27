import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";
import { events } from "@/lib/constants";

const Home = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`
  );
  const { data } = await response.json();

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
          {data.map((event: IEvent) => (
            <li key={crypto.randomUUID()}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
