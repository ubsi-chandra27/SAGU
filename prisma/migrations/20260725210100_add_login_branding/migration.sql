ALTER TABLE "schools"
ADD COLUMN "login_background_url" VARCHAR(255),
ADD COLUMN "login_title" VARCHAR(120),
ADD COLUMN "login_subtitle" VARCHAR(255),
ADD COLUMN "login_background_position" VARCHAR(20) NOT NULL DEFAULT 'center',
ADD COLUMN "login_overlay_opacity" DOUBLE PRECISION NOT NULL DEFAULT 0.46;
