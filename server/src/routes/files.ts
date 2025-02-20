import { Router } from 'express';
import path from 'path';

const router = Router();

router.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', filename);
    res.sendFile(filePath, err => {
        if (err) {
            res.status(404).send('Файл не найден');
        }
    });
});

export default router;
