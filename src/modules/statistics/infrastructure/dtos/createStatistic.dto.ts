import { EventTypeStatisticEnum } from '../../domain/enums/EventType.enum';

export class CreateStatisticDto {
  event_type: EventTypeStatisticEnum;
  user_id?: string;
  page_url: string;
  metadata?: Record<any, any>;
  ip?: string;
  user_agent?: string;
  session_id?: string;
}
