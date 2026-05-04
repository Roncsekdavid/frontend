import { describe, expect, test, vi } from "vitest";
import Login from "../../views/Login.vue";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: "/", component: { template: "<div/>" } }],
});

/*authService mock – ne legyen valódi API hívás*/
vi.mock("../../services/authService", () => ({
    login: vi.fn(),
}));

import { login } from "../../services/authService";

describe("Login komponens teszt", () => {
    const mountWrapper = (props = {}) =>
        mount(Login, {
            global: { plugins: [router] },
            props,
        });

    test("Megjelenik a Bejelentkezés fejléc", () => {
        const wrapper = mountWrapper();
        const h2 = wrapper.find("h2");
        expect(h2.text()).toBe("Bejelentkezés");
    });

    test("Alapállapotban nincs hibaüzenet", () => {
        const wrapper = mountWrapper();
        const errorDiv = wrapper.find(".animate-shake");
        expect(errorDiv.exists()).toBe(false);
    });

    test("authMessage prop megjelenik, ha van értéke", () => {
        const wrapper = mountWrapper({ authMessage: "Kérjük jelentkezzen be!" });
        expect(wrapper.text()).toContain("Kérjük jelentkezzen be!");
    });

    test("authMessage prop nem jelenik meg, ha üres", () => {
        const wrapper = mountWrapper({ authMessage: "" });
        const msgDiv = wrapper.find(".bg-amber-50");
        expect(msgDiv.exists()).toBe(false);
    });

    test("Email mező értéke frissül gépelésre", async () => {
        const wrapper = mountWrapper();
        const input = wrapper.find("#email");
        await input.setValue("teszt@email.com");
        expect(input.element.value).toBe("teszt@email.com");
    });

    test("Jelszó mező alapban password típusú", () => {
        const wrapper = mountWrapper();
        const input = wrapper.find("#password");
        expect(input.attributes("type")).toBe("password");
    });

    test("Sikertelen bejelentkezés esetén hibaüzenet jelenik meg", async () => {
        login.mockRejectedValueOnce({
            response: { data: { error: "Érvénytelen email vagy jelszó!" } },
        });
        const wrapper = mountWrapper();
        await wrapper.find("#email").setValue("hibas@email.com");
        await wrapper.find("#password").setValue("rosszjelszo");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Érvénytelen email vagy jelszó!");
    });

    test("Sikeres bejelentkezéskor a router a főoldalra navigál", async () => {
        login.mockResolvedValueOnce({});
        const wrapper = mountWrapper();
        await wrapper.find("#email").setValue("jo@email.com");
        await wrapper.find("#password").setValue("Helyes1234");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(router.currentRoute.value.path).toBe("/");
    });
});