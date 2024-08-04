export class Controller{
    static libros : any[] = [];
    static create = async ([req, res, next] : any ) => {
        try {
            console.log("Holaa");
            this.libros.push(req.body);
            console.log(this.libros);
            res.status(201).json({
                ok: 1,
                status: 201,
                message: "Libro creado bien.",
            });
        } catch (e) {
            next(e);
        }
    };

    
    static showLibros = ([req, res, next] : any) => {
        try {
            console.log("HOLAAAA");
            // this.libros.forEach(libro => {
            //     console.log(libro);
            // })
            res.status(201).json({
                ok: 1,
                status: 201,
                message: "Libros mostrados en la terminal.",
            });
        } catch (error) {
            next(error);
        }
    }

    static editLibro = async ([req, res, next] : any) => {
        try {
            const { title } = req.params;
            const { body, author } = req.body;

            const editedLibro = this.libros.find((libro) => libro.title === title);
            if (editedLibro) {
                editedLibro.body = body;
                editedLibro.author = author;

                console.log(this.libros);
                res.status(200).json({
                    ok: 1,
                    status: 200,
                    message: "Libro editado con éxito.",
                });
            } else {
                res.status(404).json({
                    ok: 0,
                    status: 404,
                    message: "Libro no encontrado.",
                });
            }
        } catch (e) {
            next(e);
        }
    };

    static deleteLibro = async ([req, res, next] : any) => {
        try {
            const { title } = req.params;

            const index = this.libros.findIndex((libro) => libro.title === title);
            if (index !== -1) {
                this.libros.splice(index, 1);
                console.log(this.libros);
                res.status(200).json({
                    ok: 1,
                    status: 200,
                    message: "Libro eliminado con éxito.",
                });
            } else {
                res.status(404).json({
                    ok: 0,
                    status: 404,
                    message: "Libro no encontrado.",
                });
            }
        } catch (e) {
            next(e);
        }
    };
}