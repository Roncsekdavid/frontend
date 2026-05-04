import { describe, expect, test, vi } from "vitest";
import Jelszomodositas from "../../components/Jelszomodositas.vue";
import { mount } from "@vue/test-utils";

vi.mock("../../services/api", () => ({
    default: {
        patch: vi.fn(),
    },
}));

import api from "../../services/api";

describe("Jelszomodositas komponens teszt", () => {
    const mountWrapper = () => mount(Jelszomodositas);

    const inputs = (wrapper) => wrapper.findAll('input[type="password"]');

    test("Megjelenik a 'Jelszó módosítása' fejléc", () => {
        const wrapper = mountWrapper();
        const h2 = wrapper.find("h2");
        expect(h2.text()).toContain("Jelszó módosítása");
    });

    test("Alapállapotban nincs hiba- és sikerüzenet", () => {
        const wrapper = mountWrapper();
        expect(wrapper.find(".bg-red-50").exists()).toBe(false);
        expect(wrapper.find(".bg-green-50").exists()).toBe(false);
    });

    test("Hibaüzenet jelenik meg, ha a jelenlegi jelszó üres", async () => {
        const wrapper = mountWrapper();
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Kérjük adja meg a jelenlegi jelszavát!");
    });

    test("Hibaüzenet jelenik meg, ha az új jelszó nem felel meg a követelményeknek", async () => {
        const wrapper = mountWrapper();
        const all = inputs(wrapper);
        await all[0].setValue("RegiJelszo1");
        await all[1].setValue("rovid");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Az új jelszó nem felel meg a követelményeknek!");
    });

    test("Hibaüzenet jelenik meg, ha a két új jelszó nem egyezik", async () => {
        const wrapper = mountWrapper();
        const all = inputs(wrapper);
        await all[0].setValue("RegiJelszo1");
        await all[1].setValue("UjJelszo123");
        await all[2].setValue("MasJelszo123");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("A két új jelszó nem egyezik meg!");
    });

    test("Hibaüzenet jelenik meg, ha az új jelszó megegyezik a régivel", async () => {
        const wrapper = mountWrapper();
        const all = inputs(wrapper);
        await all[0].setValue("Azonos123");
        await all[1].setValue("Azonos123");
        await all[2].setValue("Azonos123");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Az új jelszó nem egyezhet meg a jelenlegivel!");
    });

    test("Érvényes adatoknál megerősítő modál jelenik meg", async () => {
        const wrapper = mountWrapper();
        const all = inputs(wrapper);
        await all[0].setValue("RegiJelszo1");
        await all[1].setValue("UjJelszo123");
        await all[2].setValue("UjJelszo123");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".fixed").exists()).toBe(true);
    });

    test("Sikeres mentés után megjelenik a sikerüzenet és a mezők kiürülnek", async () => {
        api.patch.mockResolvedValueOnce({});
        const wrapper = mountWrapper();
        const all = inputs(wrapper);
        await all[0].setValue("RegiJelszo1");
        await all[1].setValue("UjJelszo123");
        await all[2].setValue("UjJelszo123");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        
        /*Megerősítő modál confirmSave meghívása*/
        await wrapper.vm.confirmSave();
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("A jelszó sikeresen megváltozott!");
        expect(all[0].element.value).toBe("");
    });

    test("Sikertelen mentés esetén az API hibaüzenet jelenik meg", async () => {
        api.patch.mockRejectedValueOnce({
            response: { data: { error: "A jelenlegi jelszó helytelen!" } },
        });
        const wrapper = mountWrapper();
        const all = inputs(wrapper);
        await all[0].setValue("RegiJelszo1");
        await all[1].setValue("UjJelszo123");
        await all[2].setValue("UjJelszo123");
        await wrapper.find("form").trigger("submit");
        await wrapper.vm.$nextTick();
        await wrapper.vm.confirmSave();
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("A jelenlegi jelszó helytelen!");
    });
});