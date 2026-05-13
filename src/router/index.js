import { createRouter, createWebHistory } from "vue-router";
import Főoldal from "../views/Fooldal.vue";
import Rólunk from "../views/Rolunk.vue";
import TárgyFelvétele from "../views/TargyFelvetele.vue";
import Regisztráció from "../views/Regisztráció.vue";
import Bejelentkezés from "../views/Bejelentkezés.vue";
import Profil from "../views/Profil.vue";
import GyakoriKérdés from "../views/GyakoriKerdes.vue";
import Panaszkűldés from "../views/Panaszkuldes.vue";
import api from '../services/api'
import DashboardView from "../adminview/DashboardView.vue";
import ItemsView from "../adminview/ItemsView.vue";
import Működésünk from "../views/Mukodesunk.vue";
import UserView from "../adminview/UserView.vue";
import NewItems from "../adminview/NewItems.vue";
import LoansView from "../adminview/LoansView.vue";
import ReadOffer from "../adminview/ReadOffer.vue";
import IncomingOffers from "../components/IncomingOffers.vue";
import MyLoans from "../components/MyLoans.vue";
import CreateLoanView from "../adminview/CreateLoanView.vue";
import ItemView from "../adminview/ItemView.vue";
import UgyfelView from "../adminview/UgyfelView.vue"
import LoanManageView from "../adminview/LoanManageView.vue";
import SalesView from "../admincomponents/SalesView.vue";
import AdminNewsView from "../adminview/AdminNewsView.vue";

const routes = [
  {
    path: "/",
    name: "Főoldal",
    component: Főoldal
  },
  {
    path: "/mukodesunk",
    name: "Működésünk",
    component: Működésünk
  },
  {
    path: "/rolunk",
    name: "Rólunk",
    component: Rólunk
  },
  {
    path: "/targy-felvetele",
    name: "Tárgy Felvétele",
    component: TárgyFelvétele,
    meta: { requiresAuth: true }
  },
  {
    path: "/profil",
    name: "Profil",
    component: Profil,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "ProfilAdatok",
        component: () => import("../components/ProfilBeallitasok.vue")
      },
      {
        path: "jelszo",
        name: "JelszoModositas",
        component: () => import("../components/Jelszomodositas.vue")
      },
      {
        path: "targyaim",
        name: "ProfilTargyaim",
        component: () => import("../components/FelvettTargyak.vue")
      },
      {
        path: 'ajanlatok',
        name: 'Ajánlatok',
        component: () => IncomingOffers,
      },
      {
        path: 'hiteleim',
        name: 'Hiteleim',
        component: () => MyLoans,
      }
    ]
  },
  {
    path: "/gyik",
    name: "Gyakori Kérdések",
    component: GyakoriKérdés
  },
  {
    path: "/panaszkuldes",
    name: "Panaszkűldés",
    component: Panaszkűldés,
    meta: { requiresAuth: true }
  },
  {
    path: "/register",
    name: "Regisztráció",
    component: Regisztráció
  },
  {
    path: "/login",
    name: "Bejelentkezés",
    component: Bejelentkezés
  },
  {
    path: "/admin",
    name: "Admin",
    component: DashboardView,
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin/items",
    name: "Admin Items",
    component: ItemsView,
    meta: { requiresAdmin: true }
  },
  {
    path:"/admin/users",
    name:"Admin Users",
    component: UserView,
    meta: { requiresAdmin: true }
  },
  {
    path: '/ugyfelek/:id',
    name: 'ugyfel',
    component: UgyfelView,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin/newitems",
    name: "New Items",
    component: NewItems,
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin/loans",
    name: "LoansView",
    component: LoansView,
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin/readoffer",
    name: "ReadOffer",
    component: ReadOffer,
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin/offers/:id/create-loan",
    name: "CreateLoan",
    component: CreateLoanView,
    meta: { requiresAdmin: true }
  },
  {
    path: "/admin/items/:id",
    name: "ItemView",
    component: ItemView,
    meta: { requiresAdmin: true }
  },
  { 
    path: '/admin/loans/:id', 
    name: "LoanManageView",
    component: LoanManageView,
    meta: { requiresAdmin: true }
    
  },
  {
  path: '/admin/sales',
  name: 'AdminSales',
  component: SalesView,
  meta: {requiresAdmin: true}
},
{
  path: '/admin/news',
  name: 'AdminNews',
  component: AdminNewsView,
  meta: { requiresAdmin: true }
}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth && !to.meta.requiresAdmin) {
    return next()
  }

  try {
    const { data } = await api.get('/users/me')

    if (to.meta.requiresAdmin && data.role !== 'admin') {
      return next('/')
    }

    next()
  } catch {
    next({
      path: '/login',
      state: { message: 'Az oldal megtekintéséhez be kell jelentkeznie.' }
    })
  }
});

export default router;
