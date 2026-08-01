import userRouter from "./User.js";
import contactRouter from "./contact.js";
import productRouter from "./product.js";
import brandRouter from "./Brand.js";

const initRoutes = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/contact", contactRouter);
    app.use("/api/product", productRouter);
    app.use("/api/brand", brandRouter);
}
console.log("in index route");

export default initRoutes;