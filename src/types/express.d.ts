import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Puedes usar un tipo más específico en lugar de `any` si tienes uno definido
        }
    }
}
