CREATE TABLE "frame" (
	"id" serial PRIMARY KEY NOT NULL,
	"general_story_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"audio_url" text
);
--> statement-breakpoint
CREATE TABLE "frame_audio" (
	"id" serial PRIMARY KEY NOT NULL,
	"general_story_id" integer NOT NULL,
	"audio_url" text NOT NULL,
	"start_frame" integer NOT NULL,
	"end_frame" integer,
	"volume" integer DEFAULT 100,
	"loop" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "general_story" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"content_kurdish" text,
	"story_id" integer NOT NULL,
	"order" integer NOT NULL,
	"transition" text
);
--> statement-breakpoint
CREATE TABLE "media_sequence" (
	"id" serial PRIMARY KEY NOT NULL,
	"general_story_id" integer NOT NULL,
	"media_id" integer NOT NULL,
	"media_type" text NOT NULL,
	"order" integer NOT NULL,
	"duration" integer DEFAULT 4000
);
--> statement-breakpoint
CREATE TABLE "story" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"title_kurdish" text,
	"unit_id" integer NOT NULL,
	"order" integer NOT NULL,
	"background_music" text
);
--> statement-breakpoint
CREATE TABLE "story_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"story_id" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"unlocked" boolean DEFAULT false NOT NULL,
	"last_read_at" timestamp DEFAULT now(),
	"completed_chapters" text DEFAULT '[]'
);
--> statement-breakpoint
ALTER TABLE "challenge_options" ADD COLUMN "text_translation" text;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "question_translation" text;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "audio_src" text;--> statement-breakpoint
ALTER TABLE "frame" ADD CONSTRAINT "frame_general_story_id_general_story_id_fk" FOREIGN KEY ("general_story_id") REFERENCES "public"."general_story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frame_audio" ADD CONSTRAINT "frame_audio_general_story_id_general_story_id_fk" FOREIGN KEY ("general_story_id") REFERENCES "public"."general_story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "general_story" ADD CONSTRAINT "general_story_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_sequence" ADD CONSTRAINT "media_sequence_general_story_id_general_story_id_fk" FOREIGN KEY ("general_story_id") REFERENCES "public"."general_story"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story" ADD CONSTRAINT "story_unit_id_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_progress" ADD CONSTRAINT "story_progress_story_id_story_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;