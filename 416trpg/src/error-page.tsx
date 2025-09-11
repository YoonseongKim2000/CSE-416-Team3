// Yoonseong Kim, yoonseong.kim.1@stonybrook.com
import { useRouteError } from "react-router-dom";

// This page will pop up when some function goes wrong or you somehow navigate to a non existing page.
interface Error {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as Error;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred. You have either entered an invalid address or somehow really broke the website!</p>
      <p>
        <i>{error?.statusText || error?.message}</i>
      </p>
    </div>
  );
}
