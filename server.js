const path = require('path')
const fs = require('fs')
// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

const publicFolder = path.join(__dirname, 'public')

const clickJs = fs.readFileSync(path.join(publicFolder, 'click.js'), 'utf8')

fastify.get('/click.js', async (request, reply) => {
  setTimeout(() => {
    reply.type('text/javascript').send(clickJs)
  }, 2000)
})

fastify.register(require('fastify-static'), {
  root: publicFolder,
})

const fruits = ['Apples', 'Oranges', 'Bananas', 'Pears', 'Grapes']
// returns each fruit one by one, round-robin style
let index = 0
fastify.get('/fruit', async (request, reply) => {
  // simulate an occasional server error if needed
  // if (Math.random() < 0.4) {
  //   throw new Error('Something went wrong')
  // }

  const fruit = fruits[index]
  index += 1
  if (index >= fruits.length) {
    index = 0
  }
  return { fruit }
})

// can return no fruits, one or more fruits
fastify.get('/fruits', async (request, reply) => {
  if (Math.random() < 0.1) {
    // small chance that it returns no fruits
    return []
  }

  const picked = fruits.filter(() => Math.random() < 0.5)
  return picked
})

// always returns the same object
fastify.get('/sale', async (request, reply) => {
  return {
    sale: {
      fruit: 'Mango',
      price: '$1.99',
      quantity: 20,
    },
  }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(4200)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
