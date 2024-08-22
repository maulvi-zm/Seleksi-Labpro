-- migrations/2024XXXX_add_triggers.sql

-- Drop function and trigger if they already exist
DROP TRIGGER IF EXISTS after_review_insert ON "Review";
DROP FUNCTION IF EXISTS update_film_rating;

-- Create the function
CREATE OR REPLACE FUNCTION update_film_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE "Film"
    SET
      average_star = (SELECT COALESCE(AVG(star), 0) FROM "Review" WHERE film_id = OLD.film_id),
      review_count = (SELECT COUNT(*) FROM "Review" WHERE film_id = OLD.film_id)
    WHERE film_id = OLD.film_id;
  ELSE
    UPDATE "Film"
    SET
      average_star = (SELECT COALESCE(AVG(star), 0) FROM "Review" WHERE film_id = NEW.film_id),
      review_count = (SELECT COUNT(*) FROM "Review" WHERE film_id = NEW.film_id)
    WHERE film_id = NEW.film_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER after_review_insert
AFTER INSERT OR UPDATE OR DELETE ON "Review"
FOR EACH ROW
EXECUTE FUNCTION update_film_rating();
