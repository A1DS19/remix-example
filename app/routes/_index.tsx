import { json, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { IGetTrendingMovies } from "~/types/get-movies";

export const meta: MetaFunction = () => {
  return [
    { title: "Movies" },
    { name: "description", content: "Welcome to Movies!" },
  ];
};

export async function loader() {
  const data = await fetch(
    "https://api.themoviedb.org/3/trending/all/day?language=en-US",
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    },
  );

  return json(await data.json());
}

export default function Index() {
  const data = useLoaderData<typeof loader>() as IGetTrendingMovies;

  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="mb-10 md:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Top Trending Movies
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {data.results.map((movie) => (
            <div
              key={movie.id}
              className="flex flex-col overflow-hidden rounded-lg border bg-white"
            >
              <Link
                to={`/movie/${movie.id}/comments`}
                prefetch="intent"
                className="group relative block h-48 overflow-hidden bg-gray-100 md:h-64"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt=""
                  className="absolute inset-0 object-cover w-full object-center transition duration-200 group-hover:scale-110"
                />
              </Link>

              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                  <Link
                    to={`/movies/${movie.id}/comments`}
                    prefetch="intent"
                    className="transition duration-200 hover:text-indigo-500 active:text-indigo-600"
                  >
                    {movie.title || movie.original_title || movie.name}
                  </Link>
                </h2>

                <p className="text-gray-500 line-clamp-3">{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
