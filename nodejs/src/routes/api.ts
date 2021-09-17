import { Router } from 'express';
import * as ApiController from '../controller/apiController';

const router = Router();

router.get('/ping', ApiController.ping);

router.post('/createProduct', ApiController.createProduct);
router.get('/products', ApiController.listProducts);
router.get('/products/:categ', ApiController.getProdCateg);
router.post('/register', ApiController.register);
router.post('/login', ApiController.login);

export default router;

