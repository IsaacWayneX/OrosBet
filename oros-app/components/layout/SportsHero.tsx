import Image from "next/image";

const SPORTS = [
  { id: 1, name: "Soccer", image: "/images/Container(1).png" },
  { id: 2, name: "Tennis", image: "/images/Container(2).png" },
  { id: 3, name: "Baseball", image: "/images/Container(3).png" },
  { id: 4, name: "Cricket", image: "/images/Container(4).png" },
  { id: 5, name: "Basketball", image: "/images/Container(5).png" },
  { id: 6, name: "MMA", image: "/images/Container(6).png" },
  { id: 7, name: "American Football", image: "/images/Container(7).png" },
];

export function SportsHero() {
  return (
    <div className="w-full overflow-hidden mb-6">
      <div className="flex gap-[15px] justify-end">
        {SPORTS.map((sport) => (
          <a
            key={sport.id}
            href="#"
            className="flex-none flex flex-col justify-center items-start cursor-pointer group"
          >
            <div className="relative w-[163.5px] h-[253.5px] rounded-lg overflow-hidden isolation-isolate flex-shrink-0">
              {/* Background Image */}
              <Image
                src={sport.image}
                alt={sport.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-0" />
              
              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-between items-start p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {/* Sport Name */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[14.4px] font-semibold text-white leading-6 capitalize">
                    {sport.name}
                  </h3>
                </div>
                
                {/* Icon Badge */}
                <div className="flex justify-center items-center w-5 h-5 rounded-lg bg-transparent">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6 12 6.67 12 7.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5 5.67 9 6.5 9zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
