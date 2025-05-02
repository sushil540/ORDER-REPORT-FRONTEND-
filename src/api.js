export const API_END_POINTS = {
    auth :{
        login:"/api/auth/login",
        signup:"/api/auth/signup",
        user:"/api/auth/user",
        dashboard:"/api/auth/dashboard"
    },
    salesPerson:{
        create:"/api/salespersons/create",
        update:"/api/salespersons/update",
        delete:"/api/salespersons/delete",
        view:"/api/salespersons/view",
        getAll:"/api/salespersons/get-all"
    },
    customer:{
        create:"/api/customers/create",
        update:"/api/customers/update",
        delete:"/api/customers/delete",
        view:"/api/customers/view",
        getAll:"/api/customers/get-all"
    },
    order:{
        create:"/api/orders/create",
        update:"/api/orders/update",
        delete:"/api/orders/delete",
        view:"/api/orders/view",
        getAll:"/api/orders/get-all" 
    },
    report:{
        create:"/api/report/create"
    }
}

