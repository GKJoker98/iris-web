from flask import Flask
from graphql_server.flask import GraphQLView
from db import db
from schema import schema


app = Flask(__name__)
app.debug = True


app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localdev:password@localhost:5433/gdb'
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db.init_app(app)

app.app_context().push()


app.add_url_rule(
    '/graphql-api',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True
    )
)

if __name__ == '__main__':
    app.run()

