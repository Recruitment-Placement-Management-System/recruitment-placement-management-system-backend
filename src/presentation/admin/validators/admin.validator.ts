import {z} from 'zod'

export const adminLoginSchema = z.object({
    email:z.string().trim().email("Invalid email address"),
    password:z.string().min(1,'password is required'),
});

