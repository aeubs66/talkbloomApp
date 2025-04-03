import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { MAX_HEARTS } from "@/constants";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // ex:Unit 1
  description: text("description").notNull(),
  courseId: integer("course_id")
    .references(() => courses.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

export const story = pgTable("story", {
  id: serial("id").primaryKey(),
  title: text("title"),
  titleKurdish: text("title_kurdish"),
  unitId: integer("unit_id")
    .references(() => units.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
  backgroundMusic: text("background_music"),
});

// Remove video table and its relations
export const generalStory = pgTable("general_story", {
  id: serial("id").primaryKey(),
  content: text("content"),
  contentKurdish: text("content_kurdish"),
  storyId: integer("story_id")
    .references(() => story.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
  transition: text("transition"),
});

export const frame = pgTable("frame", {
  id: serial("id").primaryKey(),
  generalStoryId: integer("general_story_id")
    .references(() => generalStory.id, {
      onDelete: "cascade",
    })
    .notNull(),
  imageUrl: text("image_url").notNull(),
  audioUrl: text("audio_url"),
});

// New table for background audio tracks
// Update frameAudio table with correct relations
export const frameAudio = pgTable("frame_audio", {
  id: serial("id").primaryKey(),
  generalStoryId: integer("general_story_id")
    .references(() => generalStory.id, {
      onDelete: "cascade",
    })
    .notNull(),
  audioUrl: text("audio_url").notNull(),
  startFrame: integer("start_frame").notNull(),
  endFrame: integer("end_frame"),
  volume: integer("volume").default(100),
  loop: boolean("loop").default(false),
});

// Update generalStoryRelations to properly include frameAudio
export const generalStoryRelations = relations(generalStory, ({ one, many }) => ({
  story: one(story, {
    fields: [generalStory.storyId],
    references: [story.id],
  }),
  frames: many(frame),
  mediaSequence: many(mediaSequence),
  audioTracks: many(frameAudio),
}));

export const frameAudioRelations = relations(frameAudio, ({ one }) => ({
  generalStory: one(generalStory, {
    fields: [frameAudio.generalStoryId],
    references: [generalStory.id],
  }),
}));

// First define mediaSequence table
export const mediaSequence = pgTable("media_sequence", {
  id: serial("id").primaryKey(),
  generalStoryId: integer("general_story_id")
    .references(() => generalStory.id, {
      onDelete: "cascade",
    })
    .notNull(),
  mediaId: integer("media_id").notNull(),
  mediaType: text("media_type").notNull(), // only 'frame' now
  order: integer("order").notNull(),
  duration: integer("duration").default(4000),
});

export const frameRelations = relations(frame, ({ one }) => ({
  generalStory: one(generalStory, {
    fields: [frame.generalStoryId],
    references: [generalStory.id],
  }),
}));

export const mediaSequenceRelations = relations(mediaSequence, ({ one }) => ({
  generalStory: one(generalStory, {
    fields: [mediaSequence.generalStoryId],
    references: [generalStory.id],
  }),
}));

// Update story relations without speakerOne and speakerTwo
export const storyRelations = relations(story, ({ one, many }) => ({
  unit: one(units, {
    fields: [story.unitId],
    references: [units.id],
  }),
  generalStory: many(generalStory),
  storyProgress: many(storyProgress),
}));

// Add this new table for story progress
export const storyProgress = pgTable("story_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  storyId: integer("story_id")
    .references(() => story.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
  unlocked: boolean("unlocked").notNull().default(false),
  lastReadAt: timestamp("last_read_at").defaultNow(),
  completedChapters: text("completed_chapters").default('[]').$type<number[]>(),  // Added this field
});

export const storyProgressRelations = relations(storyProgress, ({ one }) => ({
  story: one(story, {
    fields: [storyProgress.storyId],
    references: [story.id],
  }),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, {
      onDelete: "cascade",
    })
    .notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  questionTranslation: text("question_translation"),
  audioSrc: text("audio_src"),  // Added audio field for challenges
  order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  text: text("text").notNull(),
  textTranslation: text("text_translation"),  // Added translation field
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: integer("active_course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  hearts: integer("hearts").notNull().default(5),
  points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

export const userSubscription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});