import { markRaw, ref } from "vue";
import Items from "../classes/Items";
import { defineStore } from "pinia";
import api from "../services/api";
import Income from "../classes/Income";
import Category from "../classes/Category";
import User from "../classes/User";
import Loans from "../classes/Loans";
import Offer from "../classes/Offer";

export const adminState = defineStore("adminState", () => {
  const submittedItems = ref([]);
  const forSaleItems = ref([]);
  const incomeByDate = ref([]);
  const latestOffer = ref([]);
  const mostExpensiveItem = ref([]);
  const approvedItems = ref([]);
  const categoryOfItems = ref([]);
  const categoryValues = ref([]);
  const usersArray = ref([]);
  const mostActiveUser = ref([]);
  const newestAccount = ref([]);
  const oldestAccount = ref([]);
  const selectedItem = ref(null);
  const loans = ref([]);
  const mostExpensiveOffer = ref([]);
  const topExpensiveItems = ref([]);
  const currentUser = ref(null);
  const offers = ref([]);

  async function getSubmittedItemsFromApi() {
    submittedItems.value = [];
    latestOffer.value = [];
    mostExpensiveItem.value = [];
    try {
      const { data } = await api.get("/items/status/SUBMITTED");
      for (let i = 0; i < data.length; i++) {
        const item = new Items(
          data[i].id,
          data[i].description,
          data[i].estimated_value,
          data[i].user_id,
          data[i].status,
          data[i].name,
          data[i].upload_date,
          data[i].category,
          data[i].item_images,
        );
        submittedItems.value.push(item);
      }
      getLatestOfferFromArray();
      getMostExpensiveItemFromArray();
    } catch (error) {
      console.error(error);
    }
  }
  function sortIncomeByDate() {
    for (let i = 0; i < incomeByDate.value.length - 1; i++) {
      for (let j = 0; j < incomeByDate.value.length - i - 1; j++) {
        const dateA = new Date(incomeByDate.value[j].getDate());
        const dateB = new Date(incomeByDate.value[j + 1].getDate());

        if (dateA > dateB) {
          const temp = incomeByDate.value[j];
          incomeByDate.value[j] = incomeByDate.value[j + 1];
          incomeByDate.value[j + 1] = temp;
        }
      }
    }
  }

  async function getApprovedItemsFromApi() {
    approvedItems.value = [];
    try {
      const { data } = await api.get("/items/status/APPROVED");
      for (let i = 0; i < data.length; i++) {
        const item = new Items(
          data[i].id,
          data[i].description,
          data[i].estimated_value,
          data[i].user_id,
          data[i].status,
          data[i].name,
          data[i].upload_date,
          data[i].category,
          data[i].item_images,
        );
        approvedItems.value.push(item);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function getLatestOfferFromArray() {
    for (let i = 0; i < submittedItems.value.length; i++) {
      if (latestOffer.value.length === 0) {
        latestOffer.value.push(submittedItems.value[i]);
      }

      for (let k = 0; k < latestOffer.value.length; k++) {
        if (
          submittedItems.value[i].getUploadDate() >
          latestOffer.value[k].getUploadDate()
        ) {
          latestOffer.value[k] = submittedItems.value[i];
        }
      }
    }
  }

  function getMostExpensiveItemFromArray() {
    for (let i = 0; i < submittedItems.value.length; i++) {
      if (mostExpensiveItem.value.length === 0) {
        mostExpensiveItem.value.push(submittedItems.value[i]);
      }

      for (let j = 0; j < mostExpensiveItem.value.length; j++) {
        if (
          submittedItems.value[i].getEstimatedValue() >
          mostExpensiveItem.value[j].getEstimatedValue()
        ) {
          mostExpensiveItem.value[j] = submittedItems.value[i];
        }
      }
    }
  }

  async function getForSaleItemsFromApi() {
    forSaleItems.value = [];
    try {
      const { data } = await api.get("/items/status/FOR_SALE");
      for (let i = 0; i < data.length; i++) {
        const item = new Items(
          data[i].id,
          data[i].description,
          data[i].estimated_value,
          data[i].user_id,
          data[i].status,
          data[i].name,
          data[i].upload_date,
          data[i].category,
          data[i].item_images,
        );
        forSaleItems.value.push(item);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function calculateAmountOfCategories() {
    categoryOfItems.value = [];

    for (let i = 0; i < approvedItems.value.length; i++) {
      const approvedItem = approvedItems.value[i];
      const category = approvedItem.getCategory();

      let found = false;

      for (let j = 0; j < categoryOfItems.value.length; j++) {
        if (categoryOfItems.value[j].getCategory() === category) {
          categoryOfItems.value[j].setAmount(
            categoryOfItems.value[j].getAmount() + 1,
          );
          found = true;
        }
      }

      if (!found) {
        const newCategory = new Category(category, 1);
        categoryOfItems.value.push(newCategory);
      }
    }
  }

function calculateIncomeByDate() {
  incomeByDate.value = [];

  for (let i = 0; i < forSaleItems.value.length; i++) {
    const item = forSaleItems.value[i];
    const date = item.getUploadDate();
    const income = item.getEstimatedValue();

    let found = false;

    for (let j = 0; j < incomeByDate.value.length; j++) {
      if (incomeByDate.value[j].getDate() === date) {
        incomeByDate.value[j].setIncome(
          incomeByDate.value[j].getIncome() + income
        );
        found = true;
      }
    }

    if (!found) {
      const newIncome = new Income(date, income);
      incomeByDate.value.push(newIncome);
    }
  }
  sortIncomeByDate();
}

  function calculateCategoryValues() {
    categoryValues.value = [];

    for (let i = 0; i < approvedItems.value.length; i++) {
      const item = approvedItems.value[i];
      const category = item.getCategory();
      const value = item.getEstimatedValue();

      let found = false;

      for (let j = 0; j < categoryValues.value.length; j++) {
        if (categoryValues.value[j].getCategory() === category) {
          categoryValues.value[j].setAmount(
            categoryValues.value[j].getAmount() + value,
          );
          found = true;
        }
      }

      if (!found) {
        const newCategory = new Category(category, value);
        categoryValues.value.push(newCategory);
      }
    }
  }

  function sortCategoriesByValueDesc() {
    for (let i = 0; i < categoryValues.value.length - 1; i++) {
      for (let j = 0; j < categoryValues.value.length - i - 1; j++) {
        const a = categoryValues.value[j].getAmount();
        const b = categoryValues.value[j + 1].getAmount();

        if (a < b) {
          const temp = categoryValues.value[j];
          categoryValues.value[j] = categoryValues.value[j + 1];
          categoryValues.value[j + 1] = temp;
        }
      }
    }
  }

  async function getUsersFromApi() {
    usersArray.value = [];
    try {
      const { data } = await api.get("/users/all");
      for (let i = 0; i < data.length; i++) {
        const user = markRaw(new User(
          data[i].id,
          data[i].name,
          data[i].email,
          data[i].phone,
          data[i].auth_user_id,
          data[i].role,
          data[i].register_date,
          data[i].avatar_path,
          data[i].avatar_url
        ));
        usersArray.value.push(user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const newUsersByDate = ref([]);

  function calculateNewUsersByDate() {
    newUsersByDate.value = [];

    for (let i = 0; i < usersArray.value.length; i++) {
      const user = usersArray.value[i];
      const date = user.getRegisterDate();

      let found = false;

      for (let j = 0; j < newUsersByDate.value.length; j++) {
        if (newUsersByDate.value[j].date === date) {
          newUsersByDate.value[j].count++;
          found = true;
        }
      }

      if (!found) {
        newUsersByDate.value.push({
          date: date,
          count: 1,
        });
      }
    }

    newUsersByDate.value.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  async function getUserById(id) {
    usersArray.value = [];
    try {
      const { data } = await api.get(`/users/${id}`);
      const user = markRaw(new User(
        data.id,
        data.name,
        data.email,
        data.phone,
        data.auth_user_id,
        data.role,
        data.register_date,
        data.avatar_path,
        data.avatar_url
      ));
      usersArray.value.push(user);
    } catch (error) {
      console.error("Hiba a user lekérésénél:", error);
      return null;
    }
  }

  async function getMostActiveUserFromApi() {
    mostActiveUser.value = [];
    try {
      const { data } = await api.get(`/users/most-active`);

      const user = markRaw(new User(
        data.user.id,
        data.user.name,
        data.user.email,
        data.user.phone,
        data.user.auth_user_id,
        data.user.role,
        data.user.register_date,
        data.user.avatar_path,
        data.user.avatar_url
      ));
      mostActiveUser.value.push(user);
    } catch (error) {
      console.error("Hiba a user lekérésénél:", error);
      return null;
    }
  }

    async function getMostExpensiveOfferFromApi() {
  mostExpensiveOffer.value = []; 

  try {
    const { data } = await api.get(`/users/highest-offer-user`);
    
    if (data && data.user) {
      const user = markRaw(new User(
        data.user.id,
        data.user.name,
        data.user.email,
        data.user.phone,
        null,
        data.user.role,
        data.user.register_date,
        data.user.avatar_path,
        data.user.avatar_url
      ));


      mostExpensiveOffer.value.push(user);
    }
  } catch (error) {
    console.error("Hiba a kiemelt user lekérésénél:", error);
  }
}

  function getMostExpensiveOffer(){
    return mostExpensiveOffer.value;
  }

  async function getNewestAccountFromApi() {
    newestAccount.value = [];
    try {
      const { data } = await api.get(`/users/newest`);

      const user = markRaw(new User(
        data.user.id,
        data.user.name,
        data.user.email,
        data.user.phone,
        data.user.auth_user_id,
        data.user.role,
        data.user.register_date,
        data.user.avatar_path,
        data.user.avatar_url
      ));
      newestAccount.value.push(user);
    } catch (error) {
      console.error("Hiba a user lekérésénél:", error);
      return null;
    }
  }

  async function getOldestAccountFromApi() {
    oldestAccount.value = [];
    try {
      const { data } = await api.get(`/users/oldest`);

      const user = markRaw(new User(
        data.user.id,
        data.user.name,
        data.user.email,
        data.user.phone,
        data.user.auth_user_id,
        data.user.role,
        data.user.register_date,
        data.user.avatar_path,
        data.user.avatar_url
      ));
    
      oldestAccount.value.push(user);
    } catch (error) {
      console.error("Hiba a user lekérésénél:", error);
      return null;
    }
  }

  async function getCurrentUserFromApi() {
    currentUser.value = null;
    try {
      const { data } = await api.get("/users/me");
      currentUser.value = markRaw(new User(
        data.id,
        data.name,
        data.email,
        data.phone,
        data.auth_user_id,
        data.role,
        data.register_date,
        data.avatar_path,
        data.avatar_url
      ));
    } catch (error) {
      console.error("Hiba a saját adatok lekérésekor:", error);
    }
  }

  function getCurrentUser() {
    return currentUser.value;
  }

  function getNewestAccount() {
    return newestAccount.value;
  }

  function getOldestAccount() {
    return oldestAccount.value;
  }

  function getMostActiveUser() {
    return mostActiveUser.value;
  }

  function getMostActiveUser() {
    return mostActiveUser.value;
  }

  function getNewestUser() {
    return newestUser.value;
  }

  async function getItemsByUserId(id) {
    try {
      const { data } = await api.get(`/items/user/${id}`);

      return data.map((item) => ({
        id: item.id, 
        image: item.item_images?.[0]?.url ?? "../assets/default.png",
        name: item.name,
        uploader: item.user_name,
        date: item.upload_date,
        price: item.estimated_value + " Ft",
      }));
    } catch (error) {
      console.error("Hiba a tárgyak lekérésénél:", error);
      return [];
    }
  }

  function getNewUsersByDate() {
    return newUsersByDate.value;
  }

  async function fetchItemByIdAdmin(id) {
    try {
      const res = await api.get(`/items/admin/${id}`);
      const itemData = res.data;

      selectedItem.value = markRaw(
        new Items(
          itemData.id,
          itemData.description,
          itemData.estimated_value,
          itemData.user_id,
          itemData.status,
          itemData.name,
          itemData.upload_date,
          itemData.category,
          itemData.item_images,
        ),
      );

      return selectedItem.value;
    } catch (error) {
      console.error("[fetchItemByIdAdmin] hiba:", error);
      selectedItem.value = null;
      throw error;
    }
  }

  async function getTopExpensiveItemsFromApi() {
    topExpensiveItems.value = [];
    try {
      const { data } = await api.get("/items/top-expensive");
      for (let i = 0; i < data.length; i++) {
        topExpensiveItems.value.push(Items.fromApi(data[i]));
      }
    } catch (error) {
      console.error("Hiba a legdrágább tárgyak lekérésekor:", error);
    }
  }

  function getTopExpensiveItems() {
    return topExpensiveItems.value;
  }

  function getSelectedItem() {
    return selectedItem.value;
  }

  function getIncomeByDate() {
    return incomeByDate.value;
  }

  function getSubmittedItems() {
    return submittedItems.value;
  }

  function getForSaleItems() {
    return forSaleItems.value;
  }

  function getLatestOffer() {
    return latestOffer.value;
  }

  function getMostExpensiveItem() {
    return mostExpensiveItem.value;
  }

  function getApprovedItems() {
    return approvedItems.value;
  }

  function getCategoryOfItems() {
    return categoryOfItems.value;
  }

  function getApprovedLength() {
    return approvedItems.value.length;
  }

  function getUsersLength() {
    return usersArray.value.length;
  }

  function getMostExpensiveValue() {
    if (mostExpensiveItem.value.length === 0) return 0;
    return mostExpensiveItem.value[0].getEstimatedValue();
  }

  function getTopThreeCategories() {
    const result = [];
    for (let i = 0; i < categoryValues.value.length && i < 3; i++) {
      result.push(categoryValues.value[i]);
    }
    return result;
  }

  function getUsers() {
    return usersArray.value;
  }


async function getLoansFromApi() {
    loans.value = [];
    try {
        const { data } = await api.get("/loans/");
        for (let i = 0; i < data.length; i++) {
            loans.value.push(Loans.fromApi(data[i]));
        }
    } catch (error) {
        console.error("Hiba a hitelek lekérésekor:", error);
    }
}



async function getOffersFromApi() {
    try {
        const { data } = await api.get("/offers/");
        offers.value = data.map(o => Offer.fromApi(o));
    } catch (error) {
        console.error("Hiba az ajánlatok lekérésekor:", error);
    }
}

function getOffers(){
  return offers.value
}

  function getLoans() {
    return loans.value;
  }

  return {
    getSubmittedItems,
    getSubmittedItemsFromApi,
    getForSaleItems,
    getForSaleItemsFromApi,
    calculateIncomeByDate,
    getIncomeByDate,
    getLatestOffer,
    getMostExpensiveItem,
    getApprovedItemsFromApi,
    getApprovedItems,
    calculateAmountOfCategories,
    getCategoryOfItems,
    getApprovedLength,
    getMostExpensiveValue,
    getTopThreeCategories,
    sortCategoriesByValueDesc,
    calculateCategoryValues,
    fetchItemByIdAdmin,
    getSelectedItem,
    getUsersFromApi,
    getUsersLength,
    getUsers,
    calculateNewUsersByDate,
    getNewUsersByDate,
    getUserById,
    getItemsByUserId,
    getMostActiveUser,
    getMostActiveUserFromApi,
    getNewestUser,
    getNewestAccount,
    getNewestAccountFromApi,
    getOldestAccount,
    getOldestAccountFromApi,
    getLoans,
    getLoansFromApi,
    getMostExpensiveOfferFromApi,
    getMostExpensiveOffer,
    getTopExpensiveItemsFromApi,
    getTopExpensiveItems,
    getCurrentUserFromApi,
    getCurrentUser,
    getOffersFromApi,
    getOffers,
  };
});
