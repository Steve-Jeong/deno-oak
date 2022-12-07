import { Application, Router, send } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import {
  ejsEngine,
  oakAdapter,
  viewEngine,
} from "https://deno.land/x/view_engine@v10.5.1/mod.ts";
import { BookRouter } from "./routes/book.ts";

const app = new Application();
app.use(
  viewEngine(
    oakAdapter,
    ejsEngine,
    {
      viewRoot: "./views",
    },
  ),
);

// Logger
app.use(async (ctx, next) => {
  console.log("1");
  await next();
  console.log("2");
  const rt = ctx.response.headers.get("X-Response-Time-jst");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  console.log("3");
  const start = Date.now();
  await next();
  console.log("4");
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time-jst", `${ms}ms123`);
});

// Hello World!
app.use(async (ctx, next) => {
  console.log("5");
  ctx.response.body = "app.use('hello world')";
  console.log("6");
  await next();
  console.log("7");
});

// static file server
const ROOT_DIR = "", ROOT_DIR_PATH = "/public";
app.use(async (ctx, next) => {
  console.log('8');
  console.log('ctx.request.url.pathname : ', ctx.request.url.pathname);
  // if (!ctx.request.url.pathname.startsWith(ROOT_DIR_PATH)) {
  //   console.log('9');
  //   next();
  //   return;
  // }
  // const filePath = ctx.request.url.pathname.replace(ROOT_DIR_PATH, "");
  const filePath = '/public';
  console.log('filePath : ', filePath);
  await send(ctx, filePath, {
    root: ROOT_DIR,
  });
});

const router = new Router();
router
  .get("/", async (context, next) => {
    console.log("middleware");
    await next();
  }, (context) => {
    console.log("after middleware");
    context.response.body = `<!DOCTYPE html>
      <html>
        <head><title>Hello oak!</title><head>
        <body>
          <h1>Hello oak!</h1>
        </body>
      </html>
    `;
  })
  .get("/about", (context) => {
    context.render("about.ejs", { name: "Steve" });
  });

router.use("/book", BookRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 3001
console.log(`Server is listening on http://localhost:${PORT}`);
await app.listen({ port: PORT });
