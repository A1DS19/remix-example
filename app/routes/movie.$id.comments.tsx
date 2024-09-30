import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useNavigation,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { useState } from "react";
import { HTMLFormMethod } from "~/types/html-form-method";
import { db } from "~/utils/db.server";

export async function loader({ params: { id } }: LoaderFunctionArgs) {
  const data = await db.comment.findMany({
    where: { movieId: id },
    orderBy: { createdAt: "desc" },
  });

  if (!data) {
    throw json("Movie not found", { status: 404 });
  }

  return json(data);
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return <h1>Movie not found</h1>;
      default:
        return <h1>Something went wrong</h1>;
    }
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  if (request.method === "POST") {
    return json(
      await db.comment.create({
        data: {
          message: formData.get("comment") as string,
          movieId: formData.get("movieId") as string,
        },
      }),
    );
  }

  if (request.method === "PATCH") {
    return json(
      await db.comment.update({
        where: { id: formData.get("id") as string },
        data: { message: formData.get("comment") as string },
      }),
    );
  }

  if (request.method === "DELETE") {
    return json(
      await db.comment.delete({
        where: { id: formData.get("id") as string },
      }),
    );
  }
}

export default function MovieCommentsRoute() {
  const { id } = useParams<{ id: string }>();
  const comments = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const [method, setMethod] = useState<HTMLFormMethod | undefined>("POST");
  const [comment, setComment] = useState({
    id: "",
    message: "",
    movieId: id,
  });

  const handleEdit = (comment: (typeof comments)[0]) => {
    setMethod("PATCH");
    setComment((prev) => ({ ...prev, ...comment }));
  };

  const handleOnCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment((prev) => ({ ...prev, message: e.target.value }));
  };

  return (
    <div className="rounded border p-3">
      <h1 className="text-xl font-semibold mb-5">Your Opinion</h1>
      <div>
        <Form method={method}>
          <textarea
            name="comment"
            className="w-full border border-teal-500 rounded-lg p-2"
            value={comment.message}
            onChange={handleOnCommentChange}
          ></textarea>
          <input type="hidden" name="movieId" value={comment.movieId} />
          <input type="hidden" name="id" value={comment.id} />
          <button
            type="submit"
            className="bg-teal-500 px-4 py-2 rounded-lg text-white"
            disabled={
              navigation.state === "submitting" ||
              navigation.state === "loading"
            }
          >
            {navigation.state === "submitting" ? "Submitting..." : "Submit"}
          </button>
        </Form>

        <div className="mt-5 flex flex-col gap-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="border p-3 rounded-lg">
              <div className="flex justify-between">
                <p>{comment.message}</p>

                <div>
                  <button
                    onClick={() => handleEdit(comment)}
                    className="w-5 h-5 cursor-pointer"
                  >
                    <img src="/icons/edit.svg" alt="Edit" />
                  </button>

                  <Form method="DELETE">
                    <input type="hidden" name="id" value={comment.id} />
                    <button type="submit" className="w-5 h-5 cursor-pointer">
                      <img src="/icons/delete.svg" alt="Delete" />
                    </button>
                  </Form>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
