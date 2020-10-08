import { ApolloServer, gql, PubSub} from 'apollo-server'

const pubsub = new PubSub()

const typeDefs = gql`
  type Subscription {
    musicAdded: Music
  }

  type Music {
    title: String!
    artist: String!
    years: String!
  }

  type Status {
    status: String!
  }

  type Query {
    list: [Music]
  }

  type Mutation {
    add(title: String!, artist: String!, years: String!): Status
  }
`

interface Music {
  title: string
  artist: string
  years: string
}

const musics: Music[] = [
  { title: 'Nikes', artist: 'Frank Ocean', years: '2016' },
  { title: 'Blkswn', artist: 'Smino', years: '2018' },
  { title: 'Pink + White', artist: 'Frank Ocean', years: '2016' }
]

const MUSIC_ADD = 'MUSIC_ADD'

const resolvers = {
  Subscription: {
    musicAdded: {
      subscribe: () => pubsub.asyncIterator(MUSIC_ADD)
    }
  },
  Query: {
    list: () => musics
  },
  Mutation: {
    add: (_: any, args: Music) => {
      pubsub.publish(MUSIC_ADD, {musicAdded: args})

      musics.push(args)

      return {
        status: 'ok!'
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen({ port: 3000 }).then(link => {
  console.log(`> server listen on ${link.address}:${link.port}`)
})
