import { Injectable } from "@nestjs/common";
import { SdekService } from "./sdek.service";

//TODO: Implement
@Injectable()
export class SdekWebhookService {
    constructor(private readonly sdekService: SdekService) {}

    async handleStatusWebhook(dto: any) {
        
    }
}