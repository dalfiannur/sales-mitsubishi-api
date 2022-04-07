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
    Route.put('/:id', 'ProductsController.update')
    Route.delete('/:id', 'ProductsController.delete')
  }).middleware('auth')


  Route.group(() => {
    Route.group(() => {
      Route.post('/', 'ProductImagesController.store').middleware('multipleImageUploader:images')
      Route.delete('/:id', 'ProductImagesController.delete')
    }).prefix('images')

    Route.group(() => {
      Route.post('/', 'ProductTypesController.store')
      Route.put('/:id', 'ProductTypesController.update')
      Route.delete('/:id', 'ProductTypesController.delete')
    }).prefix('types')

  }).prefix('/:productId').middleware('auth')
}).prefix('products')

Route.group(() => {
  Route.get('/', 'NewsController.paginate')
  Route.get('/:slug', 'NewsController.findBySlug')

  Route.group(() => {
    Route.post('/', 'NewsController.store').middleware('imageUploader:thumbnail')
    Route.put('/:id', 'NewsController.update').middleware('imageUploader:thumbnail')
    Route.delete('/:id', 'NewsController.delete')
  }).middleware('auth')
}).prefix('news')


Route.group(() => {
  Route.get('/', 'TestimonialsController.paginate')

  Route.group(() => {
    Route.post('/', 'TestimonialsController.store').middleware('imageUploader:image,avatar')
    Route.put('/:id', 'TestimonialsController.update').middleware('imageUploader:image,avatar')
    Route.delete('/:id', 'TestimonialsController.delete')
  }).middleware('auth')
}).prefix('testimonials')

Route.group(() =>{
  Route.get('/', 'BannersController.paginate')

  Route.group(() => {
    Route.post('/', 'BannersController.store').middleware('imageUploader:image')
    Route.delete('/:id', 'BannersController.delete')
  }).middleware('auth')
}).prefix('banners')
