import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { aiRouter } from '@routers'

const app = new Koa();

// Global error handler
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});

app.use(bodyParser());
app.use(aiRouter.routes());
app.use(aiRouter.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
