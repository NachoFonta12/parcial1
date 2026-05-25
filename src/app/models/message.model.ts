import { User } from "./user.model";

export interface Message {
    id: number;
    user_id: string;
    content: string;
    users?: User;
    created_at: string;
}