"use client";

import Image from "next/image";

const ExploreBtn = () => {
  return (
    <button className="mt-7 mx-auto" id="explore-btn">
      <a href="#events">Explore Events</a>
      <Image
        src={`/icons/arrow-down.svg`}
        alt="arrow-down"
        width={24}
        height={24}
      />
    </button>
  );
};

export default ExploreBtn;
