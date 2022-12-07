import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";

const books = new Map<string, any>();
books.set("1", {
  id: "1",
  title: "The Hound of the Baskervilles",
  author: "Conan Doyle, Arthur",
});

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Hello oak!</title><head>
      <body>
        <h1>Book</h1>
        ${JSON.stringify(Array.from(books.values()))}
      </body>
    </html>`;
  })
  .get("/:id", (context) => {
    if (books.has(context?.params?.id)) {
      context.response.body = books.get(context.params.id);
    }
  })
  .post("/", async (context) => {
    const body = await context.request.body().value;
    console.log("name : ", body.name);
    console.log("email : ", body.email);
    context.response.body = body;
  });

export { router as BookRouter };
