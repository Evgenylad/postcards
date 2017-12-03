import { Router } from 'express'
import { mainController } from '../controllers'


const router = Router()

router.get('/', mainController.runApp)
router.post('/makePostcard', mainController.makePostcard)

export default router
