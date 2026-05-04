<script setup>
import Footer from '../components/Footer.vue'
import MainHeader from '../components/MainHeader.vue'
import TargyFelveteleForm from '../components/TargyFelveteleForm.vue';
</script>

<template>
  <MainHeader />
  <main class="transition-colors">
    <section class="py-10 md:py-20 bg-[#FBF5E9]/30 dark:bg-[#1A1614] transition-colors">
      <div class="container mx-auto px-4 max-w-3xl">

        <div class="text-center mb-10">
          <h2 class="text-[32px] md:text-[42px] font-extrabold text-[#4A2E23] dark:text-[#E5B326] leading-tight">
            Azonnali készpénz,<br class="md:hidden"> néhány kattintással!
          </h2>
          <div class="w-24 md:w-48 h-1.5 bg-[#E5B326] mx-auto mt-4 rounded-full"></div>
        </div>

        <TargyFelveteleForm />

      </div>
    </section>
  </main>
  <Footer />
</template>