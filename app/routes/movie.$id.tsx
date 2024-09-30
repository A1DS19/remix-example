import { LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
  Link,
  Outlet,
} from "@remix-run/react";
import { IGetMovie } from "~/types/get-movie";

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    },
  );

  if (!data.ok) {
    throw json("Movie not found", { status: 404 });
  }

  return json(await data.json());
}

export default function Movie() {
  const movie = useLoaderData<typeof loader>() as IGetMovie;

  return (
    <div className="min-h-screen p-10">
      <img
        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
        alt=""
        className="h-[40vh] object-cover w-full rounded-lg"
      />

      <h1 className="text-4xl font-bold text-center p-5">{movie.title}</h1>
      <div className="flex gap-10 mt-10">
        <div className="w-1/2 font-medium">
          <h1>
            <span className="underline">Homepage:</span>
            <Link to={movie.homepage} target="_blank" rel="noreferrer">
              Movie
            </Link>
          </h1>

          <h1>
            <span className="underline">Original language:</span>
            {movie.original_language}
          </h1>

          <p>
            <span className="underline">Overview:</span>
            {movie.overview}
          </p>

          <p>
            <span className="underline">Release data:</span>
            {movie.release_date}
          </p>
        </div>

        <div className="w-1/2">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return (
          <div className="flex justify-center text-center">
            <div>
              <h1>Movie not found</h1>
              <p>{error.status}</p>
            </div>
          </div>
        );

      default:
        return <div>Something went wrong</div>;
    }
  }
}
