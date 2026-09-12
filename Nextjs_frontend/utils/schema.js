import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";


export const MockInterview=pgTable('ai-mocker',{
id:serial('id').primaryKey(),
jsonmockresp:text('jsonmockresp').notNull(),
jobPosition:varchar('jobPosition').notNull(),
jobDesc:varchar('jobDesc').notNull(),
jobEXP:varchar('jobExp').notNull(),
createdBy:varchar('createdBy').notNull(),
createdAt:varchar('createdAt'),
mockId:varchar('mockId').notNull()
})

export const UserAnswer=pgTable('UserAnswer',{
    id:serial('id').primaryKey(),
   mockIdRef:varchar('mockId').notNull(),
   question:varchar('question').notNull(),
   correctAns:text('correctAns'),
   userAns:text('userAns'),
   feedback:varchar('feedback'),
   rating:varchar('rating'),
   userEmail:varchar('userEmail'),
   createdAt:varchar('createdAt'),
   Emotion:varchar('emotion'),
   fluency:varchar('fluency'),
})