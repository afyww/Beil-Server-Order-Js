import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const PagesController = () => import('#controllers/pages_controller')
const UsersController = () => import('#controllers/users_controller')
const ProductController = () => import('#controllers/products_controller')
const CategoryController = () => import('#controllers/categories_controller')
const DiscountController = () => import('#controllers/discounts_controller')
const ExpenseController = () => import('#controllers/expenses_controller')
const SettlementController = () => import('#controllers/settlements_controller')
const ChairController = () => import('#controllers/chairs_controller')
const QrController = () => import('#controllers/qrs_controller')

// AUTH
router.get('/', [AuthController, 'index']).as('index')
router.post('/login', [AuthController, 'login']).as('login')

router
  .group(() => {
    //PAGES
    router.get('/dashboard', [PagesController, 'dashboard']).as('dashboard')
    //USER
    router.get('/user', [UsersController, 'index']).as('user')
    router.get('/adduser', [UsersController, 'create']).as('adduser')
    router.post('/postusers', [UsersController, 'store']).as('postuser')
    router.get('user/:id', [UsersController, 'destroy']).as('deluser')
    //CHAIR
    router.get('/chair', [ChairController, 'index']).as('chair')
    router.get('/addchair', [ChairController, 'create']).as('addchair')
    router.post('/postchairs', [ChairController, 'store']).as('postchair')
    router.get('chair/:id', [ChairController, 'destroy']).as('delchair')
    //QR
    router.get('/qr/:id', [QrController, 'userQr']).as('qr')
    //PRODUCT
    router.get('/product', [ProductController, 'index']).as('product')
    router.get('/addproduct', [ProductController, 'create']).as('addproduct')
    router.post('/postproduct', [ProductController, 'store']).as('postproduct')
    router.get('/editproduct/:id', [ProductController, 'edit']).as('editproduct')
    router.post('/updateproduct/:id', [ProductController, 'update']).as('updateproduct')
    router.get('product/:id', [ProductController, 'destroy']).as('delproduct')
    //CATEGORY
    router.get('/category', [CategoryController, 'index']).as('category')
    router.get('/addcategory', [CategoryController, 'create']).as('addcategory')
    router.post('/postcategory', [CategoryController, 'store']).as('postcategory')
    router.get('/editcategory/:id', [CategoryController, 'edit']).as('editcategory')
    router.post('/updatecategory/:id', [CategoryController, 'update']).as('updatecategory')
    router.get('delcategory/:id', [CategoryController, 'destroy']).as('delcategory')
    //DISCOUNT
    router.get('/discount', [DiscountController, 'index']).as('discount')
    router.get('/adddiscount', [DiscountController, 'create']).as('adddiscount')
    router.post('/postdiscount', [DiscountController, 'store']).as('postdiscount')
    router.get('/editdiscount/:id', [DiscountController, 'edit']).as('editdiscount')
    router.post('/updatediscount/:id', [DiscountController, 'update']).as('updatediscount')
    router.get('deldiscount/:id', [DiscountController, 'destroy']).as('deldiscount')
    //EXPENSE
    router.get('/expense', [ExpenseController, 'index']).as('expense')
    router.get('/addexpense', [ExpenseController, 'create']).as('addexpense')
    router.post('/postexpense', [ExpenseController, 'store']).as('postexpense')
    router.get('/editexpense/:id', [ExpenseController, 'edit']).as('editexpense')
    router.post('/updateexpense/:id', [ExpenseController, 'update']).as('updateexpense')
    router.get('delexpense/:id', [ExpenseController, 'destroy']).as('delexpense')
    //SETTLEMENT
    router.get('/settlement', [SettlementController, 'index']).as('settlement')
    router.get('/addstart', [SettlementController, 'vstart']).as('addstart')
    router.post('/poststart', [SettlementController, 'poststart']).as('poststart')
    router.get('/addtotal', [SettlementController, 'vtotal']).as('addtotal')
    //LOGOUT
    router.post('/logout', [AuthController, 'logout']).as('logout')
  })
  .middleware([middleware.auth()])
