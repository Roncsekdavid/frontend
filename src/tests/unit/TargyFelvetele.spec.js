import { describe, expect, test, vi, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TargyFelveteleForm from "../../components/TargyFelveteleForm.vue";

vi.mock("../../services/api", () => ({
    default: { post: vi.fn() },
}));
import api from "../../services/api";

describe("TárgyFelvétele komponens teszt", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mountWrapper = () => shallowMount(TargyFelveteleForm);

    const makeFile = (name = "foto.jpg", type = "image/jpeg", sizeMB = 1) =>
        new File(["x".repeat(sizeMB * 1024 * 1024)], name, { type });

    const fillFields = async (wrapper) => {
        await wrapper.find("#item-name").setValue("Aranyóra");
        await wrapper.find("#price").setValue("50000");
        await wrapper.find("#about").setValue("Szép állapotú aranyóra.");
        await wrapper.find("#category").setValue("Órák");
    };

    const addFileViaInput = async (wrapper, file) => {
        const input = wrapper.find('input[type="file"]');
        Object.defineProperty(input.element, "files", {
            value: [file],
            writable: false,
            configurable: true,
        });
        await input.trigger("change");
        await wrapper.vm.$nextTick();
    };

    const waitForAsync = async (wrapper, ticks = 5) => {
        for (let i = 0; i < ticks; i++) await wrapper.vm.$nextTick();
    };

    test("Alapállapotban nincs sikerüzenet", () => {
        const wrapper = mountWrapper();
        expect(wrapper.find(".bg-green-50").exists()).toBe(false);
    });

    test("Hibaüzenet jelenik meg, ha az összes mező üres és nincs kép", async () => {
        const wrapper = mountWrapper();
        await wrapper.find("button").trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Kérjük adja meg a tárgy megnevezését.");
        expect(wrapper.text()).toContain("Kérjük adja meg az igényelt összegét.");
        expect(wrapper.text()).toContain("Kérjük írjon leírást a tárgyról.");
        expect(wrapper.text()).toContain("Kérjük válasszon kategóriát.");
        expect(wrapper.text()).toContain("Legalább egy képet csatolnia kell.");
    });

    test("Hibaüzenet jelenik meg, ha a mezők ki vannak töltve, de nincs kép", async () => {
        const wrapper = mountWrapper();
        await fillFields(wrapper);
        await wrapper.find("button").trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain("Legalább egy képet csatolnia kell.");
    });

    test("Érvényes JPG fájl hozzáadása megjelenik a listában", async () => {
        const wrapper = mountWrapper();
        await addFileViaInput(wrapper, makeFile("foto.jpg", "image/jpeg", 1));
        expect(wrapper.text()).toContain("foto.jpg");
    });

    test("Érvényes PNG fájl hozzáadása megjelenik a listában", async () => {
        const wrapper = mountWrapper();
        await addFileViaInput(wrapper, makeFile("kep.png", "image/png", 2));
        expect(wrapper.text()).toContain("kep.png");
    });

    test("Nem támogatott formátumú fájl hibával jelenik meg", async () => {
        const wrapper = mountWrapper();
        await addFileViaInput(wrapper, makeFile("dok.pdf", "application/pdf", 1));
        expect(wrapper.text()).toContain("Nem támogatott formátum");
    });

    test("5MB-nál nagyobb fájl hibával jelenik meg", async () => {
        const wrapper = mountWrapper();
        await addFileViaInput(wrapper, makeFile("nagy.jpg", "image/jpeg", 6));
        expect(wrapper.text()).toContain("Túl nagy (max 5MB)");
    });

    test("Duplikált fájl nem kerül be kétszer a listába", async () => {
        const wrapper = mountWrapper();
        const file = makeFile("foto.jpg", "image/jpeg", 1);
        await addFileViaInput(wrapper, file);
        await addFileViaInput(wrapper, file);
        expect(wrapper.findAll("li").length).toBe(1);
    });

    test("Fájl eltávolítása működik", async () => {
        const wrapper = mountWrapper();
        await addFileViaInput(wrapper, makeFile("foto.jpg", "image/jpeg", 1));
        expect(wrapper.findAll("li").length).toBe(1);
        await wrapper.find("li button").trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.findAll("li").length).toBe(0);
    });

    test("Sikeres beküldés után sikerüzenet jelenik meg és mezők kiürülnek", async () => {
        api.post.mockResolvedValueOnce({ data: { id: 1 } });
        const wrapper = mountWrapper();
        await fillFields(wrapper);
        await addFileViaInput(wrapper, makeFile("foto.jpg", "image/jpeg", 1));
        await wrapper.find("button").trigger("click");
        await waitForAsync(wrapper);
        expect(wrapper.find(".bg-green-50").exists()).toBe(true);
        expect(wrapper.find("#item-name").element.value).toBe("");
        expect(wrapper.findAll("li").length).toBe(0);
    });

    test("Sikertelen beküldés esetén API hibaüzenet jelenik meg", async () => {
        api.post.mockRejectedValueOnce({
            response: { data: { error: "Nem sikerült a feltöltés." } },
        });
        const wrapper = mountWrapper();
        await fillFields(wrapper);
        await addFileViaInput(wrapper, makeFile("foto.jpg", "image/jpeg", 1));
        await wrapper.find("button").trigger("click");
        await waitForAsync(wrapper);
        /*A hiba a fieldErrors.name-be kerül, ami a #item-name mező alatt jelenik meg*/
        const errorParagraphs = wrapper.findAll("p.text-red-500");
        const errorTexts = errorParagraphs.map(p => p.text());
        expect(errorTexts.some(t => t.includes("Nem sikerült a feltöltés."))).toBe(true);
    });
});