#!/bin/bash
set -e

POSTGRES="psql --username ${POSTGRES_USER}"

echo "Creating database role: ${POSTGRES_ADMIN_USER}"

$POSTGRES <<-EOSQL
CREATE USER ${POSTGRES_ADMIN_USER} WITH CREATEDB SUPERUSER PASSWORD '${POSTGRES_ADMIN_PASSWORD}';
\c iris_db;
CREATE EXTENSION IF NOT EXISTS pgcrypto CASCADE;
EOSQL

X8GT050930


dict_items([('customer_name', <fields.String(dump_default=<marshmallow.missing>, attribute='name', validate=<Length(min=2, max=None, equal=None, error=None)>, required=True, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=False, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid string.', 'invalid_utf8': 'Not a valid utf-8 string.'})>), ('customer_description', <fields.String(dump_default=<marshmallow.missing>, attribute='description', validate=[], required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=True, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid string.', 'invalid_utf8': 'Not a valid utf-8 string.'})>), ('customer_short', <fields.String(dump_default=<marshmallow.missing>, attribute='short', validate=[], required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=True, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid string.', 'invalid_utf8': 'Not a valid utf-8 string.'})>), ('customer_id', <fields.Integer(dump_default=<marshmallow.missing>, attribute='client_id', validate=[], required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=False, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid integer.', 'too_large': 'Number too large.'})>), ('customer_customer', <fields.Integer(dump_default=<marshmallow.missing>, attribute='client_id_top', validate=[], required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=True, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid integer.', 'too_large': 'Number too large.'})>), ('customer_search_terms', <fields.String(dump_default=<marshmallow.missing>, attribute='client_search_terms', validate=[], required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=True, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid string.', 'invalid_utf8': 'Not a valid utf-8 string.'})>), ('csrf_token', <fields.String(dump_default=<marshmallow.missing>, attribute=None, validate=None, required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=False, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid string.', 'invalid_utf8': 'Not a valid utf-8 string.'})>), ('client_uuid', <fields.UUID(dump_default=<marshmallow.missing>, attribute=None, validate=[], required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=False, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid string.', 'invalid_utf8': 'Not a valid utf-8 string.', 'invalid_uuid': 'Not a valid UUID.'})>), ('creation_date', <fields.DateTime(dump_default=<marshmallow.missing>, attribute=None, validate=[], required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=True, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid {obj_type}.', 'invalid_awareness': 'Not a valid {awareness} {obj_type}.', 'format': '"{input}" cannot be formatted as a {obj_type}.'})>), ('last_update_date', <fields.DateTime(dump_default=<marshmallow.missing>, attribute=None, validate=[], required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=True, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid {obj_type}.', 'invalid_awareness': 'Not a valid {awareness} {obj_type}.', 'format': '"{input}" cannot be formatted as a {obj_type}.'})>), ('client_search_terms', <fields.String(dump_default=<marshmallow.missing>, attribute=None, validate=[], required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=True, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.', 'invalid': 'Not a valid string.', 'invalid_utf8': 'Not a valid utf-8 string.'})>), ('custom_attributes', <fields.Raw(dump_default=<marshmallow.missing>, attribute=None, validate=[], required=False, load_only=False, dump_only=False, load_default=<marshmallow.missing>, allow_none=True, error_messages={'required': 'Missing data for required field.', 'null': 'Field may not be null.', 'validator_failed': 'Invalid value.'})>)])
