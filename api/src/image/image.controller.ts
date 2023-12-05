import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('images')
export class ImageController {
  @Get(':imageName')
  serveImage(@Res() res: Response): void {
    const imageName = '1.png'; // Replace with your image file name
    const imagePath = join(__dirname, '..', 'assets', imageName);

    res.sendFile(imagePath);
  }
}
