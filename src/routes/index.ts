import {Router} from 'express';
import appointmentsRouter from './appointments.route';

const routes = Router()

routes.use('/appointments', appointmentsRouter);

export default routes
