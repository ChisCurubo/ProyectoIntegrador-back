import { Router } from "express";
import { Controller } from "../controllers/controller";
import { body , param } from 'express-validator';

const routes = Router({ strict: true });


routes.post(
    "/create",
[
    body("title", "Must not be empty.").trim().not().isEmpty().escape(),
    body("body", "Must not be empty.").trim().not().isEmpty().escape(),
    body("author", "Must not be empty.").trim().not().isEmpty().escape(),
],
    Controller.create
)

routes.get(
    "/showLibros",
    Controller.showLibros
)

routes.put(
    "/edit/:title",
    [
        param("title", "Must not be empty.").trim().not().isEmpty().escape(),
        body("body", "Must not be empty.").trim().not().isEmpty().escape(),
        body("author", "Must not be empty.").trim().not().isEmpty().escape(),
    ],
    Controller.editLibro
);

routes.delete(
    "/delete/:title",
    param("title", "Must not be empty.").trim().not().isEmpty().escape(),
    Controller.deleteLibro
);


export default routes;