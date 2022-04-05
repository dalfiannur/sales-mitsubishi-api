/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.post('/login', 'AuthController.login')
  Route.post('/logout', 'AuthController.logout')
}).prefix('auth')

Route.group(() => {
  Route.get('/', 'ProductsController.paginate')
  Route.get('/:slug', 'ProductsController.findBySlug')
  Route.group(() => {
    Route.post('/', 'ProductsController.store').middleware('multipleImageUploader:images')
    Route.delete('/:id', 'ProductsController.delete')
  })

  Route.group(() => {
    Route.put('/', 'ProductTypesController.update')
    Route.delete('/', 'ProductTypesController.delete')
  }).prefix('/:productId/types/:id')
}).prefix('products')

Route.group(() => {
  Route.get('/', 'ArticlesController.paginate')
  Route.get('/:slug', 'ArticlesController.findBySlug')

  Route.group(() => {
    Route.post('/', 'ArticlesController.store').middleware('imageUploader:thumbnail')
    Route.put('/:id', 'ArticlesController.update').middleware('imageUploader:thumbnail')
    Route.delete('/:id', 'ArticlesController.delete')
  }).middleware('auth')
}).prefix('articles')