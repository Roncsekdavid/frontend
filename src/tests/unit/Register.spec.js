import { describe, expect, test, vi } from "vitest";
import Register from "../../views/Register.vue";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", component: { template: "<div/>" } },
        { path: "/login", component: { template: "<div/>" } },
    ],
});

vi.mock("../../services/authService", () => ({
    register: vi.fn(),
}));

import { register } from "../../services/authService";

describe("Register komponens teszt", () => {
    const mountWrapper = () =>
        mount(Register, { global: { plugins: [router] } });

    const fillValidForm = async (wrapper) => {
        await wrapper.find('input[type="text"]').setValue("Teszt Elek");
        await wrapper.find('input[type="tel"]').setValue("3630123456789");
        await wrapper.find('input[type="email"]').setValue("teszt@email.com");
        const passwordInputs = wrapper.findAll('input[type="password"]');
        await passwordInputs[0].setValue("Jelszo123");
        await passwordInputs[1].setValue("Jelszo123");
    };

    test("Alapállapotban a form látható, a sikeres képernyő nem", () => {
        const wrapper = mountWrapper();
        expect(wrapper.find("form").exists()).toBe(true);
        expect(wrapper.find(".animate-fade-in").exists()).toBe(false);
    });

    test("Alapállapotban nincs hibaüzenet", () => {
        const wrapper = mountWrapper();
        expect(wrapper.find(".animate-shake").exists()).toBe(false);
    });

    test("Hibaüzenet jelenik meg, ha a név egy szóból áll", async () => {
        const wrapper = mountWrapper();
        await wrapper.find('input[type="text"]').setValue("Teszt");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Kérjük adjon meg érvényes nevet!");
    });

    test("Hibaüzenet jelenik meg, ha a telefonszám túl rövid", async () => {
        const wrapper = mountWrapper();
        await wrapper.find('input[type="text"]').setValue("Teszt Elek");
        await wrapper.find('input[type="tel"]').setValue("36301");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("A telefonszám túl rövid!");
    });

    test("Hibaüzenet jelenik meg, ha a jelszó túl rövid", async () => {
        const wrapper = mountWrapper();
        await wrapper.find('input[type="text"]').setValue("Teszt Elek");
        await wrapper.find('input[type="tel"]').setValue("3630123456789");
        await wrapper.find('input[type="email"]').setValue("teszt@email.com");
        const passwordInputs = wrapper.findAll('input[type="password"]');
        await passwordInputs[0].setValue("Abc1");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("A jelszó nem felel meg a követelményeknek!");
    });

    test("Hibaüzenet jelenik meg, ha a két jelszó nem egyezik", async () => {
        const wrapper = mountWrapper();
        await wrapper.find('input[type="text"]').setValue("Teszt Elek");
        await wrapper.find('input[type="tel"]').setValue("3630123456789");
        await wrapper.find('input[type="email"]').setValue("teszt@email.com");
        const passwordInputs = wrapper.findAll('input[type="password"]');
        await passwordInputs[0].setValue("Jelszo123");
        await passwordInputs[1].setValue("MasJelszo123");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("A két jelszó nem egyezik meg!");
    });

    test("Sikeres regisztrációkor a megerősítő képernyő jelenik meg", async () => {
        register.mockResolvedValueOnce({});
        const wrapper = mountWrapper();
        await fillValidForm(wrapper);
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".animate-fade-in").exists()).toBe(true);
        expect(wrapper.find("form").exists()).toBe(false);
    });

    test("Sikertelen regisztrációkor az API hibaüzenet jelenik meg", async () => {
        register.mockRejectedValueOnce({
            response: { data: { error: "Ez az email cím már foglalt!" } },
        });
        const wrapper = mountWrapper();
        await fillValidForm(wrapper);
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Ez az email cím már foglalt!");
    });
});