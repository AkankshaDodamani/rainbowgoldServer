import userRouter from "./user.js";
import contactRouter from "./contact.js";
import productRouter from "./product.js";

const initRoutes = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/contact", contactRouter);
    app.use("/api/product", productRouter);
}
console.log("in index route");

export default initRoutes;