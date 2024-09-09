import express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any;  // Puedes especificar el tipo exacto si lo deseas
        }
    }
}
