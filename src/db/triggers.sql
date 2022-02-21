CREATE TRIGGER set_timestamp
BEFORE UPDATE ON {{tbl_name}}
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


