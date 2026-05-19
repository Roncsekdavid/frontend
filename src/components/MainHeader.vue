<script setup>
import { onMounted, watch } from 'vue';
import { ref, computed } from 'vue';
import { useAuthStore } from '../state/stateAuth';
import { storeToRefs } from 'pinia';
import { useDarkModeStore } from '../state/stateDarkMode';
import { useRoute, useRouter } from 'vue-router';
import { useCurrencyStore, CURRENCIES } from '../state/stateCurrency';
import api from '../services/api';

const auth = useAuthStore();
const darkModeStore = useDarkModeStore();
const { userAvatarUrl: avatarUrl, userName } = storeToRefs(auth);
const menuOpen = ref(false);
const toggleMenu = () => { menuOpen.value = !menuOpen.value; };
const closeMenu = () => { menuOpen.value = false; };

const dropdownOpen = ref(false);
const toggleDropdown = () => { dropdownOpen.value = !dropdownOpen.value; };
const closeDropdown = () => { dropdownOpen.value = false; currencyOpen.value = false; };

const mobileDropdownOpen = ref(false);
const currencyOpen = ref(false);

const handleLogout = async () => {
  await auth.logout();
  closeDropdown();
  closeMenu();
  mobileDropdownOpen.value = false;
  router.push('/');
};

const firstName = computed(() => {
  if (!userName.value) return "Profil";
  const parts = userName.value.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts[1];
  return parts[Math.floor(parts.length / 2)];
});

const route = useRoute();
const router = useRouter();

const notificationOpen = ref(false)
const notifications = ref([])
const notificationLoading = ref(false)

const unreadCount = computed(() =>
  notifications.value.filter(n => !n.is_read).length
)

const toggleNotifications = async () => {
  notificationOpen.value = !notificationOpen.value

  if (notificationOpen.value) {
    await fetchNotifications()
  }
}

const closeNotifications = () => {
  notificationOpen.value = false
}

async function fetchNotifications() {
  if (!auth.isLoggedIn) return

  notificationLoading.value = true

  try {
    const { data } = await api.get('/notifications')
    notifications.value = data
  } catch (error) {
    console.error(error)
  } finally {
    notificationLoading.value = false
  }
}

async function markNotificationAsRead(notification) {
  try {
    if (!notification.is_read) {
      await api.patch(`/notifications/${notification.id}/read`)
      notification.is_read = true
    }

    if (notification.related_entity_type === 'offer') {
      router.push('/profil/ajanlatok')
    }

    if (notification.related_entity_type === 'loan') {
      router.push('/profil/hiteleim')
    }

    closeNotifications()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await auth.fetchUser();
  if (auth.isLoggedIn) {
      await fetchNotifications();
    }
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('profil-dropdown-wrap')
    const notificationDropdown = document.getElementById('notification-dropdown-wrap')
    
    if (dropdown && !dropdown.contains(e.target)) closeDropdown()
    if (notificationDropdown && !notificationDropdown.contains(e.target)) closeNotifications()
    
  })
});

watch(() => route.path, async () => {
  await auth.fetchUser();
  if (auth.isLoggedIn) {
    await fetchNotifications();
  }
});

const currencyStore = useCurrencyStore();

const selectedCurrency = computed(() =>
  CURRENCIES.find(c => c.code === currencyStore.selectedCode) ?? CURRENCIES[0]
)

const selectedCode = computed({
  get: () => currencyStore.selectedCode,
  set: (val) => currencyStore.setCurrency(val),
});
</script>

<template>
  <header
    class="py-3 relative z-[100] bg-gradient-to-r from-[#f5ede0] via-[#efe0c8] to-[#f5ede0] dark:from-[#1A1614] dark:via-[#26211E] dark:to-[#1A1614] border-b-2 border-[#E5B326] dark:border-[#E5B326]/40 shadow-[0_4px_20px_rgba(74,46,35,0.12)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-colors duration-300">
    <nav class="container mx-auto px-4">

      <ul class="hidden xl:flex items-center justify-between relative">

        <div class="flex gap-6 2xl:gap-8 items-center flex-1 justify-end pr-10">
          <li><router-link to="/"
              class="nav-item text-[#4A2E23] dark:text-[#D4C7B0] hover:text-[#c8960e] dark:hover:text-[#E5B326]">Főoldal</router-link>
          </li>
          <li><router-link to="/mukodesunk"
              class="nav-item text-[#4A2E23] dark:text-[#D4C7B0] hover:text-[#c8960e] dark:hover:text-[#E5B326]">Működésünk</router-link>
          </li>
          <li><router-link to="/rolunk"
              class="nav-item text-[#4A2E23] dark:text-[#D4C7B0] hover:text-[#c8960e] dark:hover:text-[#E5B326]">Rólunk</router-link>
          </li>
        </div>

        <div class="flex items-center text-center flex-shrink-0">
          <router-link to="/admin">
            <img src="../assets/zacipaci-logo.png" alt="ZaciPaci Logo" class="logo-img">
          </router-link>
          <div class="ml-2">
            <h1
              class="text-[44px] font-extrabold leading-none m-0 text-[#4A2E23] dark:text-[#E5B326] transition-colors duration-300">
              ZaciPaci</h1>
            <p class="text-[22px] m-0 text-[#9a7060] dark:text-[#D4C7B0] transition-colors duration-300">Zálogház</p>
          </div>
        </div>

        <div class="flex gap-6 2xl:gap-8 items-center flex-1 justify-start pl-10">
          <li>
            <router-link to="/targy-felvetele"
              class="nav-item text-[#4A2E23] dark:text-[#D4C7B0] hover:text-[#c8960e] dark:hover:text-[#E5B326]">Tárgy
              felvétele</router-link>
          </li>

          <li v-if="auth.isLoggedIn" class="relative" id="notification-dropdown-wrap">
            <button @click.stop="toggleNotifications"
              class="relative w-11 h-11 rounded-full border-2 border-[#E5B326] bg-white dark:bg-[#26211E] text-[#4A2E23] dark:text-[#E5B326] flex items-center justify-center shadow-[3px_3px_0px_#4A2E23] dark:shadow-[3px_3px_0px_#E5B326] hover:translate-y-[-2px] transition-all">
              <i class="bi bi-bell-fill text-lg"></i>
              <span v-if="unreadCount > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-black min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-white dark:border-[#26211E]">
                {{ unreadCount }}
              </span>
            </button>

            <Transition name="dropdown">
              <div v-if="notificationOpen"
                class="absolute right-0 top-[calc(100%+12px)] w-80 rounded-2xl overflow-hidden z-[500] bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] shadow-[4px_4px_0px_#4A2E23] dark:shadow-[4px_4px_0px_#E5B326]">
                <div class="px-4 py-3 border-b border-[#4A2E23]/10 dark:border-[#E5B326]/10 flex items-center justify-between">
                  <h3 class="font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase text-sm">Értesítések</h3>
                  <div class="flex items-center gap-2">
                    <span v-if="unreadCount > 0"
                      class="bg-[#E5B326] text-[#4A2E23] text-[11px] font-black px-2 py-1 rounded-full">
                      {{ unreadCount }} új
                    </span>
                    <button @click="closeNotifications" class="text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 hover:text-[#4A2E23] dark:hover:text-[#D4C7B0] transition-colors ml-1">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>

                <div v-if="notificationLoading" class="p-5 text-center font-bold text-[#4A2E23]/50 dark:text-[#D4C7B0]/50">
                  Betöltés...
                </div>

                <div v-else-if="notifications.length" class="max-h-96 overflow-y-auto">
                  <button v-for="notification in notifications" :key="notification.id"
                    @click="markNotificationAsRead(notification)"
                    class="w-full text-left p-4 border-b border-[#4A2E23]/10 dark:border-[#E5B326]/10 hover:bg-[#E5B326]/10 transition-colors"
                    :class="!notification.is_read ? 'bg-[#E5B326]/10' : ''">
                    <div class="flex gap-3">
                      <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                        :class="!notification.is_read
                          ? 'bg-[#E5B326] border-[#4A2E23] text-[#4A2E23]'
                          : 'bg-gray-100 dark:bg-[#1A1614] border-gray-200 dark:border-[#E5B326]/20 text-gray-400'">
                        <i class="bi" :class="notification.type === 'OFFER_CREATED'
                          ? 'bi-envelope-paper-fill'
                          : notification.type === 'LOAN_CREATED'
                            ? 'bi-cash-coin'
                            : 'bi-bell-fill'"></i>
                      </div>
                      <div class="min-w-0">
                        <p class="font-black text-sm text-[#4A2E23] dark:text-[#FBF5E9]">{{ notification.title }}</p>
                        <p class="text-xs font-bold text-[#4A2E23]/60 dark:text-[#D4C7B0]/60 mt-1">{{ notification.message }}</p>
                        <p class="text-[11px] font-bold text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 mt-2">
                          {{ new Date(notification.created_at).toLocaleString('hu-HU') }}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <div v-else class="p-8 text-center">
                  <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-[#1A1614] border-2 border-dashed border-gray-300 dark:border-[#E5B326]/30 mx-auto mb-3 flex items-center justify-center">
                    <i class="bi bi-bell-slash text-2xl text-gray-300 dark:text-[#D4C7B0]/30"></i>
                  </div>
                  <p class="font-black text-xs uppercase text-[#4A2E23]/40 dark:text-[#D4C7B0]/40">Nincs értesítés</p>
                </div>
              </div>
            </Transition>
          </li>

          <li class="relative" id="profil-dropdown-wrap">
            <router-link v-if="!auth.isLoggedIn" to="/login" class="profil-link flex items-center gap-2">
              Bejelentkezés
            </router-link>

            <div v-else class="relative">
              <div class="flex items-center rounded-full overflow-hidden shadow-[0_2px_8px_rgba(229,179,38,0.35)]"
                style="background:linear-gradient(135deg,#E5B326,#c8960e)">
                <router-link to="/profil"
                  class="profil-oval-link flex items-center gap-2 no-underline px-4 py-1.5 hover:brightness-110 transition-all">
                  <img v-if="avatarUrl" :src="avatarUrl" class="w-7 h-7 rounded-full object-cover border border-white/50 flex-shrink-0" alt="Profilkép" />
                  <i v-else class="bi bi-person-circle text-lg"></i>
                  {{ firstName }}
                </router-link>
                <div class="w-px h-6 bg-white/30"></div>
                <button @click.stop="toggleDropdown"
                  class="flex items-center justify-center px-3 py-2 text-white hover:brightness-110 transition-all"
                  :class="{ 'brightness-110': dropdownOpen }">
                  <i class="bi text-sm transition-transform duration-200"
                    :class="dropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </button>
              </div>

              <Transition name="dropdown">
                <div v-if="dropdownOpen"
                  class="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl z-50 bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] shadow-[4px_4px_0px_#4A2E23] dark:shadow-[4px_4px_0px_#E5B326]">

                  <router-link to="/profil" @click="closeDropdown"
                    class="dropdown-item flex items-center gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0]">
                    <i class="bi bi-person-gear text-[#E5B326]"></i>
                    Profilbeállítások
                  </router-link>

                  <router-link to="/profil/targyaim" @click="closeDropdown"
                    class="dropdown-item flex items-center gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0]">
                    <i class="bi bi-box-seam text-[#E5B326]"></i>
                    Felvett tárgyaim
                  </router-link>

                  <router-link to="/profil/ajanlatok" @click="closeDropdown"
                    class="dropdown-item flex items-center gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0]">
                    <i class="bi bi-envelope-paper text-[#E5B326]"></i>
                    Bejövő ajánlatok
                  </router-link>

                  <router-link to="/profil/hiteleim" @click="closeDropdown"
                    class="dropdown-item flex items-center gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0]">
                    <i class="bi bi-cash-coin text-[#E5B326]"></i>
                    Hiteleim
                  </router-link>

                  <router-link to="/profil/jelszo" @click="closeDropdown"
                    class="dropdown-item flex items-center gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0]">
                    <i class="bi bi-key text-[#E5B326]"></i>
                    Jelszó módosítása
                  </router-link>

                  <div class="dropdown-divider"></div>

                  <div class="relative">
                    <div class="dropdown-item flex items-center justify-between gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0] cursor-pointer"
                      @click.stop="currencyOpen = !currencyOpen">
                      <div class="flex items-center gap-3">
                        <i class="bi bi-coin text-[#E5B326]"></i>
                        <span>Valuta</span>
                      </div>
                      <div class="flex items-center gap-2 bg-[#E5B326] rounded-xl px-2 py-1">
                        <span class="fi fis rounded-sm text-sm" :class="`fi-${selectedCurrency.countryCode}`"></span>
                        <span class="text-[#4A2E23] font-bold text-sm">{{ selectedCurrency.code }}</span>
                        <i class="bi text-[#4A2E23] text-xs" :class="currencyOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                      </div>
                    </div>

                    <div v-if="currencyOpen"
                      class="absolute right-0 top-full w-full max-h-48 overflow-y-auto bg-white dark:bg-[#1A1614] border-t border-[#4A2E23]/10 dark:border-[#E5B326]/10 z-10">
                      <button v-for="cur in CURRENCIES" :key="cur.code"
                        @click.stop="selectedCode = cur.code; currencyOpen = false"
                        class="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-[#4A2E23] dark:text-[#D4C7B0] hover:bg-[#E5B326] hover:text-[#4A2E23] transition-colors"
                        :class="cur.code === selectedCode ? 'bg-[#E5B326]/20' : ''">
                        <span class="fi fis rounded-sm flex-shrink-0" :class="`fi-${cur.countryCode}`"></span>
                        <span>{{ cur.code }}</span>
                        <span class="text-xs opacity-60 ml-auto">{{ cur.label }}</span>
                      </button>
                    </div>
                  </div>

                  <div class="dropdown-item flex items-center justify-between gap-3 cursor-pointer !text-[#4A2E23] dark:!text-[#D4C7B0]"
                    @click="darkModeStore.toggle()">
                    <div class="flex items-center gap-3">
                      <i class="bi text-[#E5B326] text-base"
                        :class="darkModeStore.isDark ? 'bi-moon-stars-fill' : 'bi-sun-fill'"></i>
                      <span>{{ darkModeStore.isDark ? 'Sötét mód' : 'Világos mód' }}</span>
                    </div>
                    <button
                      class="w-11 h-6 rounded-full transition-all relative border-2 border-[#4A2E23] dark:border-[#E5B326] flex-shrink-0"
                      :class="darkModeStore.isDark ? 'bg-[#4A2E23]' : 'bg-gray-200'">
                      <div class="absolute top-0.5 transition-all duration-300 w-4 h-4 rounded-full bg-white shadow-md"
                        :style="{ left: darkModeStore.isDark ? '1.35rem' : '0.1rem' }"></div>
                    </button>
                  </div>

                  <div class="dropdown-divider"></div>

                  <button @click="handleLogout"
                    class="dropdown-item w-full text-left flex items-center gap-3 !text-red-500 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/10">
                    <i class="bi bi-box-arrow-right"></i>
                    Kijelentkezés
                  </button>

                </div>
              </Transition>
            </div>
          </li>
        </div>

      </ul>

      <div class="flex xl:hidden items-center justify-between">
        <router-link to="/" class="flex items-center no-underline" @click="closeMenu">
          <img src="../assets/zacipaci-logo.png" alt="ZaciPaci Logo" class="h-12 rounded-full">
          <div class="ml-2">
            <h1 class="text-2xl font-extrabold m-0 text-[#4A2E23] dark:text-[#E5B326] transition-colors duration-300">
              ZaciPaci</h1>
            <p class="text-[13px] m-0 text-[#9a7060] dark:text-[#D4C7B0] transition-colors duration-300">zálogház</p>
          </div>
        </router-link>

        <button class="hamburger" @click="toggleMenu" :class="{ open: menuOpen }" aria-label="Menü">
          <span
            class="block w-[26px] h-[2.5px] bg-[#4A2E23] dark:bg-[#E5B326] rounded-sm transition-all duration-300"></span>
          <span
            class="block w-[26px] h-[2.5px] bg-[#4A2E23] dark:bg-[#E5B326] rounded-sm transition-all duration-300"></span>
          <span
            class="block w-[26px] h-[2.5px] bg-[#4A2E23] dark:bg-[#E5B326] rounded-sm transition-all duration-300"></span>
        </button>
      </div>

      <div class="mobile-menu xl:hidden" :class="{ active: menuOpen }">
        <ul class="list-none mb-0">
          <li><router-link to="/"
              class="mobile-nav-item text-[#4A2E23] dark:text-[#D4C7B0] border-b border-[#4A2E23]/10 dark:border-[#E5B326]/15 hover:text-[#c8960e] dark:hover:text-[#E5B326]"
              @click="closeMenu">Főoldal</router-link></li>
          <li><router-link to="/mukodesunk"
              class="mobile-nav-item text-[#4A2E23] dark:text-[#D4C7B0] border-b border-[#4A2E23]/10 dark:border-[#E5B326]/15 hover:text-[#c8960e] dark:hover:text-[#E5B326]"
              @click="closeMenu">Működésünk</router-link></li>
          <li><router-link to="/rolunk"
              class="mobile-nav-item text-[#4A2E23] dark:text-[#D4C7B0] border-b border-[#4A2E23]/10 dark:border-[#E5B326]/15 hover:text-[#c8960e] dark:hover:text-[#E5B326]"
              @click="closeMenu">Rólunk</router-link></li>
          <li><router-link to="/targy-felvetele"
              class="mobile-nav-item text-[#4A2E23] dark:text-[#D4C7B0] border-b border-[#4A2E23]/10 dark:border-[#E5B326]/15 hover:text-[#c8960e] dark:hover:text-[#E5B326]"
              @click="closeMenu">Tárgy felvétele</router-link></li>
          <li v-if="auth.isLoggedIn" class="px-3 py-2 border-b border-[#4A2E23]/10 dark:border-[#E5B326]/15 flex items-center justify-between">
            <span class="font-bold text-[#4A2E23] dark:text-[#D4C7B0] text-sm flex items-center gap-2">
              <i class="bi bi-bell-fill text-[#E5B326]"></i>
              Értesítések
              <span v-if="unreadCount > 0"
                class="bg-red-500 text-white text-[11px] font-black min-w-5 h-5 px-1 rounded-full flex items-center justify-center">
                {{ unreadCount }}
              </span>
            </span>
            <button @click.stop="toggleNotifications"
              class="text-xs font-bold text-[#E5B326] underline">
              Megnyitás
            </button>
          </li>
          <li v-if="!auth.isLoggedIn">
            <router-link to="/login"
              class="mobile-nav-item flex items-center gap-2 text-[#4A2E23] dark:text-[#D4C7B0] hover:text-[#c8960e] dark:hover:text-[#E5B326]"
              @click="closeMenu">
              <i class="bi bi-person-circle text-lg"></i>
              Bejelentkezés
            </router-link>
          </li>

          <li v-else>
            <div class="flex items-center border-b border-[#4A2E23]/10 dark:border-[#E5B326]/15">
              <router-link to="/profil"
                class="mobile-nav-item flex-1 flex items-center gap-2 text-[#4A2E23] dark:text-[#D4C7B0] hover:text-[#c8960e] dark:hover:text-[#E5B326] border-b-0"
                @click="closeMenu">
                <img v-if="avatarUrl" :src="avatarUrl" class="w-7 h-7 rounded-full object-cover border-2 border-[#E5B326] flex-shrink-0" alt="Profilkép" />
                <i v-else class="bi bi-person-circle text-lg text-[#E5B326]"></i>
                {{ firstName }}
              </router-link>
              <button @click="mobileDropdownOpen = !mobileDropdownOpen"
                class="px-4 py-4 text-[#4A2E23] dark:text-[#D4C7B0] hover:text-[#E5B326] transition-colors">
                <i class="bi transition-transform duration-200"
                  :class="mobileDropdownOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </button>
            </div>

            <div class="mobile-submenu" :class="{ active: mobileDropdownOpen }">
              <router-link to="/profil" @click="closeMenu; mobileDropdownOpen = false"
                class="mobile-sub-item flex items-center gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0]">
                <i class="bi bi-person-gear text-[#E5B326]"></i>
                Profilbeállítások
              </router-link>
              <router-link to="/profil/targyaim" @click="closeMenu; mobileDropdownOpen = false"
                class="mobile-sub-item flex items-center gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0]">
                <i class="bi bi-box-seam text-[#E5B326]"></i>
                Felvett tárgyaim
              </router-link>
              <router-link to="/profil/ajanlatok" @click="closeMenu; mobileDropdownOpen = false"
                class="mobile-sub-item flex items-center gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0]">
                <i class="bi bi-envelope-paper text-[#E5B326]"></i>
                Bejövő ajánlatok
              </router-link>
              <router-link to="/profil/hiteleim" @click="closeMenu; mobileDropdownOpen = false"
                class="mobile-sub-item flex items-center gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0]">
                <i class="bi bi-cash-coin text-[#E5B326]"></i>
                Hiteleim
              </router-link>
              <router-link to="/profil/jelszo" @click="closeMenu; mobileDropdownOpen = false"
                class="mobile-sub-item flex items-center gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0]">
                <i class="bi bi-key text-[#E5B326]"></i>
                Jelszó módosítása
              </router-link>

              <div class="relative">
                <div class="mobile-sub-item flex items-center justify-between gap-3 !text-[#4A2E23] dark:!text-[#D4C7B0] cursor-pointer"
                  @click.stop="currencyOpen = !currencyOpen">
                  <div class="flex items-center gap-3">
                    <i class="bi bi-coin text-[#E5B326]"></i>
                    <span>Valuta</span>
                  </div>
                  <div class="flex items-center gap-2 bg-[#E5B326] rounded-xl px-2 py-1">
                    <span class="fi fis rounded-sm text-sm" :class="`fi-${selectedCurrency.countryCode}`"></span>
                    <span class="text-[#4A2E23] font-bold text-sm">{{ selectedCurrency.code }}</span>
                    <i class="bi text-[#4A2E23] text-xs" :class="currencyOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                  </div>
                </div>
                <div v-if="currencyOpen"
                  class="w-full max-h-48 overflow-y-auto bg-white dark:bg-[#1A1614] border-t border-[#4A2E23]/10 dark:border-[#E5B326]/10">
                  <button v-for="cur in CURRENCIES" :key="cur.code"
                    @click.stop="selectedCode = cur.code; currencyOpen = false"
                    class="w-full flex items-center gap-3 px-6 py-2 text-sm font-bold text-[#4A2E23] dark:text-[#D4C7B0] hover:bg-[#E5B326] hover:text-[#4A2E23] transition-colors"
                    :class="cur.code === selectedCode ? 'bg-[#E5B326]/20' : ''">
                    <span class="fi fis rounded-sm flex-shrink-0" :class="`fi-${cur.countryCode}`"></span>
                    <span>{{ cur.code }}</span>
                    <span class="text-xs opacity-60 ml-auto">{{ cur.label }}</span>
                  </button>
                </div>
              </div>

              <div class="mobile-sub-item flex items-center justify-between gap-3 cursor-pointer !text-[#4A2E23] dark:!text-[#D4C7B0]"
                @click="darkModeStore.toggle()">
                <div class="flex items-center gap-3">
                  <i class="bi text-[#E5B326] text-base"
                    :class="darkModeStore.isDark ? 'bi-moon-stars-fill' : 'bi-sun-fill'"></i>
                  <span>{{ darkModeStore.isDark ? 'Sötét mód' : 'Világos mód' }}</span>
                </div>
                <button
                  class="w-11 h-6 rounded-full transition-all relative border-2 border-[#4A2E23] dark:border-[#E5B326] flex-shrink-0"
                  :class="darkModeStore.isDark ? 'bg-[#4A2E23]' : 'bg-gray-200'">
                  <div class="absolute top-0.5 transition-all duration-300 w-4 h-4 rounded-full bg-white shadow-md"
                    :style="{ left: darkModeStore.isDark ? '1.35rem' : '0.1rem' }"></div>
                </button>
              </div>

              <button @click="handleLogout"
                class="mobile-sub-item w-full text-left flex items-center gap-3 !text-red-500 dark:!text-red-400">
                <i class="bi bi-box-arrow-right"></i>
                Kijelentkezés
              </button>
            </div>
          </li>
        </ul>
      </div>

    </nav>

    <Transition name="dropdown">
      <div v-if="notificationOpen"
        class="xl:hidden fixed top-20 right-2 left-2 rounded-2xl overflow-hidden z-[500] bg-white dark:bg-[#26211E] border-2 border-[#4A2E23] dark:border-[#E5B326] shadow-[4px_4px_0px_#4A2E23] dark:shadow-[4px_4px_0px_#E5B326]">
        <div class="px-4 py-3 border-b border-[#4A2E23]/10 dark:border-[#E5B326]/10 flex items-center justify-between">
          <h3 class="font-black text-[#4A2E23] dark:text-[#FBF5E9] uppercase text-sm">Értesítések</h3>
          <div class="flex items-center gap-2">
            <span v-if="unreadCount > 0"
              class="bg-[#E5B326] text-[#4A2E23] text-[11px] font-black px-2 py-1 rounded-full">
              {{ unreadCount }} új
            </span>
            <button @click="closeNotifications" class="text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 hover:text-[#4A2E23] dark:hover:text-[#D4C7B0] transition-colors ml-1">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <div v-if="notificationLoading" class="p-5 text-center font-bold text-[#4A2E23]/50 dark:text-[#D4C7B0]/50">
          Betöltés...
        </div>

        <div v-else-if="notifications.length" class="max-h-96 overflow-y-auto">
          <button v-for="notification in notifications" :key="notification.id"
            @click="markNotificationAsRead(notification)"
            class="w-full text-left p-4 border-b border-[#4A2E23]/10 dark:border-[#E5B326]/10 hover:bg-[#E5B326]/10 transition-colors"
            :class="!notification.is_read ? 'bg-[#E5B326]/10' : ''">
            <div class="flex gap-3">
              <div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2"
                :class="!notification.is_read
                  ? 'bg-[#E5B326] border-[#4A2E23] text-[#4A2E23]'
                  : 'bg-gray-100 dark:bg-[#1A1614] border-gray-200 dark:border-[#E5B326]/20 text-gray-400'">
                <i class="bi" :class="notification.type === 'OFFER_CREATED'
                  ? 'bi-envelope-paper-fill'
                  : notification.type === 'LOAN_CREATED'
                    ? 'bi-cash-coin'
                    : 'bi-bell-fill'"></i>
              </div>
              <div class="min-w-0">
                <p class="font-black text-sm text-[#4A2E23] dark:text-[#FBF5E9]">{{ notification.title }}</p>
                <p class="text-xs font-bold text-[#4A2E23]/60 dark:text-[#D4C7B0]/60 mt-1">{{ notification.message }}</p>
                <p class="text-[11px] font-bold text-[#4A2E23]/40 dark:text-[#D4C7B0]/40 mt-2">
                  {{ new Date(notification.created_at).toLocaleString('hu-HU') }}
                </p>
              </div>
            </div>
          </button>
        </div>

        <div v-else class="p-8 text-center">
          <div class="w-14 h-14 rounded-full bg-gray-100 dark:bg-[#1A1614] border-2 border-dashed border-gray-300 dark:border-[#E5B326]/30 mx-auto mb-3 flex items-center justify-center">
            <i class="bi bi-bell-slash text-2xl text-gray-300 dark:text-[#D4C7B0]/30"></i>
          </div>
          <p class="font-black text-xs uppercase text-[#4A2E23]/40 dark:text-[#D4C7B0]/40">Nincs értesítés</p>
        </div>
      </div>
    </Transition>

  </header>
</template>

<style scoped>
@import "https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.3.2/css/flag-icons.min.css";

.nav-item {
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
  letter-spacing: 0.3px;
  padding-bottom: 4px;
  position: relative;
  transition: color 0.3s ease;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  right: 50%;
  height: 2px;
  background: linear-gradient(90deg, #E5B326, #c8960e);
  border-radius: 2px;
  transition: left 0.3s ease, right 0.3s ease;
}

.nav-item:hover::after {
  left: 0;
  right: 0;
}

.profil-link {
  background: linear-gradient(135deg, #E5B326, #c8960e);
  color: #fff !important;
  padding: 8px 18px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(229, 179, 38, 0.35);
}

.profil-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 16px rgba(229, 179, 38, 0.5);
}

.currency-box {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.currency-select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.currency-select {
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  border: 1.5px solid #E5B326;
  border-radius: 20px;
  padding: 5px 30px 5px 14px;
  font-weight: 700;
  font-size: 15px;
  color: #4A2E23;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-shadow: 0 1px 4px rgba(229, 179, 38, 0.15);
  letter-spacing: 0.5px;
}

.currency-select:hover,
.currency-select:focus {
  border-color: #c8960e;
  background: rgba(229, 179, 38, 0.08);
  box-shadow: 0 2px 8px rgba(229, 179, 38, 0.25);
}

:global(.dark) .currency-select {
  color: #D4C7B0;
  border-color: #E5B326;
}

:global(.dark) .currency-select:hover,
:global(.dark) .currency-select:focus {
  background: rgba(229, 179, 38, 0.12);
}

.currency-arrow {
  position: absolute;
  right: 10px;
  pointer-events: none;
  font-size: 11px;
  color: #c8960e;
  line-height: 1;
}

.currency-rate {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 600;
  color: #9a7060;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

:global(.dark) .currency-rate {
  color: #D4C7B0;
}

.currency-rate-mobile {
  position: static;
  transform: none;
  font-size: 12px;
}

.currency-loading {
  opacity: 0.5;
  animation: pulse 1s infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.logo-img {
  height: 110px;
  border-radius: 50%;
}

.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

.mobile-menu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.35s ease;
}

.mobile-menu.active {
  max-height: 800px;
  padding: 10px 0;
}

.mobile-nav-item {
  display: block;
  padding: 13px 6px;
  font-weight: 600;
  font-size: 17px;
  text-decoration: none;
  transition: color 0.2s, padding-left 0.25s ease, background 0.2s;
}

.mobile-nav-item:hover {
  padding-left: 14px;
  background: rgba(229, 179, 38, 0.07);
}

.profil-link-main {
  background: linear-gradient(135deg, #E5B326, #c8960e);
  color: #fff !important;
  padding: 8px 14px 8px 18px;
  border-radius: 25px 0 0 25px;
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
  white-space: nowrap;
  transition: filter 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(229, 179, 38, 0.35);
}

.profil-link-main:hover {
  filter: brightness(1.08);
}

/*megakadalyozza a felulirasat az aktiv router-link ovalis gomb stilusat!*/
.profil-oval-link,
.profil-oval-link:visited,
.profil-oval-link.router-link-active,
.profil-oval-link.router-link-exact-active {
  color: white !important;
  text-decoration: none !important;
  background: transparent !important;
  font-weight: 700;
  font-size: 20px;
}

.profil-arrow {
  background: linear-gradient(135deg, #c8960e, #a97b0a);
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 0 25px 25px 0;
  font-size: 14px;
  cursor: pointer;
  transition: filter 0.2s ease;
  box-shadow: 0 2px 8px rgba(229, 179, 38, 0.35);
  display: flex;
  align-items: center;
}

.profil-arrow:hover,
.profil-arrow.arrow-open {
  filter: brightness(1.15);
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 15px;
  color: #4A2E23;
  text-decoration: none;
  transition: background 0.2s, color 0.2s, padding-left 0.2s;
  cursor: pointer;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(229, 179, 38, 0);
  width: 100%;
}

:global(.dark) .dropdown-item {
  color: #D4C7B0;
}

.dropdown-item:hover {
  background: #E5B326;
  color: #4A2E23 !important;
  padding-left: 22px;
}

:global(.dark) .dropdown-item:hover {
  background: #E5B326;
  color: #4A2E23 !important;
}

.dropdown-item:hover .bi {
  color: #4A2E23 !important;
}

.dropdown-item:hover i {
  color: #4A2E23 !important;
}

.dropdown-divider {
  height: 1px;
  background: rgba(74, 46, 35, 0.1);
  margin: 2px 12px;
}

:global(.dark) .dropdown-divider {
  background: rgba(229, 179, 38, 0.1);
}

.dropdown-item:first-child { border-radius: 14px 14px 0 0; }
.dropdown-item:last-child { border-radius: 0 0 14px 14px; }

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.mobile-submenu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: rgba(229, 179, 38, 0.04);
}

.mobile-submenu.active {
  max-height: none;
}

.mobile-sub-item {
  display: flex;
  align-items: center;
  padding: 11px 6px 11px 20px;
  font-weight: 600;
  font-size: 15px;
  color: #4A2E23;
  text-decoration: none;
  border-bottom: 1px solid rgba(74, 46, 35, 0.06);
  transition: background 0.2s, padding-left 0.2s;
  cursor: pointer;
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
  width: 100%;
}

:global(.dark) .mobile-sub-item {
  color: #D4C7B0;
  border-bottom-color: rgba(229, 179, 38, 0.08);
}

.mobile-sub-item:hover {
  background: #E5B326;
  padding-left: 28px;
  color: #4A2E23 !important;
}

.mobile-sub-item:hover .bi,
.mobile-sub-item:hover i {
  color: #4A2E23 !important;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }
}
</style>