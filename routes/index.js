import userRouter from "./user.js";
import contactRouter from "./contact.js";

const initRoutes = (app) => {
    app.use("/api/user", userRouter);
    app.use("/api/contact", contactRouter);
}

export default initRoutes;