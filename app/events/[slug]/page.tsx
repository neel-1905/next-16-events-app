import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={14} height={14} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <section className="agenda">
    <h2>Agenda</h2>
    <ul className="">
      {agendaItems?.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </section>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div key={tag} className="pill">
        {tag}
      </div>
    ))}
  </div>
);

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  console.log(slug);

  const request = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );
  const { data } = await request.json();
  const {
    description,
    overview,
    image,
    title,
    venue,
    location,
    date,
    time,
    mode,
    audience,
    agenda,
    organizer,
    tags,
  } = data;

  if (!description) notFound();

  const bookings = 10;

  const similarEvents = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* left side */}
        <div className="content">
          <Image
            src={image}
            alt={title}
            width={800}
            height={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="Calendar"
              label={date}
            />

            <EventDetailItem icon="/icons/clock.svg" alt="Time" label={time} />

            <EventDetailItem
              icon="/icons/pin.svg"
              alt="Location"
              label={location}
            />

            <EventDetailItem icon="/icons/mode.svg" alt="Mode" label={mode} />

            <EventDetailItem
              icon="/icons/audience.svg"
              alt="Audience"
              label={audience}
            />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/* right side */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>

            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the First to Book Your Spot!</p>
            )}

            <BookEvent />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <div className="events">
          {similarEvents?.length > 0 &&
            similarEvents.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default page;
