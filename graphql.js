const express = require("express");
const app = express();
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");
const expressGraphQL = require("express-graphql");

// Dummy data
const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" }
//   { id: 4, name: "Michael"}
];

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 }, //author : JK ROWLING
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 } //Brents Weeks
  // buku baru >>> id, name, authorId >>> id...., name...., auth.....
  // books.push(obj baru = id...., name...., auth.....)
  //  9
];

// connect to port
const port = 3000;
app.listen(port, console.log("server is running"));

const bookType = new GraphQLObjectType({
  name: "Book",
  description: "getting a book from books list",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: authorType,
      resolve: book => {
        return authors.find(author => author.id === book.authorId);
      }
    }
  })
});

const authorType = new GraphQLObjectType({
  name: "Author",
  description: "getting an author data from authors list",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(bookType),
      resolve: author => {
        return books.filter(book => author.id === book.authorId);
      }
    }
  })
});

const rootQuery = new GraphQLObjectType({
  name: "query",
  description: "query collection",
  fields: () => ({
    books: {
      type: new GraphQLList(bookType),
      description: "list of books",
      resolve: () => books
    },
    authors: {
      type: new GraphQLList(authorType),
      description: "list of authors",
      resolve: () => authors
    },

    book: {
      type: bookType,
      description: "get a book data",
      args: {
        id: { type: GraphQLInt }
        //   name: {type: GraphQLString}
      },
      resolve: (parent, args) => {
        return books.find(book => book.id === args.id);
      }
    },
    author: {
      type: authorType,
      description: "get a single author",
      args: {
        id: { type: GraphQLInt }
        // name:  {type: GraphQLString}
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    }
  })
});

const rootMutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: bookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId
        };
        books.push(book);
        return book;
      }
    },
    addAuthor: {
      type: authorType,
      description: "add a new author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
          const author = {
              id: authors.length + 1,
              name: args.name
          }
          authors.push(author)
          return author
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true
  })
);
