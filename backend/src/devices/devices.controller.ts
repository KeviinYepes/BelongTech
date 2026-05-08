import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('devices') //Esto crea la base ruta /devices
export class DevicesController {
    constructor(private readonly devicesService: DevicesService){} //Inyectamos el servicio DevicesService

    @Get() //Si llega una peticion HTTP GET a /devices
    findAll(){
        return this.devicesService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.devicesService.findOne(Number(id));
    }

    @Post()
    create(
        @Body()
        body: {
            name: string;
            serial: string;
            model?: string;
            description?: string;
            purchaseDate: string;
            assignedAt: string;
            brandId: number;
            categoryId: number;
            placeId: number;
            userId? : number;
            code?: string;
            enum?: string;
        },
    ) {
        const purchaseDate = new Date(body.purchaseDate);
        const assignedAt = new Date(body.assignedAt);

        if (Number.isNaN(purchaseDate.getTime())) {
            throw new BadRequestException('purchaseDate no tiene un formato de fecha valido.');
        }

        if (Number.isNaN(assignedAt.getTime())) {
            throw new BadRequestException('assignedAt no tiene un formato de fecha valido.');
        }

        return this.devicesService.create({
            ...body,  //Copy all properties of body obj
            purchaseDate,
            assignedAt,
        });
    }

    @Patch(':id') //param id
    update(
        @Param('id') id: string,
        @Body()
        body:{
            name?: string;
            serial?: string;
            model?: string;
            description?: string;
            purchaseDate?: string;
            assignedAt?: string;
            brandId?: number;
            categoryId?: number;
            placeId?: number;
            userId?: number | null;
            code?: string;
            enum?: string; 
        },
    ){
        const data = {
            ...body,
            purchaseDate: body.purchaseDate
            ? new Date(body.purchaseDate)
            : undefined,
            assignedAt: body.assignedAt
            ? new Date(body.assignedAt)
            : undefined,  
        };
        
        if (data.purchaseDate && Number.isNaN(data.purchaseDate.getTime())){
            throw new BadRequestException('purchaseDate no tiene un formato de fecha valido.');
        }

        if (data.assignedAt && Number.isNaN(data.assignedAt.getTime())){
            throw new BadRequestException('assignedAt no tiene un formato de fecha valido.');
        }

        return this.devicesService.update(Number(id), data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.devicesService.remove(Number(id));
    }
}
